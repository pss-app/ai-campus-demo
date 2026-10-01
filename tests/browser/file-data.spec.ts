import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import type { Assessment, Course } from '../../src/domain/types';
const course=JSON.parse(readFileSync('content/courses/file-data/course.json','utf8')) as Course;
const bank=JSON.parse(readFileSync('content/courses/file-data/assessments/data-vocabulary.json','utf8')) as Assessment;
const base='/courses/file-data';
test('新コースの入口・回答・次のレッスン・記録がPC基礎と分かれる',async({page})=>{
 await page.goto('/courses');await page.getByRole('link',{name:'ファイルとデータの基礎のカリキュラムを見る',exact:true}).click();
 await expect(page).toHaveURL(base);await page.getByRole('link',{name:'最初のレッスンへ',exact:true}).click();
 await expect(page).toHaveURL(base+'/lessons/data-vocabulary');
 await page.getByLabel('学習メモ',{exact:true}).fill('形式と拡張子の違いを説明する。');
 await page.getByRole('button',{name:'メモを保存',exact:true}).click();await expect(page.getByText('メモを保存しました。',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'理解した・確認へ進む'}).click();await page.getByRole('button',{name:'確認問題を始める'}).click();
 await expect(page.locator('.question-card fieldset')).toHaveCount(3);
 for(const card of await page.locator('.question-card').all()){
  const prompt=await card.locator('legend').innerText(),q=bank.questions.find(q=>q.prompt===prompt)!;
  for(const id of q.correctChoiceIds){
   const input=card.getByRole(q.type==='multiple_choice'?'checkbox':'radio',{name:q.choices.find(c=>c.id===id)!.text,exact:true});
   await expect(input).toBeEnabled();await input.click();await expect(input).toBeChecked();
   await expect(page.getByRole('button',{name:'回答を確認する',exact:true})).toBeEnabled();
  }
 }
 await page.getByRole('button',{name:'回答を確認する',exact:true}).click();await expect(page.getByRole('heading',{name:'確認できました。次の一歩へ。'})).toBeVisible();
 await page.getByRole('link',{name:'次のレッスンへ',exact:true}).click();await expect(page).toHaveURL(base+'/lessons/data-locations');
 await page.reload();await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
 await page.goto('/learning-records');const records=page.locator('#records-file-data');
 await expect(records.locator('.record-card').first()).toContainText('回答 3件');
 await expect(page.locator('#records-pc-foundations .record-card').first()).toContainText('回答 0件');
 await expect(records).toContainText('資料を渡すための準備メモ');
 const downloaded=page.waitForEvent('download');await records.getByRole('button',{name:'学習記録を書き出す'}).click();const download=await downloaded;
 const data=JSON.parse(readFileSync((await download.path())!,'utf8'));
 expect(data.courseId).toBe('file-data');expect(data.records).toHaveLength(3);expect(Object.keys(data.notes)).toEqual(['FD01']);
 await page.goto('/courses/pc-foundations/lessons/information-flow');await expect(page.getByRole('heading',{name:'前のレッスンから進めましょう'})).toBeVisible();
 await page.goto('/courses/pc-foundations/lessons/data-vocabulary');await expect(page.getByRole('heading',{name:'ページが見つかりません'})).toBeVisible();
});

test('新コース全ページの閲覧と320px・文字拡大、進級APIの制限',async({page})=>{
 await page.goto(base);await expect(page.getByRole('checkbox',{name:'教材確認モード',exact:true})).toBeEnabled();
 expect((await page.request.post('/api/lessons/data-locations/attempt')).status()).toBe(403);
 await page.getByRole('checkbox',{name:'教材確認モード',exact:true}).click();await expect(page.getByRole('checkbox',{name:'教材確認モード',exact:true})).toBeChecked();
 for(const lesson of course.lessons){
  await page.goto(`${base}/lessons/${lesson.slug}`);await expect(page.getByRole('heading',{level:1,name:lesson.title,exact:true})).toBeVisible();
  await expect(page.locator('.objective-section')).toHaveCount(3);
  await expect(page.getByRole('link',{name:'カリキュラムに戻る'})).toHaveAttribute('href',base);
 }
 await page.getByRole('button',{name:'特大',exact:true}).click();await page.setViewportSize({width:320,height:900});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
 await page.screenshot({path:'test-results/file-data-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'標準',exact:true}).click();await page.goto(base);
 await page.screenshot({path:'test-results/file-data-course.png',fullPage:true});
});
