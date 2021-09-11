import { Design, DesignElement, FlowDesigns } from '../../design.js';
class MathematicsDesign extends FlowDesigns.ListDesign{
    static getRootDomain(){
        return location.href.indexOf("flowaboard.github.io")>=0?location.href+'/flowabaord/front-end/flowdesign/mathematics':location.href+'/front-end/flowdesign/mathematics'
    }
}
export default MathematicsDesign