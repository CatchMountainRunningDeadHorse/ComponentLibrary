let loadingBool:any = null;
let loadingNumber:number = 0;

//引入整个lodash对象
import _ from "lodash";

const showLoading = ()=>{
    if(  loadingNumber == 0 ){
        loadingBool = ElLoading.service({ fullscreen: true })
    }
    loadingNumber++;
}

let toHideLoading = _.debounce(()=>{
    loadingBool?.close();
    loadingBool = null;
},500)

const hideLoading = ()=>{
    loadingNumber--;
    loadingNumber = Math.max( loadingNumber , 0 );
    if( loadingNumber == 0 ){
        toHideLoading();
    }
}

export {  showLoading , hideLoading  }