import { Design, DesignElement, FlowDesigns } from  '../design.js';//'https://cdn.jsdelivr.net/gh/flowaboard/flowaboard/flowdesign/design.js';


var applicationDesign = new FlowDesigns.ListDesign('Application', 'app', `https://en.wikipedia.org/wiki/Application_software`);
applicationDesign.add(new DesignElement('Database', 'db', `https://en.wikipedia.org/wiki/Database`))
applicationDesign.add(new DesignElement('UI', 'ui', `https://en.wikipedia.org/wiki/User_interface`))
applicationDesign.add(new DesignElement('Server', 'server', `https://en.wikipedia.org/wiki/Server_(computing)`))
applicationDesign.add(new DesignElement('WebApp', 'webapp', `https://en.wikipedia.org/wiki/Web_application`))
applicationDesign.add(new DesignElement('MobileApp', 'android', `https://en.wikipedia.org/wiki/Mobile_app`))
applicationDesign.add(new DesignElement('DesktopApp', 'android', `https://en.wikipedia.org/wiki/Desktop_application`))

applicationDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: applicationDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default applicationDesign;