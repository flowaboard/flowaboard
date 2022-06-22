import { Design, DesignElement, FlowDesigns } from  '../design.js'


var programmingDesign = new FlowDesigns.ListDesign('Programming', 'programming', `https://en.wikipedia.org/wiki/Computer_programming`);
programmingDesign.add(new DesignElement('Language', 'language', `https://en.wikipedia.org/wiki/Programming_language`,'flow-info','/elements/language/index.js'))
programmingDesign.add(new DesignElement('Application', 'app', `https://en.wikipedia.org/wiki/Application_software`,'flow-info','/elements/application/index.js'))

programmingDesign.root=location.origin+'/flowdesign/programming'
programmingDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: programmingDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default programmingDesign;