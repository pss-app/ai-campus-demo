import 'server-only';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { LearningError } from '@/domain/assessment';
import type { LearningSession } from '@/domain/types';
import { learningRepository } from './repository';

const cookieName='ai-campus-demo-session';
export async function withLearningSession(request:NextRequest,operation:(s:LearningSession)=>Promise<unknown>|unknown){
  try{
    if(request.method!=='GET'){
      const origin=request.headers.get('origin');
      // Next.js may normalize nextUrl to localhost; Host retains the browser's destination.
      const expectedOrigin=`${request.nextUrl.protocol}//${request.headers.get('host') ?? request.nextUrl.host}`;
      if(origin&&origin!==expectedOrigin)throw new LearningError('別のサイトからの更新は受け付けられません。',403);
    }
    const existing=request.cookies.get(cookieName)?.value;
    const id=existing&&/^[a-f0-9-]{36}$/.test(existing)?existing:randomUUID();
    const data=await learningRepository.transact(id,operation);
    const response=NextResponse.json(data,{headers:{'Cache-Control':'no-store'}});
    response.cookies.set(cookieName,id,{httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',path:'/',maxAge:60*60*24*30});
    return response;
  }catch(error){
    if(error instanceof LearningError)return NextResponse.json({error:error.message},{status:error.status});
    if(error instanceof ZodError||error instanceof SyntaxError)return NextResponse.json({error:'送信内容を確認してください。'},{status:400});
    console.error('Learning API failed',error);
    return NextResponse.json({error:'保存または読み込みに失敗しました。時間を置いてもう一度お試しください。'},{status:500});
  }
}
