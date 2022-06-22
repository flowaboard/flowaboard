import {DesignElement,FlowDesigns} from '/flowdesign/design.js';

var businessDesign = new FlowDesigns.ListDesign('Business', 'business', 'https://en.wikipedia.org/wiki/Business','flow-info');
businessDesign.add(new DesignElement('Agriculture', 'agriculture', `https://en.wikipedia.org/wiki/Agriculture`, 'flow-info', '/elements/agriculture/index.js'));
businessDesign.add(new DesignElement('Financial services', 'financial_services', `https://en.wikipedia.org/wiki/Financial_services`,'flow-info','/elements/financial_services/index.js'));
businessDesign.add(new DesignElement('Entertainment', 'entertainment', 'https://en.wikipedia.org/wiki/Entertainment#Industry','flow-info','/elements/entertainment/index.js'));
businessDesign.add(new DesignElement('Industrial manufacturers', 'industrial_manufacturers', 'https://en.wikipedia.org/wiki/Manufacturing','flow-info','/elements/industrial_manufacturers/index.js'));
businessDesign.add(new DesignElement('Real estate', 'real_estate', 'https://en.wikipedia.org/wiki/Real_estate','flow-info','/elements/real_estate/index.js'));
businessDesign.add(new DesignElement('Retailers, wholesalers, and distributors', 'retailers', 'https://en.wikipedia.org/wiki/Retail','flow-info','/elements/real_estate/index.js'));

businessDesign.root
businessDesign.flowConfig = {
    flex: true,
    defaultValue: {
        widthfactor: businessDesign.designElements.length,
        xPadding: 0.4,
        yPadding: 0.4,
    },
    elementAction: {
        "click" : {"action":"flow","state":"default"}
    }
}

export default businessDesign;