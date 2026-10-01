import type { ReactNode } from 'react';
export function Callout({kind='point',title,children}:{kind?:'point'|'example'|'warning';title:string;children:ReactNode}){return <aside className={`callout ${kind}`} aria-label={title}><p className="callout-label">{title}</p><div>{children}</div></aside>;}
