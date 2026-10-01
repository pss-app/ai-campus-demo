import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import type { Assessment } from '../../src/domain/types';

const base='/courses/pc-foundations/lessons/components';
const bank=JSON.parse(readFileSync('content/courses/pc-foundations/assessments/components.json','utf8')) as Assessment;
async function answerVisible(page:Page,wrongObjective?:string){
 const cards=page.locator('.question-card').filter({has:page.locator('fieldset')});
 for(let i=0;i<await cards.count();i++){
  const card=cards.nth(i);const prompt=await card.locator('legend').innerText();const q=bank.questions.find(q=>q.prompt===prompt)!;
  const chosen=q.objectiveId===wrongObjective?[q.choices.find(c=>!q.correctChoiceIds.includes(c.id))!.id]:q.correctChoiceIds;
  for(const id of chosen){const input=card.getByRole(q.type==='multiple_choice'?'checkbox':'radio',{name:q.choices.find(c=>c.id===id)!.text,exact:true});await expect(input).toBeEnabled();await input.click();await expect(input).toBeChecked();await expect(page.getByRole('button',{name:'回答を確認する',exact:true})).toBeEnabled();}
 }
}
test('実ブラウザで解説→回答保存→誤答の補足→別問題→進級・戻る・再読込',async({page})=>{
 await page.goto(base);await expect(page.getByRole('heading',{level:1,name:'PCを構成するもの',exact:true})).toBeVisible();
 await page.getByLabel('学習メモ',{exact:true}).fill('入力と出力の違いを確認した。');await page.getByRole('button',{name:'メモを保存',exact:true}).click();await expect(page.getByText('メモを保存しました。',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'理解した・確認へ進む'}).click();await expect(page).toHaveURL(base+'/quiz');
 await page.getByRole('button',{name:'確認問題を始める'}).click();await expect(page.locator('.question-card fieldset')).toHaveCount(3);
 const initial=await page.locator('.question-card fieldset legend').allTextContents();await answerVisible(page,'PC01-O2');
 await page.reload();await expect(page.locator('.question-card fieldset')).toHaveCount(3);expect(await page.locator('.question-card fieldset legend').allTextContents()).toEqual(initial);await expect(page.locator('.choice input:checked')).not.toHaveCount(0);
 await page.getByRole('button',{name:'回答を確認する',exact:true}).click();await expect(page.getByRole('heading',{name:'ここをもう一度、確認しましょう。'})).toBeVisible();
 await page.getByRole('link',{name:'この項目の解説を読み直す'}).click();await expect(page).toHaveURL(new RegExp(base+'#PC01-O2$'));
 await page.getByRole('link',{name:'理解した・確認へ進む'}).click();await page.getByRole('button',{name:'補足を確認した・別の問題で試す'}).click();await expect(page.locator('.question-card fieldset')).toHaveCount(1);
 const retry=await page.locator('.question-card fieldset legend').innerText();expect(initial).not.toContain(retry);
 await page.getByRole('button',{name:'ヒントを見る'}).click();await expect(page.locator('.hint')).toBeVisible();await answerVisible(page);
 await page.getByRole('button',{name:'回答を確認する',exact:true}).click();await expect(page.getByRole('heading',{name:'確認できました。次の一歩へ。'})).toBeVisible();
 await page.getByRole('link',{name:'次のレッスンへ',exact:true}).click();await expect(page).toHaveURL(/information-flow$/);await page.reload();await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
 await page.getByRole('link',{name:'学習記録',exact:true}).click();await expect(page.locator('.record-card').first()).toContainText('回答 4件');await expect(page.locator('.record-card').first()).toContainText('補助あり正解 1件');
 await page.goto(base);await expect(page.getByLabel('学習メモ',{exact:true})).toHaveValue('入力と出力の違いを確認した。');
});
test('直接URLの進級制限、教材確認モード、独立URLと404',async({page})=>{
 await page.goto('/courses/pc-foundations/lessons/my-environment');await expect(page.getByRole('heading',{name:'前のレッスンから進めましょう'})).toBeVisible();
 await page.getByRole('checkbox',{name:'教材確認モード',exact:true}).click();await expect(page.getByRole('checkbox',{name:'教材確認モード',exact:true})).toBeChecked();await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
 const course=JSON.parse(readFileSync('content/courses/pc-foundations/course.json','utf8'));
 for(const lesson of course.lessons){await page.goto(`/courses/pc-foundations/lessons/${lesson.slug}`);await expect(page.getByRole('heading',{level:1,name:lesson.title,exact:true})).toBeVisible();await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();}
 await page.getByRole('checkbox',{name:'教材確認モード',exact:true}).click();await expect(page.getByRole('checkbox',{name:'教材確認モード',exact:true})).not.toBeChecked();await expect(page.getByRole('heading',{name:'前のレッスンから進めましょう'})).toBeVisible();
 await page.goto('/courses/pc-foundations/lessons/not-a-lesson');await expect(page.getByRole('heading',{name:'ページが見つかりません'})).toBeVisible();
});
test('文字サイズ・キーボード操作・320px表示・自動アクセシビリティ検査',async({page})=>{
 await page.goto('/');await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'本文へ進む'})).toBeFocused();
 for(const route of ['/', '/courses',base]){await page.goto(route);if(route===base)await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(results.violations).toEqual([]);}
 await page.getByRole('button',{name:'特大',exact:true}).click();await expect(page.locator('html')).toHaveAttribute('data-reading-size','largest');
 expect(await page.locator('.prose p').first().evaluate(e=>getComputedStyle(e).fontSize)).toBe('22px');
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-reading-size','largest');await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
 await page.setViewportSize({width:320,height:900});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/lesson-mobile-large.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'標準',exact:true}).click();await page.screenshot({path:'test-results/lesson-desktop.png',fullPage:true});
 await page.evaluate(()=>document.documentElement.style.fontSize='32px');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
});
test('APIは正答を事前に返さず、未解放・偽の選択肢・外部更新を拒否',async({request})=>{
 await request.get('/api/learning');
 expect((await request.post('/api/lessons/memory/attempt')).status()).toBe(403);
 const start=await request.post('/api/lessons/components/attempt');expect(start.ok()).toBeTruthy();const data=await start.json();expect(JSON.stringify(data)).not.toContain('correctChoiceIds');expect(data.attempt.questions.every((q:{result?:unknown;explanation?:string})=>!q.result&&!q.explanation)).toBe(true);
 expect((await request.patch('/api/lessons/components/attempt',{data:{action:'answer',attemptId:data.attempt.id,questionId:data.attempt.questions[0].id,selectedChoiceIds:['fake']}})).status()).toBe(400);
 expect((await request.patch('/api/learning',{headers:{origin:'https://unrelated.example'},data:{action:'reviewMode',enabled:true}})).status()).toBe(403);
 expect((await request.patch('/api/learning',{data:{action:'pass',lessonId:'PC01'}})).status()).toBe(400);
});


