
import "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js";

import VM from 'vm.js'

class PY extends VM{
    async execute(executable,context){
        let pyodide = await loadPyodide();
		pyodide.registerJsModule("context", context);
		await pyodide.loadPackage("micropip");
        return await pyodide.runPython(executable)
    }
}

export default PY