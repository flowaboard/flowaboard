import Javascript from '../../../../design/javascript.js'

const literalJs= new Javascript('literal','literal')
literalJs.fromJS(`
null
`)
literalJs.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    }
}



export default literalJs