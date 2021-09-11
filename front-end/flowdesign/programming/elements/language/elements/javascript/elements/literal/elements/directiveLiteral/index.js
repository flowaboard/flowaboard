import Javascript from '../../../../design/javascript.js'

const literalJs= new Javascript('literal','literal')
literalJs.fromJS(`
'use strict'
`)
literalJs.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    }
}



export default literalJs