import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { LearningProvider } from '@/components/learning/learning-provider';
import './globals.css';

export const metadata:Metadata={title:{default:'AI CAMPUS — 基礎から学ぶ',template:'%s | AI CAMPUS'},description:'用語と仕組みを理解し、確認しながら学ぶAI CAMPUS。',robots:{index:false,follow:false}};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="ja"><body><LearningProvider><SiteHeader/>{children}<footer className="site-footer">AI CAMPUS · 教材確認版</footer></LearningProvider></body></html>;}
