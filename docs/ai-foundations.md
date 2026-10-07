# AIの基本と言葉 — 教材ドラフト

2026-10-06追加。AIに背景を伝える実践コースの前提として、AIの部品・処理・参照範囲を整理する全8レッスン。各レッスンは3到達項目、各項目3種類の問題（合計72問）。成人の初学者を想定し、架空店舗や社内の案内作成で確認する。

1. 最初に覚える：AIの基本と言葉
2. AIはどう学び、どう答えを作るのか
3. コンテキスト：AIに渡す背景と材料
4. 会話の履歴と、AIが参照する範囲
5. 検索した情報と、AIの回答を分けて見る
6. 文章・画像・ファイルを渡すとき
7. ツールとエージェント：答えることと動かすこと
8. 使う前に整理する：情報・確認・作業の終わり

教材の正本は `content/courses/ai-foundations/` のJSON。`scripts/create-ai-course.cjs` は初回作成用で、既存教材への上書きを拒否する。今後の修正はJSONへ直接行う。

用語の区別→仕組みの説明→具体例→確認の順。資料を渡したことと再学習、会話履歴と参照範囲、添付と読み取り、文章作成と実行、自己申告と証拠を区別する。具体的なサービスのモデル名・料金・上限値は更新が早いため固定しない。機能の存在や契約条件は利用先で確認するよう説明する。

出題は既存のランダム出題・選択肢シャッフル・誤答論点のみ別問で再確認する仕組みを使用する。練習メモとコース最後の課題は自動採点しない。正答履歴のみで実務能力や不正の有無を断定しない。

## 確認に使用した公式資料

- Google Cloud, Generative AI glossary: https://docs.cloud.google.com/docs/generative-ai/glossary
- Anthropic, Effective context engineering for AI agents: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Anthropic, Building effective agents: https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, Reduce hallucinations: https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations

各レッスン末尾にも参照リンクを表示。教材の例題・場面設定は本サイトのために作成したもの。

## 画面

コース一覧のカードは共通コンポーネントとCSS Module。`src/lib/course-presentation.ts` にコースのアイコン・色・用語を定義し、トップと一覧で共有。学習画面のスタイルは `src/styles/learning.css`、基本色と文字サイズは `src/styles/tokens.css`。コース本文や採点処理と分離している。
