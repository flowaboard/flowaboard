import { Design, DesignElement, FlowDesigns } from  '../design.js';//'https://cdn.jsdelivr.net/gh/flowaboard/flowaboard/front-end/flowdesign/design.js';


var programmingDesign = new FlowDesigns.ListDesign('Programming', 'programming', `https://en.wikipedia.org/wiki/Computer_programming`);
programmingDesign.add(new DesignElement('Algorithm', 'alogoritm', `https://en.wikipedia.org/wiki/Algorithm`,'flow-info','/front-end/flowdesign/programming/alogorithm.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/programming/alogorithm.js'))
programmingDesign.add(new DesignElement('Language', 'language', `https://en.wikipedia.org/wiki/Programming_language`,'flow-info','/front-end/flowdesign/programming/language.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/programming/language.js'))
programmingDesign.add(new DesignElement('Application', 'app', 'Application', 'app', `https://en.wikipedia.org/wiki/Application_software`,'flow-info','/front-end/flowdesign/programming/application.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/programming/application.js'))

programmingDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: programmingDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    action: {
        "click":"flow"
    }
}

export default programmingDesign;