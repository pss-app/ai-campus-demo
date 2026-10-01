'use client';
import Link from 'next/link';
import type { Course } from '@/domain/types';
import { lessonComplete } from '@/domain/assessment';
import { lessonPath } from '@/lib/routes';
import { useLearning } from './learning-provider';

export function LearningRecords({course,titles}:{course:Course;titles:Record<string,string>}){
 const {progress,error,refresh}=useLearning();
 if(error)return <div role="alert"><p>{error}</p><button onClick={()=>void refresh()}>再読み込み</button></div>;
 if(!progress)return <p role="status">学習記録を読み込んでいます…</p>;
 function download(){const blob=new Blob([JSON.stringify({schemaVersion:1,courseId:course.id,exportedAt:new Date().toISOString(),...progress,notes:Object.fromEntries(Object.entries(progress!.notes).filter(([id])=>course.lessons.some(l=>l.id===id))),confirmations:Object.fromEntries(Object.entries(progress!.confirmations).filter(([id])=>course.lessons.some(l=>l.objectiveIds.includes(id)))),records:progress!.records.filter(r=>course.lessons.some(l=>l.id===r.lessonId))},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=course.id+'-learning-record.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 return <><div className="record-summary"><p><strong>{course.lessons.filter(l=>lessonComplete(l,progress.confirmations)).length}</strong> / {course.lessons.length} レッスンの理解を確認</p><button className="button secondary" onClick={download}>学習記録を書き出す</button></div><p className="supporting">補助ありの正解も学習の一歩です。回答の件数が少ない段階では、理解の定着や意欲、不正の有無を断定しません。</p>{course.lessons.map(l=>{const records=progress.records.filter(r=>r.lessonId===l.id);return <section className="record-card" key={l.id}><h3>{l.title}</h3><p>回答 {records.length}件 ／ ヒントなし正解 {records.filter(r=>r.correct&&!r.hintUsed&&!r.supported).length}件 ／ 補助あり正解 {records.filter(r=>r.correct&&(r.hintUsed||r.supported)).length}件</p><dl>{l.objectiveIds.map(id=><div key={id}><dt>{titles[id]}</dt><dd>{progress.confirmations[id]?(progress.confirmations[id].assisted?'補助ありで確認済み':'確認済み'):'未確認'}</dd></div>)}</dl>{progress.notes[l.id]&&<details><summary>学習メモを読む</summary><p className="note-text">{progress.notes[l.id]}</p></details>}{lessonComplete(l,progress.confirmations)&&<Link href={lessonPath(l.slug)}>解説を復習する</Link>}</section>;})}<section className="practice"><h3>コース修了課題：{course.finalTask?.title??'自分のPC説明書'}</h3><p>{course.finalTask?.description??'機器の構成、OS、使用アプリ、保存場所、文書を編集・保存する流れを、自分の環境に沿って説明します。確認元と未確認事項を分けて記録してください。'}</p><p>この確認版では、課題の提出・講師採点は未接続です。ミニテストをすべて終えたことと、コース修了の認定は分けて扱います。</p></section></>;
}

