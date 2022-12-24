
import VM from "vm.js"
class C extends VM{
    async execute(executable,context){
        new Function(...Object.keys(context), 'return '+executable); 
    }
}
export default C