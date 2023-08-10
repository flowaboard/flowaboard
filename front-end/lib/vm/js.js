
import VM from "vm.js"
class JS extends VM{
    async execute(executable,context){
        new Function(...Object.keys(context), 'return '+executable); 
    }
}
export default JS