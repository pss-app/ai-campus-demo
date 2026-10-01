'use client';
import { useEffect, useState } from 'react';
import type { Lesson } from '@/domain/types';
import { useLearning } from './learning-provider';

export function PracticeNote({lesson}:{lesson:Lesson}){
 const {progress,update}=useLearning();const stored=progress?.notes[lesson.id]??'';
 const [text,setText]=useState(stored);const [status,setStatus]=useState('');const [saving,setSaving]=useState(false);
 useEffect(()=>{setText(stored);},[stored]);
 const dirty=text!==stored;
 useEffect(()=>{if(!dirty)return;const handler=(e:BeforeUnloadEvent)=>e.preventDefault();window.addEventListener('beforeunload',handler);return()=>window.removeEventListener('beforeunload',handler);},[dirty]);
 async function save(){setSaving(true);try{await update({action:'note',lessonSlug:lesson.slug,text});setStatus('メモを保存しました。');}catch(e){setStatus((e as Error).message);}finally{setSaving(false);}}
 return <section className="practice"><h2>自分の言葉で確かめる</h2><p>{lesson.practice}</p><label htmlFor="practice-note">学習メモ</label><p id="note-help" className="supporting">自動採点はしません。未確認のことも記録できます。書いた後に「メモを保存」を押してください。</p><textarea id="practice-note" aria-describedby="note-help" value={text} maxLength={20000} onChange={e=>{setText(e.target.value);setStatus('');}} rows={5}/><div className="button-row"><button type="button" className="button secondary" disabled={saving||!dirty} onClick={()=>void save()}>{saving?'保存中…':'メモを保存'}</button><span role="status" className="supporting">{status||(dirty?'未保存の変更があります。':'')}</span></div></section>;
}
