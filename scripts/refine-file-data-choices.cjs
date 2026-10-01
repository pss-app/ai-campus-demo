const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'../content/courses/file-data/assessments');
// Distractors describe plausible process mistakes, not unrelated objects.
const replacements={
'表示用アプリの名称':'このファイルの正式な形式名',
'アプリの表示倍率':'ファイルに関連付けられたアプリだけ',
'モニターの大きさ':'作成に使ったアプリの名前だけ',
'前のPCの壁紙':'ファイル名の先頭の文字だけ',
'モニターの解像度':'拡張子を省いたファイル名だけ',
'使用したキーボードの機種':'前回そのファイルを開いた時刻だけ',
'拡張子を消したファイル':'装飾と配置を保つことだけを目的にしたPDF',
'ファイル名にPDFという文字を加える':'PDF閲覧アプリで開くよう関連付けだけ変える',
'変換ボタンの色':'書き出しが完了したという表示だけ',
'画像の縦横サイズ':'文書のページ区切りの指定方法',
'拡張子を.jpgに変える':'表示された文字を正しい内容だと扱い直す',
'移動先のフォルダーの色だけ':'元の場所に名前が見えなくなったかだけ',
'ショートカットの数だけ':'最近使ったファイルの一覧に名前があるかだけ',
'ウィンドウを小さくして編集する':'編集後に名前だけ変えれば元の状態も残ると考える',
'ファイル名の長さだけで判断する':'最近使った一覧に名前があれば更新済みと判断する',
'モニターの向き':'列幅だけを広げれば必ず元の列構造に戻るか',
'ファイル名の日付だけ':'CSVをXLSXへ名前変更すれば直るか',
'ファイル名が短くなったか':'容量が減ったことだけで用途を満たしたとするか',
'アイコンの色が変わったか':'添付できたことだけで文字の確認を終えるか',
'ファイル名の文字数':'同名ファイルが一覧に二つ見えるかだけ',
'PCの壁紙':'拡張子が変わっていないかだけ',
'ファイル名に顧客と入っているかだけ':'送信先が正しければ編集権限も問題ないとすること',
'リンクの長さだけ':'リンクを作成できたことだけ',
'AIの返答の口調だけ':'作成した日時が一番新しいかだけ',
'ページ番号の数字が大きいか':'資料のファイル名が一致しているかだけ',
};
for(const name of fs.readdirSync(root)){
 const file=path.join(root,name),bank=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const q of bank.questions)for(const choice of q.choices)choice.text=replacements[choice.text]??choice.text;
 fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
}
