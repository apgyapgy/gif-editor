import 'isomorphic-fetch';
export const getJson=(url,meta?)=>  sendJson('get',url,null,meta)
export const postJson=(url,data?,meta?)=> sendJson('post',url,data,meta);
export const pageJson=(url,data?,meta?)=> sendJson('post',url,data,Object.assign(meta||{},{jbMethod:'Page'}));
export const pageJsonExt=(url,page:number=1,perPage:number=20, data?,meta?)=> pageJson(url,Object.assign(data||{},{ext:{page,perPage}}),meta);
export const putJson=(url,data?,meta?)=>sendJson('put',url,data,meta);
export const delJson=(url,meta?)=>sendJson('delete',url,null,meta);

const sendJson=(method,url,data?,meta?)=> {
    let headers = {
        'Content-Type': 'application/json',
    }
    return fetch(url, {
        method: method,
        headers: headers,
        body: data && JSON.stringify(data)
    }).then(resp => {
        if(resp.status==403){
            Promise.reject('')
        }
        return resp.json()
    })
}
