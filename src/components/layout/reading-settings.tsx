'use client';
import { useEffect, useState } from 'react';

const sizes=[{value:'standard',label:'標準'},{value:'large',label:'大'},{value:'largest',label:'特大'}] as const;
export function ReadingSettings(){
  const [size,setSize]=useState('standard');
  useEffect(()=>{try{const value=localStorage.getItem('ai-campus-reading-size');if(sizes.some(s=>s.value===value)){setSize(value!);document.documentElement.dataset.readingSize=value!;}}catch{}},[]);
  function choose(value:string){setSize(value);document.documentElement.dataset.readingSize=value;try{localStorage.setItem('ai-campus-reading-size',value);}catch{}}
  return <fieldset className="reading-settings"><legend>文字サイズ</legend><div>{sizes.map(s=><button key={s.value} type="button" aria-pressed={size===s.value} onClick={()=>choose(s.value)}>{s.label}</button>)}</div></fieldset>;
}
