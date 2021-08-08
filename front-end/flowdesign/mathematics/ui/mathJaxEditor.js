import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js'

import Element from '../../../ui/element/element.js'

class MathJaxEditor extends Element {

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
        }  
        mjx-assistive-mml{
            display:none
        }   
        textarea {
            font-size: .8rem;
            letter-spacing: 1px;
        }
        textarea {
            padding: 0.5rem;
            width: 100%;
            line-height: 1.5;
            border-radius: 5px;
            border: 1px solid #ccc;
            box-shadow: 1px 1px 1px #999;
        }   
        `
    }
    beforeRender() {
        MathJax.texReset();
    }
    get editorHTML(){
        return `<div id="container" style="height:400px;border:1px solid black;"></div>
        <script>var require = { paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs' } }</script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/loader.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/editor/editor.main.nls.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs/editor/editor.main.js"></script>
        <script>
        let editor = monaco.editor.create(document.getElementById('container'), {
            value: \`function x() {
        console.log("Hello world!");
        }\`,
            language: 'javascript',
            theme: 'vs-dark',
        });`
    }
    get HTML() {
        return `        
        <textarea placeholder="Enter mathml or tex">${this.value}</textarea>
        `

    }
    attachEventHandlers(){
        

        this.shadowRoot.querySelector('textarea').addEventListener('change',e=>{this.ontextContentChange(e)})
    }
    ontextContentChange(e){
        this._value=e.target.value
        this.dispatchEvent(new CustomEvent('change'));
        
    }
    static tag = 'math-jax-editor'

}
Element.register(MathJaxEditor.tag, MathJaxEditor);



export default MathJaxEditor