'use client';
import { useId, useState } from 'react';

function Sample({label,margin,padding}:{label:string;margin:number;padding:number}){
 return <figure className="box-sample">
  <figcaption>{label}</figcaption>
  <div className="box-surface">
   <div className="box-card" style={{margin,padding}}>
    <div className="box-copy">カードの文章</div>
   </div>
   <div className="box-neighbor">隣のカード</div>
  </div>
  <p className="supporting">外側 {margin}px ／ 内側 {padding}px</p>
 </figure>;
}

export function BoxModelDemo(){
 const id=useId();const [margin,setMargin]=useState(8),[padding,setPadding]=useState(8);
 return <section className="box-demo" aria-labelledby={`${id}-title`}>
  <h3 id={`${id}-title`}>動かして比べる：外側と内側の余白</h3>
  <p>まず内側だけ、次に外側だけ動かしてください。枠と文章、枠と隣のカードの距離を見比べます。</p>
  <div className="box-controls">
   <label htmlFor={`${id}-padding`}>内側の余白（padding）：{padding}px</label>
   <input id={`${id}-padding`} type="range" min={0} max={24} step={4} value={padding} aria-valuetext={`${padding}ピクセル`} onChange={e=>setPadding(Number(e.target.value))}/>
   <label htmlFor={`${id}-margin`}>外側の余白（margin）：{margin}px</label>
   <input id={`${id}-margin`} type="range" min={0} max={24} step={4} value={margin} aria-valuetext={`${margin}ピクセル`} onChange={e=>setMargin(Number(e.target.value))}/>
  </div>
  <div className="box-comparison">
   <Sample label="変更前（固定）" margin={8} padding={8}/>
   <Sample label="変更後" margin={margin} padding={padding}/>
  </div>
  <p role="status" className="supporting">変更後：枠の内側は{padding}px、枠の外側は{margin}pxです。枠線は同じ太さのままです。</p>
  <button className="button secondary" type="button" onClick={()=>{setMargin(8);setPadding(8);}}>余白を初期値に戻す</button>
  <p className="supporting">これは違いを観察する練習です。スライダーは左右の矢印キーでも操作できます。操作しただけでは確認問題の合格になりません。</p>
 </section>;
}
