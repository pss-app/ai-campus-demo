# AI CAMPUS トップページ

2026-10-05。既存教材への入口として、研修サービスの紹介ページを実装。

- 参考：<https://fairtechnologies.co.jp/>。人物写真を大きく置く左右構成、太い見出し、明確なCTAを参考にした。
- ヒーロー：`src/components/home/home-hero.tsx`
- 紹介・コース・学び方・FAQ：`src/components/home/home-sections.tsx`
- アイコン：`src/components/home/home-icon.tsx`（コードで描画）
- トップ専用スタイル：`src/components/home/home.module.css`
- コース数とレッスン数：既存の `courseCatalog` から算出。
- CTAは実際のレッスンとコース一覧に接続。料金・法人管理・導入支援は未提供のため準備中と明記。
- 写真は既存サイトの素材ではなく、内蔵 image_gen ツールで生成。
- 使用画像：`public/images/campus-learning.webp`（1536×1024、約78KB）。生成元PNGからWebPに圧縮。
- 静的公開時は `public` をビルド先へコピーし、`NEXT_PUBLIC_PAGES_BASE_PATH` で画像のパスを合わせる。

## 画像生成プロンプト

Use case: photorealistic-natural. Asset type: Japanese adult e-learning website hero photograph, landscape 3:2. A candid professional editorial photograph of a Japanese woman in her late 30s studying at a light oak desk in an airy bright modern home office, soft natural window daylight, cream blouse, relaxed slight smile looking at an open silver laptop, one hand naturally on trackpad, notebook and pencil on table, a softly blurred plant and shelves in background. Medium wide waist-up shot, person centered, authentic skin texture, warm approachable adult professional learning mood, ivory and soft sage palette. Clean premium commercial photography, realistic anatomy. No text, no logos, no watermarks, no graphics. Save generated image for use in the current website project.
