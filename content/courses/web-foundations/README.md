# Web・HTMLの基礎 — 教材ドラフト

8レッスン・24到達項目・72問です。タグの網羅的な暗記ではなく、画面の構造・見た目・処理を区別し、AIへの依頼と結果の検証ができることを目指します。

|順番|レッスン|確認すること|
|---|---|---|
|1|Webを作る言葉|ページ・サイト・ブラウザ、HTML・CSS・JavaScriptの役割|
|2|要素・属性・親子関係|文言と参照先、見出し、div・spanのまとまり|
|3|CSSの指示と変更範囲|セレクター・項目・値、classとid、共通指定の影響|
|4|余白と大きさ|margin・padding・border・gap、幅に含むもの|
|5|読みやすさ|文字サイズ・行間・本文幅・色・フォーカス|
|6|配置とスマホ|親と子、Flexbox・Grid、表示幅と拡大時の確認|
|7|リンク・画像・ボタン|参照先と読み込み、移動と実行、フォームと保存先|
|8|修正依頼と検証|再現条件、現状と期待、観察と推測、公開先の確認|

第4レッスンには内側・外側の余白を別々に動かす比較画面があります。変更前を残して違いを観察します。スライダー操作だけでは合格記録は付きません。第2・3・7レッスンのコードは読み取り用の文字表示であり、教材中のHTMLを実行しません。

ミニテストは各到達項目から1問ずつ出題し、誤答した項目は別の問題で再確認します。実践メモとコース修了課題は説明力の確認用で、提出・講師採点は未接続です。

正本は `course.json`、`lessons/`、`assessments/` です。作成スクリプトの再実行は既存教材を上書きしません。コード例は `codeExample`、比較画面は `demo: "box-model"` を指定して共通表示部品を利用します。

## 講師確認の観点

- 用語の独立学習を先に置き、後の指示で使う言葉に意味が付いているか。
- 見た目を再現できることと、動作・保存・公開ができることを区別できるか。
- 正解を選べるだけでなく、実践メモで対象と条件を自分の言葉で説明できるか。
- marginの相殺やCSSの優先順位など、初級では確認の入口に留める内容が過負荷になっていないか。

参考：MDNの[HTMLの構文](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Structuring_content/Basic_HTML_syntax)、[ボックスモデル](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/Styling_basics/Box_model)、[レスポンシブデザイン](https://developer.mozilla.org/ja/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)。
