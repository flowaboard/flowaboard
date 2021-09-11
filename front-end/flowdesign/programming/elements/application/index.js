import { Design, DesignElement, FlowDesigns } from  '/flowdesign/design.js';


var applicationDesign = new FlowDesigns.ListDesign('Application', 'app', `https://en.wikipedia.org/wiki/Application_software`);

applicationDesign.add(new DesignElement('UI', 'ui', `https://en.wikipedia.org/wiki/User_interface`))
applicationDesign.add(new DesignElement('Server', 'server', `https://en.wikipedia.org/wiki/Server_(computing)`))
applicationDesign.add(new DesignElement('Database', 'db', `https://en.wikipedia.org/wiki/Database`))
applicationDesign.add(new DesignElement('WebApp', 'webapp', `https://en.wikipedia.org/wiki/Web_application`))
applicationDesign.add(new DesignElement('MobileApp', 'mobileapp', `https://en.wikipedia.org/wiki/Mobile_app`))
applicationDesign.add(new DesignElement('DesktopApp', 'desktopapp', `https://en.wikipedia.org/wiki/Desktop_application`))
applicationDesign.add(new DesignElement('Graph', 'graphoffunction', `https://en.wikipedia.org/wiki/Graph_of_a_function`,'flow-info','/elements/graph/index.js'))//https://iase-web.org/islp/apps/gov_stats_graphing/History/HistoryOfGraphs.pdf

applicationDesign.root = import.meta.url.replace('/index.js','')
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