'use client';
import type { PublicQuestion } from '@/domain/types';

export function QuestionField({question,index,total,busy,onAnswer,onHint}:{question:PublicQuestion;index:number;total:number;busy:boolean;onAnswer:(ids:string[])=>void;onHint:()=>void}){
 const multiple=question.type==='multiple_choice';
 function change(id:string,checked:boolean){onAnswer(multiple?(checked?[...question.selectedChoiceIds,id]:question.selectedChoiceIds.filter(x=>x!==id)):[id]);}
 return <section className="question-card"><p className="question-counter">問題 {index+1} / {total}</p><fieldset disabled={busy} aria-describedby={`${question.id}-instruction`}><legend>{question.prompt}</legend><p className="supporting" id={`${question.id}-instruction`}>{multiple?'当てはまるものをすべて選んでください。':'一つ選んでください。'}</p><div className="choices">{question.choices.map(c=><label key={c.id} className="choice"><input type={multiple?'checkbox':'radio'} name={question.id} value={c.id} checked={question.selectedChoiceIds.includes(c.id)} onChange={e=>change(c.id,e.target.checked)}/><span>{c.text}</span></label>)}</div></fieldset>{question.hintUsed?<aside className="hint"><p className="callout-label">ヒント</p><p>{question.hint}</p></aside>:<button type="button" className="text-button" disabled={busy} onClick={onHint}>ヒントを見る</button>}</section>;
}
