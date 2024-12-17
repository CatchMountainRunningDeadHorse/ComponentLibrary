import http from "@utils/request"

interface IclassPage{
    current:Number;
    size:Number;
}

interface IsubjectPage{
    current:Number;
    size:Number;
}

interface IclassAdd{
    "className": String;
    "teachingMethod":String;
    "subjectId":String;
    "fullPeople": String;
    "mainTeacherId": String;
    "assistTeacherId": String;
    "manageTeacherId": String;
    "classHour": String;
    "beginDate": String;
    "endDate":String;
    "teachingDay": String;
    "teachingTime": String;
    "status":String;
}

//班级列表
export const classPage = ( data:IclassPage )=>{
    return http.get('/crm/teach/class/page', data , { } ) 
}

//科目列表
export const subjectPage = ( data:IsubjectPage )=>{
    return http.get('/crm/teach/subject/page', data , { } ) 
}

//机构树
export const unitTree = ( )=>{
    return http.get('/system/unit/tree', {} , { } ) 
}

//添加班级
export const classAdd = ( data:IclassAdd )=>{
    return http.post('/crm/teach/class/add', data , { } ) 
}




