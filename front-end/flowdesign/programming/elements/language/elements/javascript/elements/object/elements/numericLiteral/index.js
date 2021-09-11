import Javascript from '../../../../design/javascript.js'

const literalJs= new Javascript('NumericLiteral','numericLiteral')
literalJs.fromJS(`
a;
a+3;
'hh'+'df'
2
var k=/s*/;
k=2+3+a
`)
literalJs.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    }
}



export default literalJs