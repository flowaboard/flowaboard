import { List } from './list.js';
import "https://cdn.plot.ly/plotly-2.3.1.min.js"
import { ElementGroup } from './group.js'
class Graph extends List {
    debug = true;
    constructor() {
        super();

    }
    _elementType;
    get elementType() {
        return this._elementType || 'ui-graph'
    }
    set elementType(value) {
        this._elementType = value
    }
    get CSS() {
        return `
        :host {
            display: flex;
            flex-direction: column;
            overflow: auto;
            width: 100%;
            height: 100%;
            position: relative;
        }
        :host ::slotted(${this.elementType}){
            padding:0.2rem;
            margin:0.4rem
            box-sizing: border-box;
            width: calc(100% - 0.8rem);
        }
        .plotly,.container{
            height: 100%;
        }

        `
    }
    get HTML() {
        return `<slot>
            <div class="container"></div>
        </slot>`
    }
    attachEventHandlers() {
        this.subscribe('resize', async (entry) => {
            this.debugger.log('graph resize');
            try {
                Plotly.Plots.resize(this.shadowRoot.querySelector('.container'));
            } catch (e) {

            }
        });
    }
    afterRender() {
        this.debugger.log('after Render')
        Plotly.newPlot(this.shadowRoot.querySelector('.container'), this.value, {
            margin: {
                l: 40,
                r: 40,
                b: 20,
                t: 20,
            },
            //plot_bgcolor: '#c7c7c7'
        }, { responsive: true });
        this.copyStyles()
    }

    removeEventHandlers() {
        this.debugger.log('remove resize')
        this.unsubscribe('resize')
        super.removeEventHandlers()
    }

    async copyStyles() {
        try {
            this.debugger.log('copyStyles')
            //http://smith-li.com/wordpress/2011/06/10/copy-css-styles-without-additional-http-requests/
            // Get a ref to the parent document's stylesheets.
            var parentdoc_ss = window.document.styleSheets;

            // Grab a stylesheet from the current document.
            if (this.shadowRoot.styleSheets.length < 1) {
                // If one doesn't exist, create it.		
                this.appendChild(document.createElement("style"));
            }

            var ss = this.shadowRoot.styleSheets[this.shadowRoot.styleSheets.length - 1];
            var rule_index = 0; // We'll need this to help us add the rules in order.

            for (var i = 0; i < parentdoc_ss.length; i++) {
                this.debugger.log(parentdoc_ss[i].cssRules.length)
                for (var j = 0; j < parentdoc_ss[i].cssRules.length; j++) {
                    // Loop through the rules in each of the parent document's stylesheets.
                    /* NOTE: IE doesn't support the cssRules property. It has "rules" instead.
                    This is just a PoC so I'm not going to fix it for IE, but I'm confident it can be done.
                    */
                    var r = parentdoc_ss[i].cssRules[j];

                    if (r.type == CSSRule.IMPORT_RULE) {
                        // If the current rule is an @import, copy the rules from the stylesheet it imports.
                        for (var k = 0; k < r.styleSheet.cssRules.length; k++) {
                            /* FIXME: Assuming a max depth of 1 import for now.
                            This should really be done recursively, but it's a PoC, so hey.
                            */
                            // Insert the rule from the parent doc's stylesheet into ours.
                            ss.insertRule(r.styleSheet.cssRules[k].cssText, rule_index++);
                        }
                    }
                    else {
                        // Insert the rule from the parent doc's stylesheet into ours.
                        ss.insertRule(r.cssText, rule_index++);
                    }
                }
            }
        } catch (e) {

        }
    }

    static getSample() {
        const listElement = document.createElement(ElementGroup.elementRegistry[this])
        listElement.value = ['Item 1', 'Item 2', 'Item 3']
        return listElement
    }
    static tag = 'ui-graph'

}
ElementGroup.register(Graph.tag, Graph);
export { Graph };