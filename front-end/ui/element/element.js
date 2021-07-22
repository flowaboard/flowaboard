import { Behaviour } from "../behaviour/behaviour.js";

class Element extends HTMLElement {
    constructor() {
        super();
        this.behaviours = []
        this.behaviour = {}//will convert to weekmap
    }
    static elementRegistry={}//will convert to weekmap
    static register(elementTagName,elementClass){
        Element.elementRegistry[elementClass]=elementTagName
        Element.elementRegistry[elementTagName]=elementClass
        window.customElements.define(elementTagName, elementClass);
    }
    static getSample(){
        const element=this.getNewInstance()
        element.innerHTML='Hello World'
        return element
    }  

    addBehaviour(behaviour) {
        this.addBehaviours([behaviour])
    }
    addBehaviours(behaviours) {

        behaviours.forEach(behaviour => {
            behaviour.dependencies().forEach(dependency => this.pushBahaviour(dependency))
            this.pushBehaviour(behaviour)
            console.log('added behaviour:', behaviour,this)
        })

        this.render()
    }
    pushBehaviour(behaviour) {
        if (!this.behaviour[behaviour.constructor.name]) {
            this.behaviours.push(behaviour)
            behaviour.addHost(this)
            this.behaviour[behaviour.constructor.name] = behaviour
        } else {
            this.behaviour[behaviour.constructor.name].updateWith(behaviour)
        }
    }
    removeBehaviour(behaviourName){
        this.removeBehaviours([behaviourName])
    }
    removeBehaviours(behavioursName) {
        //behavioursToRemove=behavioursToRemove.concat(this.behaviours.map())
        this.behaviours
            .filter(behaviour => behavioursName.indexOf(behaviour.constructor.name) >= 0)
            .forEach(behaviourToRemove => {
                this.behaviours.splice(this.behaviours.indexOf(behaviourToRemove), 1)
                behaviourToRemove.remove()
                delete this.behaviour[behaviourToRemove.constructor.name];
                console.log('removed behaviour:', behavioursName,this)
            });

        this.render()


    }
    get label() {
        return this.getAttribute('label') || '';
    }
    set label(value) {
        this.setAttribute('label', value);
    }

    get name() {
        return (this.getAttribute('name') || this.label || 'Input').replace(/\s+/g, "_");
    }
    set name(value) {
        this.setAttribute('name', value);
    }
    _value;
    get value() {
        return this._value || JSON.parse(this.getAttribute('value') || '""');
    }
    set value(value) {
        this._value = value;
        this.setAttribute('value', (value||"").toString());
        this.render()
    }

    get type() {
        return this.getAttribute('type');
    }
    set type(value) {
        this.setAttribute('type', value);
    }

    get class() {
        return this.getAttribute('class')
    }    
    toJSON(){
        return Object.keys(this).filter(v=>!v.indexOf("_")==0&&["behaviours", "behaviour", "container"].indexOf(v)<0).reduce((a,v)=>{a[v]=this[v];return a},{})
        
    }
    get cssSelector() {
        return ''
    }
    connectedCallback() {
        this.render();
        this.attachEventHandlers();
    }
    disconnectedCallback() {
        this.removeEventHandlers();
    }
    static get observedAttributes() {
        return ["label", "type", "value", "name", "class"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "label" && this.shadowRoot) {
            this.shadowRoot.querySelector("label").textContent = newValue;
        }
        this.behaviours.forEach(behaviour => behaviour.attributeChangedCallback(name, oldValue, newValue))
    }
    get CSS() {
        return `
        :host{
            display:block;
        }
        `
    }
    get HTML() {
        return `
        <slot>${this.value}</slot>
        `
    }
    _beforeRender() {
        this.behaviours.map(behaviour => behaviour.beforeRender())
        this.removeEventHandlers()
        this.beforeRender()
    }
    beforeRender() {

    }
    render() {
        this._beforeRender()
        const container = this.container || (this.container=this.attachShadow({ mode: 'open' }),this.container);

        this.behaviours.map(behaviour => behaviour.setAttribute())
        //Add default class
        this.classList.add(...['ui', this.constructor.name])

        //Craete InnerHtml
        container.innerHTML = `
        <style>
        ${this.CSS || ''}
        ${this.behaviours.map(behaviour => behaviour.CSS).join('\n')}        
        </style>
        ${this.behaviours.filter(behaviour => behaviour.at == 'Top').map(behaviour => behaviour.HTML).join('\n')}  
        ${this.HTML}
        ${this.behaviours.filter(behaviour => behaviour.at == 'Bottom' || !behaviour.at).map(behaviour => behaviour.HTML).join('\n')}  
        `;

        
        this._afterRender()
    }
    _afterRender() {
        const styles = document.querySelector('link[href*="fontawesome"]');
        const existingStyles=this.shadowRoot.querySelector('link[href*="fontawesome"]')
        if (styles && !existingStyles) {
            this.shadowRoot.appendChild(styles.cloneNode());
        }
        this.attachEventHandlers()
        this.afterRender()
        this.behaviours.map(behaviour => behaviour.afterRender())      
        
    }
    afterRender() {
    }
    attachEventHandlers() {
        //Attach Custom handlers
        this.behaviours.forEach(behaviour => behaviour.attachEventHandlers())

    }
    removeEventHandlers() {
        //Remove Custom handlers
        this.behaviours.forEach(behaviour => behaviour.removeEventHandlers())
    }
    debounce(func, wait, immediate) {
        var timeout;

        // This is the function that is actually executed when
        // the DOM event is triggered.
        return function executedFunction() {
            // Store the context of this and any
            // parameters passed to executedFunction
            var context = this;
            var args = arguments;

            // The function to be called after 
            // the debounce time has elapsed
            var later = function () {
                // null timeout to indicate the debounce ended
                timeout = null;

                // Call function now if you did not on the leading end
                if (!immediate) func.apply(context, args);
            };

            // Determine if you should call the function
            // on the leading or trail end
            var callNow = immediate && !timeout;

            // This will reset the waiting every function execution.
            // This is the step that prevents the function from
            // being executed because it will never reach the 
            // inside of the previous setTimeout  
            clearTimeout(timeout);

            // Restart the debounce waiting period.
            // setTimeout returns a truthy value (it differs in web vs node)
            timeout = setTimeout(later, wait);

            // Call immediately if you're dong a leading
            // end execution
            if (callNow) func.apply(context, args);
        };
    }

    performanceCache={}
    performanceStart(tag){
        this.performanceCache[tag]=performance.now()
    }
    performanceEnd(tag){
        console.warn(`${tag} ${performance.now()-this.performanceCache[tag]}ms`)
        delete this.performanceCache[tag]
    }
    static getNewInstance(){
        return document.createElement(Element.elementRegistry[this])
    }
}
Element.register('ui-element', Element);
export { Element };