import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { LearningSession } from '@/domain/types';
import type { LearningRepository } from './learning-repository';

/** ローカル確認専用。単一Nodeプロセスで利用する。本番・複数台運用には使わない。 */
export class FileLearningRepository implements LearningRepository {
  private queues=new Map<string,Promise<unknown>>();
  constructor(private directory=path.join(process.cwd(),'.local-data/learning')){}
  async transact<T>(id:string,operation:(session:LearningSession)=>Promise<T>|T):Promise<T>{
    if(!/^[a-f0-9-]{36}$/.test(id))throw Error('Invalid session ID');
    const preceding=this.queues.get(id)??Promise.resolve();
    const task=preceding.catch(()=>{}).then(async()=>{
      await mkdir(this.directory,{recursive:true});
      const file=path.join(this.directory,`${id}.json`);
      let state:LearningSession;
      try{state=JSON.parse(await readFile(file,'utf8')) as LearningSession;if(state.schemaVersion!==1||state.id!==id)throw Error('Invalid stored session');}
      catch(error){if((error as NodeJS.ErrnoException).code!=='ENOENT')throw error;state={schemaVersion:1,id,revision:0,reviewMode:false,notes:{},confirmations:{},attempts:[]};}
      state.revision++;
      const result=await operation(state);
      const temporary=`${file}.${randomUUID()}.tmp`;
      await writeFile(temporary,JSON.stringify(state),'utf8');
      await rename(temporary,file);
      return result;
    });
    this.queues.set(id,task);
    try{return await task;}finally{if(this.queues.get(id)===task)this.queues.delete(id);}
  }
}
