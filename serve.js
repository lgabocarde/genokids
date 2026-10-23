'use strict';
// Servidor estático de desarrollo. La aplicación no envía ni persiste datos aquí.
const http=require('http');
const fs=require('fs');
const path=require('path');
const root=__dirname;
const port=Number(process.env.PORT||4177);
const host=process.env.HOST||'127.0.0.1';
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.md':'text/markdown; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  let pathname;
  try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch(_){res.writeHead(400);res.end('Bad request');return;}
  const requested=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  const file=path.resolve(root,requested);
  if(!file.startsWith(root+path.sep)&&file!==path.join(root,'index.html')){res.writeHead(403);res.end('Forbidden');return;}
  if(!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end('Not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  fs.createReadStream(file).pipe(res);
});
server.listen(port,host,()=>console.log(`GenoKids: http://${host}:${port}/`));
