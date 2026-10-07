const {chromium,expect}=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=(process.env.PAGES_TEST_URL??'http://127.0.0.1:4175/ai-campus-demo').replace(/\/$/,'');
const root=path.resolve(__dirname,'..');
const read=(course,file)=>JSON.parse(fs.readFileSync(path.join(root,'content/courses',course,file),'utf8'));
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{
  const context=await browser.newContext();const page=await context.newPage();const failures=[];
  page.on('pageerror',e=>failures.push(e.message));
  page.on('response',r=>{if(r.status()>=400)failures.push(`${r.status()} ${r.url()}`);});
  await page.goto(base+'/');await expect(page.getByRole('heading',{level:1})).toContainText('AIを学ぶ');
  await expect(page.getByText(/公開デモ：ログイン/)).toBeVisible();
  const courseIds=fs.readdirSync(path.join(root,'content/courses'));
  await page.getByRole('link',{name:'コースを選ぶ',exact:true}).click();await expect(page.locator('.course-card')).toHaveCount(courseIds.length);
  for(const courseId of courseIds){
   const course=read(courseId,'course.json'),first=course.lessons[0],bank=read(courseId,`assessments/${first.slug}.json`);
   const route=`${base}/courses/${courseId}/lessons/${first.slug}/`;
   await page.goto(route);await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
   await page.getByLabel('学習メモ',{exact:true}).fill('公開デモの動作確認');await page.getByRole('button',{name:'メモを保存',exact:true}).click();await expect(page.getByText('メモを保存しました。',{exact:true})).toBeVisible();
   await page.getByRole('link',{name:'理解した・確認へ進む'}).click();await page.getByRole('button',{name:'確認問題を始める'}).click();await expect(page.locator('.question-card fieldset')).toHaveCount(3);
   const initial=await page.locator('.question-card legend').allTextContents();
   async function answer(wrong){
    for(const [i,card] of (await page.locator('.question-card').all()).entries()){
     const prompt=await card.locator('legend').innerText(),question=bank.questions.find(q=>q.prompt===prompt);
     const ids=wrong&&i===0?[question.choices.find(c=>!question.correctChoiceIds.includes(c.id)).id]:question.correctChoiceIds;
     for(const id of ids){const input=card.getByRole(question.type==='multiple_choice'?'checkbox':'radio',{name:question.choices.find(c=>c.id===id).text,exact:true});await expect(input).toBeEnabled();await input.click();await expect(input).toBeChecked();}
    }
   }
   await answer(true);await page.reload();await expect(page.locator('.question-card fieldset')).toHaveCount(3);
   await expect(page.locator('.choice input:checked')).not.toHaveCount(0);
   await page.getByRole('button',{name:'回答を確認する',exact:true}).click();await expect(page.getByRole('heading',{name:'ここをもう一度、確認しましょう。'})).toBeVisible();
   await page.getByRole('button',{name:'補足を確認した・別の問題で試す'}).click();await expect(page.locator('.question-card fieldset')).toHaveCount(1);
   assert(!initial.includes(await page.locator('.question-card legend').innerText()));
   await page.getByRole('button',{name:'ヒントを見る'}).click();await expect(page.locator('.hint')).toBeVisible();await answer(false);
   await page.getByRole('button',{name:'回答を確認する',exact:true}).click();await expect(page.getByRole('heading',{name:'確認できました。次の一歩へ。'})).toBeVisible();
   await page.getByRole('link',{name:'次のレッスンへ',exact:true}).click();await expect(page).toHaveURL(`${base}/courses/${courseId}/lessons/${course.lessons[1].slug}/`);
   await page.reload();await expect(page.getByRole('heading',{name:'今回覚えること'})).toBeVisible();
   await page.goto(base+'/learning-records/');await expect(page.locator(`#records-${courseId} .record-card`).first()).toContainText('回答 4件');
   await page.goto(route);await expect(page.getByLabel('学習メモ',{exact:true})).toHaveValue('公開デモの動作確認');
   const toggle=page.getByRole('checkbox',{name:'教材確認モード',exact:true});if(!await toggle.isChecked())await toggle.click();await expect(toggle).toBeChecked();
   for(const lesson of course.lessons){await page.goto(`${base}/courses/${courseId}/lessons/${lesson.slug}/`);await expect(page.getByRole('heading',{name:lesson.title,exact:true,level:1})).toBeVisible();await expect(page.locator('.objective-section')).toHaveCount(3);}
   console.log(`${courseId}: all lessons, retry, hints, resume, progression, records passed`);
  }
  await page.goto(base+'/courses/web-foundations/lessons/web-structure/');
  await expect(page.locator('.code-example').first()).toContainText('<a href="fees.html">料金を見る</a>');
  await expect(page.locator('.code-example a')).toHaveCount(0);
  await page.goto(base+'/courses/web-foundations/lessons/web-spacing/');
  const padding=page.getByRole('slider',{name:/内側の余白/}),margin=page.getByRole('slider',{name:/外側の余白/});
  await padding.focus();await page.keyboard.press('End');await expect(padding).toHaveValue('24');
  await expect(page.locator('.box-card').last()).toHaveCSS('padding','24px');
  await expect(page.locator('.box-card').first()).toHaveCSS('padding','8px');
  await margin.focus();await page.keyboard.press('End');await expect(margin).toHaveValue('24');
  await expect(page.locator('.box-card').last()).toHaveCSS('margin','24px');
  await page.getByRole('button',{name:'特大',exact:true}).click();await page.setViewportSize({width:320,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const AxeBuilder=require('@axe-core/playwright').default;
  assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,[]);
  fs.mkdirSync(path.join(root,'test-results'),{recursive:true});
  await page.locator('.box-demo').screenshot({path:path.join(root,'test-results/web-spacing-mobile.png')});
  await page.getByRole('button',{name:'余白を初期値に戻す'}).click();await expect(padding).toHaveValue('8');await expect(margin).toHaveValue('8');
  await page.goto(base+'/courses/internet-foundations/lessons/net-url/');
  await expect(page.locator('.url-whole')).toHaveText('https://shop.example/menu/cut?day=sat#price');
  await expect(page.locator('.url-result dl')).toContainText('shop.example');
  await expect(page.locator('.url-result dl')).toContainText('#price');
  await expect(page.getByText('通常のHTTP要求の対象：/menu/cut?day=sat',{exact:true})).toBeVisible();
  await page.getByRole('radio',{name:'料金ページの例',exact:true}).focus();await page.keyboard.press('ArrowDown');
  await expect(page.getByRole('radio',{name:'ポート番号のある例',exact:true})).toBeChecked();
  await expect(page.locator('.url-result dd').nth(2)).toHaveText('8443');
  await page.getByRole('radio',{name:'別のホスト名の例',exact:true}).check();
  await expect(page.locator('.url-result dd').nth(1)).toHaveText('help.shop.example');
  await expect(page.locator('.url-result dd').nth(4)).toHaveText('?from=top');
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations,[]);
  await page.getByRole('radio',{name:'別のホスト名の例',exact:true}).focus();
  await page.locator('.url-demo').screenshot({path:path.join(root,'test-results/internet-url-mobile.png')});
  await page.getByRole('link',{name:'AI CAMPUS ホーム'}).click();await expect(page).toHaveURL(base+'/');
  assert.deepEqual(failures,[]);console.log(`PASS: ${base} — all lesson pages, ${courseIds.length} course learning flows, home link, mobile layout, no asset or JS errors`);
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});



