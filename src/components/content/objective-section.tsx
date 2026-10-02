import type { Objective } from '@/domain/types';
import { Callout } from './callout';
import { FlowDiagram } from './flow-diagram';
import { CodeExample } from './code-example';
import { BoxModelDemo } from './box-model-demo';
export function ObjectiveSection({objective,index}:{objective:Objective;index:number}){return <section className="objective-section" id={objective.id} aria-labelledby={`${objective.id}-title`}><h2 id={`${objective.id}-title`}><span className="section-number" aria-hidden="true">{index+1}</span>{objective.title}</h2><Callout title="ここを押さえる"><p>{objective.keyPoint}</p></Callout><div className="prose">{objective.body.map((p,i)=><p key={i}>{p}</p>)}</div>{objective.codeExample&&<CodeExample {...objective.codeExample}/>}<FlowDiagram items={objective.diagram} title={objective.title}/><Callout kind="example" title="具体例"><p>{objective.example}</p></Callout>{objective.demo==='box-model'&&<BoxModelDemo/>}</section>;}
