import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { FileLearningRepository } from '../src/server/repositories/file-learning-repository';

test('並行更新を直列化し、再起動後も記録を読み出す',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'ai-campus-repository-'));const repo=new FileLearningRepository(directory);const id=randomUUID();
 await Promise.all(Array.from({length:12},(_,i)=>repo.transact(id,s=>{s.notes[`note-${i}`]=`value-${i}`;})));
 const restarted=new FileLearningRepository(directory);const saved=await restarted.transact(id,s=>({...s}));assert.equal(Object.keys(saved.notes).length,12);assert.equal(saved.revision,13);
 const other=await repo.transact(randomUUID(),s=>s.notes);assert.deepEqual(other,{});
 await assert.rejects(repo.transact('../unsafe',()=>{}));
});
test('失敗した採点・更新を保存しない',async()=>{
 const directory=await mkdtemp(path.join(tmpdir(),'ai-campus-rollback-'));const repo=new FileLearningRepository(directory);const id=randomUUID();
 await repo.transact(id,s=>{s.notes.saved='original';});
 const before=await readFile(path.join(directory,`${id}.json`),'utf8');
 await assert.rejects(repo.transact(id,s=>{s.notes.saved='bad';throw Error('fail');}));
 assert.equal(await readFile(path.join(directory,`${id}.json`),'utf8'),before);
});
