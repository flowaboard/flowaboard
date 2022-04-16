import Javascript from '../../../../design/javascript.js'

const literalJs= new Javascript('NumericLiteral','numericLiteral')
literalJs.fromJS(`
let vl,j,p=10;
class g{
    f(){
        if(x>10){
            x=11
        }
        for(;;){
            console.log(x)
        }
    }
}
k=undefined;
2
var k=/s*/;
k=2+3+a
`)
literalJs.flowConfig = {
    elementAction: {
        "click": { "action": "flow", "state": "default" }
    },
    feWidthPercentage: 40,
    feHeightPercentage: 10,
    fexPaddingPercentage: 5,
    feyPaddingPercentage: 5
}



export default literalJs