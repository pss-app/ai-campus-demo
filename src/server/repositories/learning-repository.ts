import type { LearningSession } from '@/domain/types';

/** 採点と保存は同じ更新単位で行う。Supabase移行時はDBトランザクションで実装する。 */
export interface LearningRepository {
  transact<T>(id:string,operation:(session:LearningSession)=>Promise<T>|T):Promise<T>;
}
