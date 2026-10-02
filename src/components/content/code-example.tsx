export function CodeExample({label,code}:{label:string;code:string}){
 return <figure className="code-example"><figcaption>{label}</figcaption><pre><code>{code}</code></pre><p className="supporting">記述の読み取り用です。この例は画面内で実行しません。</p></figure>;
}
