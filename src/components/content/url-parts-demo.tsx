'use client';
import { useId, useState } from 'react';

const examples=[
 {label:'料金ページの例',value:'https://shop.example/menu/cut?day=sat#price'},
 {label:'ポート番号のある例',value:'https://shop.example:8443/contact/'},
 {label:'別のホスト名の例',value:'https://help.shop.example/guide?from=top'},
];

export function UrlPartsDemo(){
 const id=useId(),[index,setIndex]=useState(0);
 const sample=examples[index],url=new URL(sample.value);
 const parts=[
  ['スキーム（通信方法）',url.protocol.replace(':','')],
  ['ホスト名（接続先の名前）',url.hostname],
  ['ポート番号',url.port||'明示なし（このHTTPSの例では通常443）'],
  ['パス',url.pathname],
  ['クエリー',url.search||'なし'],
  ['フラグメント',url.hash||'なし'],
 ];
 return <section className="url-demo" aria-labelledby={`${id}-title`}>
  <h3 id={`${id}-title`}>URLを分けて見る</h3>
  <p>例を切り替え、接続先とその後ろの部分を比べてください。説明用のURLを表示するだけで、外部には接続しません。</p>
  <fieldset className="url-example-options"><legend>比較するURL</legend>{examples.map((example,i)=><label key={example.value}><input type="radio" name={`${id}-example`} checked={index===i} onChange={()=>setIndex(i)}/>{example.label}</label>)}</fieldset>
  <div className="url-result" aria-live="polite" aria-atomic="true">
   <p className="url-whole"><code>{sample.value}</code></p>
   <dl>{parts.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
   <p>通常のHTTP要求の対象：<code>{url.pathname+url.search}</code></p>
   <p className="supporting">#以降は通常のHTTP要求に含めず、ブラウザ側で扱います。ホスト名や通信方法は、上の欄で別に確認できます。</p>
  </div>
  <p className="supporting">例の切替は練習です。理解はこの後の確認問題で確かめます。</p>
 </section>;
}
