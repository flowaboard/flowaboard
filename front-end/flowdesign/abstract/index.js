import {DesignElement,FlowDesigns} from '/flowdesign/design.js';

var abstractDesign = new FlowDesigns.ListDesign('Abstract', 'abstract', `https://en.wikipedia.org/wiki/Abstraction`);
abstractDesign.add(new DesignElement('Mathematics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`, 'flow-info', '/flowdesign/mathematics/index.js'));
abstractDesign.add(new DesignElement('Programming', 'programming', `https://en.wikipedia.org/wiki/Computer_programming`,'flow-info','/flowdesign/programming/index.js'));
abstractDesign.add(new DesignElement('AI', 'ai', 'https://en.wikipedia.org/wiki/Artificial_intelligence','flow-info','/flowdesign/ai/index.js'));
abstractDesign.add(new DesignElement('Business', 'business', 'https://en.wikipedia.org/wiki/Business','flow-info','/flowdesign/business/index.js'));

abstractDesign.root
abstractDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: abstractDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default abstractDesign;