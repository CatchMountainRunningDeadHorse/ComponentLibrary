import { ref , Ref } from 'vue'

interface IMemoPassWord{
    memoVal:Ref<boolean>
    onMemoPassWord:(Value:boolean)=>void
}

function useMemoPassWord():IMemoPassWord {
    let memoVal:Ref<boolean> = ref( localStorage.getItem('memoPassWord') == 'true' );
    
    const onMemoPassWord = ( value:boolean )=>{
        localStorage.setItem('memoPassWord', (memoVal.value = value).toString() );
    }
    return {
        memoVal,
        onMemoPassWord
    }

}

export default useMemoPassWord;