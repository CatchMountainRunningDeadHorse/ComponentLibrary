import { count } from './states'
export const handleAddBtnClick = ($event) => {
 count.value += 1 
}
export const handleLogBtnClick = () => {
 console.log(count.value) 
}
