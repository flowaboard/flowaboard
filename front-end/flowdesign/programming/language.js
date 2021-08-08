import { Design, DesignElement, FlowDesigns } from  '../design.js';//'https://cdn.jsdelivr.net/gh/flowaboard/flowaboard/flowdesign/design.js';


var languageDesign = new FlowDesigns.ListDesign('Language', 'language', `https://en.wikipedia.org/wiki/Programming_language`)

languageDesign.add(new DesignElement('JavaScript', 'js', `https://developer.mozilla.org/en-US/docs/Web/JavaScript`))
languageDesign.add(new DesignElement('Python', 'py', `https://developer.mozilla.org/en-US/docs/Web/JavaScript`))
languageDesign.add(new DesignElement('CSS', 'css', `https://developer.mozilla.org/en-US/docs/Web/JavaScript`))
languageDesign.add(new DesignElement('HTML', 'html', `https://developer.mozilla.org/en-US/docs/Web/JavaScrip`))
languageDesign.add(new DesignElement('C++', 'c++', `https://developer.mozilla.org/en-US/docs/Web/JavaScrip`))
languageDesign.add(new DesignElement('Tex', 'tex', `https://developer.mozilla.org/en-US/docs/Web/JavaScrip`))
languageDesign.add(new DesignElement('Java', 'java', `https://developer.mozilla.org/en-US/docs/Web/JavaScrip`))
languageDesign.add(new DesignElement('SQL', 'sql', `https://developer.mozilla.org/en-US/docs/Web/JavaScrip`))


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