'use client';
import { useCallback, useEffect, useState } from 'react';
import type { PublicAttempt, PublicProgress } from '@/domain/types';
import { api } from '@/lib/api';
import { useLearning } from '@/components/learning/learning-provider';

interface Response { progress: PublicProgress; attempt: PublicAttempt|null }
export function useAssessment(slug:string){
 const {accept}=useLearning();const [attempt,setAttempt]=useState<PublicAttempt|null>(null);const [loading,setLoading]=useState(true);const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const endpoint=`/api/lessons/${slug}/attempt`;
 const receive=useCallback((data:Response)=>{setAttempt(data.attempt);accept(data.progress);},[accept]);
 const reload=useCallback(async()=>{setLoading(true);try{receive(await api<Response>(endpoint));setError('');}catch(e){setError((e as Error).message);}finally{setLoading(false);}},[endpoint,receive]);
 useEffect(()=>{void reload();},[reload]);
 async function request(method:string,body?:unknown){if(busy)return;setBusy(true);setError('');try{receive(await api<Response>(endpoint,method,body));}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return {attempt,loading,busy,error,reload,start:()=>request('POST'),answer:(questionId:string,selectedChoiceIds:string[])=>request('PATCH',{action:'answer',attemptId:attempt?.id,questionId,selectedChoiceIds}),hint:(questionId:string)=>request('PATCH',{action:'hint',attemptId:attempt?.id,questionId}),submit:()=>request('PATCH',{action:'submit',attemptId:attempt?.id})};
}
