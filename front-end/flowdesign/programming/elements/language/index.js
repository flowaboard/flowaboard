import { Design, DesignElement, FlowDesigns } from  '/flowdesign/design.js'


var languageDesign = new FlowDesigns.ListDesign('Language', 'language', `https://en.wikipedia.org/wiki/Programming_language`)
languageDesign.add(new DesignElement('Algorithm', 'alogoritm', `https://en.wikipedia.org/wiki/Algorithm`,'flow-info','/elements/algorithm/index.js'))
languageDesign.add(new DesignElement('JavaScript', 'js', `https://developer.mozilla.org/en-US/docs/Web/JavaScript`,'flow-info','/elements/javascript/index.js'))
languageDesign.add(new DesignElement('Python', 'py', `https://www.python.org/`,'flow-info','/elements/python/index.js'))
languageDesign.add(new DesignElement('CSS', 'css', `https://developer.mozilla.org/en-US/docs/Web/CSS`,'flow-info','/elements/css/index.js'))
languageDesign.add(new DesignElement('HTML', 'html', `https://developer.mozilla.org/en-US/docs/Web/HTML`,'flow-info','/elements/html/index.js'))
languageDesign.add(new DesignElement('SQL', 'sql', `https://www.w3schools.com/sql`,'flow-info','/elements/sql/index.js'))
languageDesign.add(new DesignElement('WebAssembly', 'WebAssembly', `https://developer.mozilla.org/en-US/docs/WebAssembly`,'flow-info','/elements/WebAssembly/index.js'))

languageDesign.root = import.meta.url.replace('/index.js','')
languageDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: languageDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default languageDesign;