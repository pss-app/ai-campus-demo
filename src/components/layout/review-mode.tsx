'use client';
import { useState } from 'react';
import { useLearning } from '@/components/learning/learning-provider';

export function ReviewMode(){const {progress,update}=useLearning();const [busy,setBusy]=useState(false);const [error,setError]=useState('');
  async function toggle(value:boolean){setBusy(true);setError('');try{await update({action:'reviewMode',enabled:value});}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
  return <div className="review-control"><label><input type="checkbox" checked={progress?.reviewMode??false} disabled={!progress||busy} onChange={e=>void toggle(e.target.checked)}/>教材確認モード</label><p>順番を飛ばして閲覧できます。合格記録は付きません。</p>{error&&<p role="alert">{error}</p>}</div>;
}
