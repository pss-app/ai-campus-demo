import type { ReactNode } from 'react';
export type IconName = 'book' | 'screen' | 'folder' | 'code' | 'globe' | 'check' | 'arrow' | 'clock';
const paths: Record<IconName, ReactNode> = {
  book: <><path d="M12 6C8 3 4 4 2 5v15c3-2 7-2 10 0 3-2 7-2 10 0V5c-2-1-6-2-10 1Z"/><path d="M12 6v14M5 9l4 1M15 10l4-1"/></>,
  screen: <><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 22h8M12 17v5M6 8h5M6 11h8"/></>,
  folder: <><path d="M2 8V5a2 2 0 0 1 2-2h5l3 3h8a2 2 0 0 1 2 2v12H2Z"/><path d="M2 10h20M7 15h6"/></>,
  code: <><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M2 8h20M9 12l-3 3 3 3M15 12l3 3-3 3"/></>,
  globe: <><circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20M4 6h16M4 18h16"/></>,
  check: <><circle cx="12" cy="12" r="10"/><path d="m7 12 3 3 7-7"/></>,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6"/>,
  clock: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 3"/></>,
};
export function HomeIcon({ name, className }: { name: IconName; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
