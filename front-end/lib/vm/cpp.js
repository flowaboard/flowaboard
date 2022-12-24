
import VM from "vm.js"
class CPP extends VM{
    async execute(executable,context){
        new Function(...Object.keys(context), 'return '+executable); 
    }
}
export default CPP