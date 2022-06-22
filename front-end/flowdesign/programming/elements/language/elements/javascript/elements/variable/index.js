import Javascript from '../../design/javascript.js'

const variableJs= new Javascript('variable','variable')
variableJs.fromJS("var k='variable'")
variableJs.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    }
}



export default variableJs