import { queryBatch } from '@api/dicts'
//把字典在全局使用
export default function( app ){
    app.mixin({
        data(){
            return {
                dicts:{}
            }
        },
        methods:{
            async sendDicts( params:string[] ){
               if( params ){
                    let res = await queryBatch(params);
                    this.dicts = res.data;
               }
            }
        }
    })
}
