import {DesignElement,FlowDesigns} from './design.js';

var abstractDesign = new FlowDesigns.ListDesign('Abstract', 'abstract', `https://en.wikipedia.org/wiki/Abstraction`);
abstractDesign.add(new DesignElement('Mathematics', 'mathematics', `https://en.wikipedia.org/wiki/Mathematics`, 'flow-info', '/front-end/flowdesign/mathematics/index.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/mathematics/index.js'));
abstractDesign.add(new DesignElement('Programming', 'programming', `https://en.wikipedia.org/wiki/Computer_programming`,'flow-info','/front-end/flowdesign/programming/index.js' || 'https://cdn.jsdelivr.net/gh/flowaboard/programming/index.js'));
abstractDesign.add(new DesignElement('AI', 'ai', 'https://en.wikipedia.org/wiki/Artificial_intelligence','flow-info'));
abstractDesign.add(new DesignElement('Business', 'business', 'https://en.wikipedia.org/wiki/Business','flow-info'));

abstractDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: abstractDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    action: {
        "click":"flow"
    }
}

export default abstractDesign;