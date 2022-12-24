
import VM from "vm.js"
class JAVA extends VM{
    async execute(executable,context){
        new Function(...Object.keys(context), 'return '+executable); 
    }
}
export default JAVA