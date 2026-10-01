'use client';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { PublicProgress } from '@/domain/types';
import { api } from '@/lib/api';

type LearningContext={progress:PublicProgress|null;error:string;refresh:()=>Promise<void>;accept:(p:PublicProgress)=>void;update:(body:unknown)=>Promise<PublicProgress>};
const Context=createContext<LearningContext|null>(null);
export function LearningProvider({children}:{children:ReactNode}){
  const [progress,setProgress]=useState<PublicProgress|null>(null);const [error,setError]=useState('');
  const accept=useCallback((p:PublicProgress)=>setProgress(old=>!old||p.revision>=old.revision?p:old),[]);
  const refresh=useCallback(async()=>{try{accept(await api<PublicProgress>('/api/learning'));setError('');}catch(e){setError((e as Error).message);}},[accept]);
  useEffect(()=>{void refresh();},[refresh]);
  const update=useCallback(async(body:unknown)=>{const p=await api<PublicProgress>('/api/learning','PATCH',body);accept(p);return p;},[accept]);
  return <Context.Provider value={{progress,error,refresh,accept,update}}>{children}</Context.Provider>;
}
export function useLearning(){const context=useContext(Context);if(!context)throw Error('LearningProvider is missing');return context;}
