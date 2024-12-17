import http from "@utils/request"

interface IsubjectPage{
    current:Number;
    size:Number;
}

interface IsubjectAdd{
    "subjectName": String;
    "amount": String;
    "protocol": String;
    "enabled":String;
}


//科目列表
export const subjectPage = ( data:IsubjectPage )=>{
    return http.get('/crm/teach/subject/page', data , { } ) 
}

//添加科目
export const subjectAdd = ( data:IsubjectAdd )=>{
    return http.post('/crm/teach/subject/add', data , { } ) 
}
