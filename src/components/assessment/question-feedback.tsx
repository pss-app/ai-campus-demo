import Link from 'next/link';
import type { PublicQuestion } from '@/domain/types';
import { lessonPath } from '@/lib/routes';
import { Callout } from '@/components/content/callout';

export function QuestionFeedback({question,slug}:{question:PublicQuestion;slug:string}){
 const correct=question.result?.correct;
 return <section className="question-card"><h3>{question.objectiveTitle}</h3><p className="status-tag">{correct?(question.hintUsed||question.supported?'補助ありで確認':'今回ヒントなしで正解'):'もう一度確認する項目'}</p><p>{question.prompt}</p><p className="supporting">あなたの回答：{question.choices.filter(c=>question.selectedChoiceIds.includes(c.id)).map(c=>c.text).join(' ／ ')}</p><Callout kind={correct?'point':'warning'} title={correct?'正解です':'考え方を確認しましょう'}><p>{question.explanation}</p>{!correct&&<><p>{question.remediation}</p><p><strong>別の例：</strong>{question.example}</p><Link href={`${lessonPath(slug)}#${question.objectiveId}`}>この項目の解説を読み直す</Link></>}</Callout></section>;
}
