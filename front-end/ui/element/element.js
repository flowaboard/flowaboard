import { Behaviour } from "../behaviour/behaviour.js";

import Debugger from "../../lib/debugger.js";


class Element extends HTMLElement {
    valueHistory = [];
    enableHistory=false;
    currentHitoryIndex;
    constructor() {
        super();
        //console.log(this.tagName,Debugger.debugs[this.tagName])
        this.debugger=Debugger(Debugger.debugs[this.debugTag],this.debugTag)
        this.behaviours = []
        this.behaviour = {}//will convert to weekmap
        
    }
    static elementRegistry={}//will convert to weekmap
    static register(elementTagName,elementClass){
        Element.elementRegistry[elementClass]=elementTagName
        Element.elementRegistry[elementTagName]=elementClass
        try{
            window.customElements.define(elementTagName, elementClass);
        }catch(e){
            //console.warn(e)
        }
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
    get debugTag(){
        return 'el-'+ this.tagName.toLowerCase()
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
        try{
            return this._value || JSON.parse(this.getAttribute('value') || '""');
        }catch(e){
            return ""
        }
    }
    set value(value) {
        this._value = value;
        if(this.enableHistory){
            if(this.valueHistory[this.currentHitoryIndex+1] != value){
                this.valueHistory = this.valueHistory.slice(0,this.currentHitoryIndex)
            }
            this.valueHistory.push(value)
            this.currentHitoryIndex = this.valueHistory.length-1
            
        }
        this.setAttribute('value', (value||"").toString());
        if(this._ondom){
            this.render()
        }
    }

    get oldValue(){
        return this.valueHistory[this.valueHistory.length-1]
    }

    ctrlz(){
        this.value = this.oldValue
        this.currentHitoryIndex = this.currentHitoryIndex -1
    }

    ctrly(){
        if(this.currentHitoryIndex < this.valueHistory.length-1){
            this.value = this.valueHistory[this.currentHitoryIndex+1]
        }
        
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
    _ondom;
    async connectedCallback() {
        this._ondom = true;
        await this.render();
        this.attachEventHandlers();
    }
    disconnectedCallback() {
        this._ondom = false;
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
    async render() {
        await this._beforeRender()
        const container = this.container || (this.container=this.attachShadow({ mode: 'open' }),this.container);

        this.behaviours.map(behaviour => behaviour.setAttribute())
        //Add default class
        this.classList.add(...['ui', this.constructor.name])
        const template = await this.HTML
        //Craete InnerHtml
        container.innerHTML = `
        <style>
        ${await this.CSS || ''}
        ${this.behaviours.map(behaviour => behaviour.CSS).join('\n')}        
        </style>
        ${this.behaviours.filter(behaviour => behaviour.at == 'Top').map(behaviour => behaviour.HTML).join('\n')}  
        ${template.outerHTML?'':template}
        ${this.behaviours.filter(behaviour => behaviour.at == 'Bottom' || !behaviour.at).map(behaviour => behaviour.HTML).join('\n')}  
        `;
        if(template.outerHTML)
        container.appendChild(template)
        

        
        this._afterRender()
    }
    async _afterRender() {
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

    subscribe(event,callback) {
        switch (event) {
            case 'resize':
                this.selfObserver = new ResizeObserver(entries => {
                    entries.forEach(entry => {
                        if(this._ondom){
                            callback(entry)
                        }
                    });
                });
                this.selfObserver.observe(this);
                break;
        
            default:
                break;
        }
        
    }
    unsubscribe(event){
        switch (event) {
            case 'resize':
                
                this.selfObserver&&this.selfObserver.disconnect() ;
                break;
        
            default:
                break;
        }
    }

    performanceCache={}
    performanceStart(tag){
        this.performanceCache[tag]=performance.now()
    }
    performanceEnd(tag){
        if(this.debug)
        console.warn(`${tag} ${performance.now()-this.performanceCache[tag]}ms`)
        delete this.performanceCache[tag]
    }

    
    static getNewInstance(){
        return document.createElement(Element.elementRegistry[this])
    }

    
}
Element.register('ui-element', Element);
export default Element;