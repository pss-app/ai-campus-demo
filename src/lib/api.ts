export async function api<T>(url:string,method='GET',body?:unknown):Promise<T>{
  if(process.env.NEXT_PUBLIC_PAGES_DEMO==='true')return (await import('@/demo/api')).demoApi<T>(url,method,body);
  const response=await fetch(url,{method,credentials:'same-origin',cache:'no-store',headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error??'通信に失敗しました。もう一度お試しください。');
  return data as T;
}
