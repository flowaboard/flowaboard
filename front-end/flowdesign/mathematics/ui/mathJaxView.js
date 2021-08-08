import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js'

import Element from '../../../ui/element/element.js'

class MathJaxView extends Element {
    
    constructor() {
        super();
    }

    static getSample() {
        const input = document.createElement('ui-input')
        input.setAttribute('label', 'Label')
        return input
    }

    get CSS() {
        return `
        :host{
            display: flex;
            width: 100%;
            border-radius: 0.5em;
            justify-content: center;
            align-items: center;
            /* background: #fdf9f9; */
            padding: 2rem;
        }  
        mjx-assistive-mml{
            display:none
        }      
        `
    }
    beforeRender(){
        MathJax.texReset();
    }
    get HTML() {
        var options = MathJax.getMetricsFor(this);
        options.display = true;
        return MathJax.mathml2svgPromise(this.value,options)
        return MathJax.tex2svgPromise(`x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}`,options)

    }
    afterRender() {
        
        MathJax.startup.document.clear();
        MathJax.startup.document.updateDocument();
    }
    static tag='math-jax-view'

}
Element.register(MathJaxView.tag, MathJaxView);



export default MathJaxView