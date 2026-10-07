import type { IconName } from '@/components/home/home-icon';

type Presentation = { icon: IconName; label: string; terms: string[]; tone: string };
const presentations: Record<string, Presentation> = {
  'pc-foundations': { icon:'screen', label:'PCの基礎', terms:['ハードウェア','ソフトウェア','メモリ'], tone:'mint' },
  'file-data': { icon:'folder', label:'ファイルとデータ', terms:['保存場所','拡張子','共有'], tone:'sand' },
  'web-foundations': { icon:'code', label:'Web・HTML', terms:['HTML','CSS','画面の仕組み'], tone:'blue' },
  'internet-foundations': { icon:'globe', label:'インターネット', terms:['URL','サーバー','サイトの公開'], tone:'rose' },
  'ai-foundations': { icon:'book', label:'AIの基本と言葉', terms:['モデル','コンテキスト','ツール'], tone:'lavender' },
};
export const coursePresentation = (id:string):Presentation => presentations[id] ?? {icon:'book',label:'基礎から学ぶ',terms:[],tone:'mint'};
