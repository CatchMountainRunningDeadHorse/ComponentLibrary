import http from "@utils/request"


//查询字典项（批量）
export const queryBatch = ( data:stirng[] )=>{
    return http.post('/system/dict/item/queryBatch', data , {  }) 
}

//字典类型列表 ==> 暂时用
export const dictTypePage = ()=>{
    return http.get('/system/dict/type/page', {
        current:1,
        size:100
    } , {  }) 
}

