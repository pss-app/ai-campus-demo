const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../.pages-build/out'),prefix='/ai-campus-demo';
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.txt':'text/plain','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.woff2':'font/woff2'};
http.createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(!url.pathname.startsWith(prefix+'/')){res.writeHead(404);return res.end();}
 let file;try{file=path.resolve(root,decodeURIComponent(url.pathname.slice(prefix.length+1)));}catch{res.writeHead(400);return res.end();}
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 try{
  if(fs.statSync(file).isDirectory()){
   if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});return res.end();}
   file=path.join(file,'index.html');
  }
  const data=fs.readFileSync(file);res.writeHead(200,{'Content-Type':(mime[path.extname(file)]??'application/octet-stream')+'; charset=utf-8'});res.end(data);
 }catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(fs.readFileSync(path.join(root,'404.html')));}
}).listen(4175,'127.0.0.1',()=>console.log('Pages preview: http://127.0.0.1:4175/ai-campus-demo/'));
