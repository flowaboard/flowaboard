import {ElementGroup} from '../element-group/group.js'
import {Element} from '../element/element.js'
import '/d3/dist/d3.js'
import { Next } from '../element-group/next.js'
//import '../../node_modules/d3-3d/src/3d.js'


import * as architecture from '../../data/architecture/architecture.js';

class FlowElement extends Element{
    constructor() {
        super();
    }
    
    static getSample(){
        const flowElement=document.createElement('ui-flow-element')
        return flowElement
    }  

    get placeholder(){
        return this.getAttribute('placeholder')
    }
    get showLabel(){
        return !!this.getAttribute('showlabel')
    }
    set showLabel(value){
        return this.setAttribute('showlabel','true')
    }
    get showAction(){
        return !!this.getAttribute('showaction')
    }
    set showAction(value){
        return this.setAttribute('showaction','true')
    }
    type;
    beforeRender(){
        super.beforeRender()
        this.showLabel=true
    }
    get CSS(){
        return `
        :host{
            display:flex;
            width: 100%;
        }
        :host.active>span{
            margin: 0;
            margin-top: 4rem;
            margin-bottom: 5rem;
            overflow: hidden;
            
        }
        :host>span>div {
            height: 100%;
            display:flex;
            justify-content: center;
            align-items: center;
            text-transform: capitalize;
            cursor: pointer;
            transition: all 0.5s;
        }
        :host>span>div:hover {
            transform: scale(1.2);
        }
        ::slotted(label),label{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: var(--ui-input-label-padding,0.2rem 2rem);
            flex:var(--ui-input-leabel-flex,2);
        }
        ::slotted(input),input{
            flex:var(--ui-input-input-flex,8);
            padding:var(--ui-input-input-padding,0.2rem);
            width: 100%;
        }
        ::slotted(button),button{
            flex:var(--ui-input-btton-flex,2);
            border: unset;
            padding: 0;
            background-color: unset;
        }
        `
    }
    get HTML(){
        return `
            <div class="flowElement ${this.type} ${this.value.uniqueIdentifier}">
                <span>
                    <div>
                        ${this.value.label}
                    </div>
                </span>
            </div>     
        `
        
    }

    attachEventHandlers(){        
        this.attachInactiveEventHandlers()
    }
    removeEventHandlers(){
        this.removeInactiveEventHandlers()
    }

    afterRender(){
        
    }
    attachInactiveEventHandlers(){
        this.addEventListener("mouseenter",  this.handleMouseEnter);
        this.addEventListener("mouseleave",  this.handleMouseLeave);
        this.addEventListener("transitionend",  this.handleTransitionEnd);
        this.addEventListener("animationend",  this.handleAnimationEnd);
    }
    removeInactiveEventHandlers(){
        this.removeEventListener("mouseenter",  this.handleMouseEnter);
        this.removeEventListener("mouseleave",  this.handleMouseLeave);
        this.removeEventListener("transitionend",  this.handleTransitionEnd);
        this.removeEventListener("animationend",  this.handleAnimationEnd);
    }  

    handleValueChange(){
        this._value='';//this.shadowRoot.querySelector('input').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed:true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)
        

    }

    handleMouseEnter(){
        this.focus()
        this.updateLink()        
    }
    handleMouseLeave(){
        this.defocus()   
        this.updateLink()     
    }
    handleTransitionEnd(){
        this.updateLink()
    }
    handleAnimationEnd(){
        this.updateLink()
    }

    dimensions(width,height,depth){
        if(this.style.width!=width ||this.style.height!=height){
            this.style.width=width;
            this.style.height=width;
        }
    }

    coordinates(x,y,z){
        if(this.style.left!=x ||this.style.top!=y){
            this.style.left=x;
            this.style.top=y;
        }
    }

    inLinks=[];
    outLinks=[];
    addInLink(link){
        link.headFlowElement=this
        this.inLinks.push(link)
        this.updateLinkHead()
    }
    addOutLink(link){
        link.tailFlowElement=this
        this.outLinks.push(link)
        this.updateLinkTail()
    }

    updateLink(){
        this.animate({
            duration: 600,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: (progress)=>{                
                this.updateLinkHead();
                this.updateLinkTail();
            }
        });
    }

    updateLinkHead(){
        var inlinkCenter=this.inLinks.length/2
        var isEven=this.inLinks.length%2==0
         
        this.inLinks.forEach((link,i)=>{
           
            var x2 = this.getBoundingClientRect().x;
            var y2 = this.getBoundingClientRect().y;
            var width2=this.getBoundingClientRect().width;
            var height2=this.getBoundingClientRect().height;
            link.setAttribute("x2", x2-8);
            link.setAttribute("y2", (y2 + height2 / 2)+10*(i+1-inlinkCenter)+(isEven?(-5):0));
        })
    }

    updateLinkTail(){
        this.outLinks.forEach((link)=>{
            var x1 = this.getBoundingClientRect().x;
            var y1 = this.getBoundingClientRect().y;
            
            var width1=this.getBoundingClientRect().width;
            var height1=this.getBoundingClientRect().height;

            
            link.setAttribute("x1", x1 + width1);
            link.setAttribute("y1", y1 + height1 / 2);
        })
    }

    focus(){
        this.classList.add('focus')
    }
    defocus(){
        this.classList.remove('focus')
    }

    active(){
        this.removeInactiveEventHandlers()
        this.isActive=true
        this.classList.add("active")
        this.style.width = this.activeWidth
        this.style.height = this.activeHeight
        this.style.top = "0%"
        this.style.left = "0%"
        const content=this.value.getUi()
        this.shadowRoot.querySelector('span').replaceChild(content,this.shadowRoot.querySelector('span>div'))
        
    }

    inactive(){
        this.attachInactiveEventHandlers()
        this.isActive=false
        this.classList.remove("active")
        const content=document.createElement("div")
        this.shadowRoot.querySelector('span').replaceChild(content,this.shadowRoot.querySelector('span').firstChild)  
        d3.select(content).text(this.value.label)
    }

    hide(){
        this.classList.add('hidden');
        [...this.inLinks,...this.outLinks].forEach((link)=>{
            link.classList.add('hidden')
        })
    }
    show(){
        this.classList.remove('hidden');
        [...this.inLinks,...this.outLinks].forEach((link)=>{
            link.classList.remove('hidden')
        })
    }
    animate({duration, draw, timing}) {

        let start = performance.now();

        requestAnimationFrame(function animate(time) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            let progress = timing(timeFraction)

            draw(progress);

            if (timeFraction < 1) {
            requestAnimationFrame(animate);
            }

        });
    }


    
}
Element.register('ui-flow-element', FlowElement);

class FlowElementType{
    static PROCESSES='processes'
    static previous(flowElementType){
        switch(flowElementType){
            case 'processes':
                return 'inputs';
            case 'outputs':
                return 'processes';
            default:
                return flowElementType
        }
    }
    static next(flowElementType){
        switch(flowElementType){
            case 'processes':
                return 'outputs';
            case 'inputs':
                return 'processes';
            default:
                return flowElementType
        }
    }
    static get(flowInstance,flowElementType){
        return flowInstance.value[flowElementType]
    }
}
class FLowFocusedELement{
    
    flowInstance;
    type=FlowElementType.PROCESSES;
    index=0;
    callback;
    constructor(flowInstance){
        this.flowInstance=flowInstance
        document.onkeydown = (e)=>{this.checkKey(e)};
    }
    checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
            this.handleFocusChange('UP')
        }
        else if (e.keyCode == '40') {
            // down arrow
            this.handleFocusChange('DOWN')
        }
        else if (e.keyCode == '37') {
            // left arrow
            this.handleFocusChange('LEFT')
        }
        else if (e.keyCode == '39') {
            // right arrow
            this.handleFocusChange('RIGHT')
        }

    }

    handleFocusChange(focus){
        if(focus=="UP"){
            this.focusAbove()
        }
        if(focus=="DOWN"){
            this.focusBelow()
        }
        if(focus=="LEFT"){
            this.focusLeft()
        }
        if(focus=="RIGHT"){
            this.focusRight()
        }
    }
    focusAbove(){
        this.index=this.index-1>=0?this.index-1:0
        this.type=this.type||FlowElementType.PROCESSES
        this.callback()
    }
    focusBelow(){
        this.index=this.index+1<FlowElementType.get(this.flowInstance,this.type||FlowElementType.PROCESSES).length?this.index+1:this.index
        this.callback()
    }
    focusLeft(){
        this.type=FlowElementType.previous(this.type||FlowElementType.PROCESSES)
        this.index=0
        this.callback()
    }
    focusRight(){
        this.type=FlowElementType.next(this.type||FlowElementType.PROCESSES)
        this.index=0
        this.callback()
    }
    focusCustom(type,index){
        this.type=type;
        this.index=index
        this.callback()
    }
    onchange(callback){
        this.callback=callback
    }
}


class Flow extends ElementGroup{
    focusedElement;
    myObserver;
    constructor() {
        super();
    }
    get CSS(){
        return `
        :host {
            display: block;
            height:100%;
            transform-style: preserve-3d;
        }
        #svg{
            width:100%;
            height: 100%;
        }
        svg{
            height: 100%;
        }
        
        .flowElement{
            border-radius: 4px;
            border: 2px solid #0c9ebf;
            position:absolute;            
            transition: all 300ms;
        }
        .flowElement:not(.active){
            transform: scale(1);            
            -webkit-filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
            filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
        }

        .flowElement:not(.active).focus {            
            transform: scale(1.5);
            -background-color: #185765;
            z-index:100;
            
        }
        .flowElement:not(.active).blur {
            -webkit-filter: blur(2px);
            filter: blur(2px);
            transform: scale(0.8);            
        }        
        .flowElement:not(.active).hidden {
           visibility:hidden;
           opacity:0;
           transform: scale(0.8);          
        }
        
        svg line{
            transition: all 300ms;
        }
        svg line.hidden {
           visibility:hidden;
           opacity:0;
           transform: scale(0.8); 
                    
        }
        
        
        
        .button {
            background-color: #96b4ce40;
            border: none;
            color: black;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
            color: #1a73e8;
            box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
            font: 500 14px Google Sans,Noto Sans,Noto Sans JP,Noto Sans KR,Noto Naskh Arabic,Noto Sans Thai,Noto Sans Hebrew,Noto Sans Bengali,sans-serif;
            letter-spacing: .6px;
            line-height: 24px;
            padding: 6px 24px;
            pointer-events: auto;
            text-transform: none;
            text-decoration: none;
            -webkit-transition: -webkit-transform .3s ease-in-out;
            transition: -webkit-transform .3s ease-in-out;
            transition: transform .3s ease-in-out;
            transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
            -webkit-transform: scale(1);
            transform: scale(1);
        }
        
        .button:hover {
            background-color: #f1f1f1;
        }
        .actions{
            position: fixed;
            bottom: 0;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            height:3em;
            z-index: 1000;
        }
        .bbutton:not(:hover) {
            display: none;
        }
        .actions:hover + .hide {
            display: block;
        }

        `

    }
    get HTML(){
        return `
            <slot style="
            position: relative;
            width: 100%;
            height: 100%;
            display: block;
            ">
                <svg></svg>
            </slot>
            <slot name="actions">
                <div class="actions">
                    <button class="button add" id="add">Add</button>
                    <button class="button close" id="close"><i class="fas fa-times"></i></button>
                </div>
            </slot>
        `
    }
    attachEventHandlers(){
        document.body.onresize = this.handleSVGResize.bind(this)
        this.shadowRoot.querySelector('#add').onclick = this.handleAdd.bind(this);  
        this.shadowRoot.querySelector('#close').onclick = this.handleClose.bind(this);        
        this.focusedElement=new FLowFocusedELement(this)
        this.focusedElement.onchange(()=>{this.handleFocus()})
        
        this.myObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                // console.log('width', entry.contentRect.width);
                // console.log('height', entry.contentRect.height);
                // console.log('x',entry.contentRect.top)
                // console.log('y',entry.contentRect.bottom)
            });
        });
    }
    afterRender(){
        if(this.value){
            if(!this._svg){
                this.createSVG()
            }
            this.updateSVG() 
                      

        }
    }
    
    handleFocus(){
        this.start=undefined
        window.requestAnimationFrame(this.step.bind(this)); 
    }

    handleInactive(){
       this.start=undefined
       window.requestAnimationFrame(this.step.bind(this)); 
    }

    handleClose(){
        this.setInActiveflowElementBody(this.activeFlowElement)
    }

    handleAdd(){
        this.value.addProcess(new architecture.Process('js3','Process3','process3',['ui3'],['database3']))
        this.updateSVG()
    }
    
      
    
    createSVG() {
        var svg = this.shadowRoot.querySelector('svg')
        var d3svg = d3.select(svg)
            //.append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")

        d3svg.append("svg:defs")
            .append("filter")
            .attr("id", "blurEdge")
            .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "2")
        

        d3svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle-outline")
            .attr("viewBox","0 0 10 10")
            .attr("refX", 3)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
            .style("fill", "black");

        

        d3svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle-fill")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 -5 10 10")
            .style("stroke", "black");

        // svg.call(d3.zoom()
        //     .extent([[0, 0], [width, height]])
        //     .scaleExtent([1, 8])
        //     .on("zoom", zoomed));
      
        // function zoomed() {
        //     this.value.inputs[0].flowElement.attr("transform", d3.event.transform);
        // }

        

        this._svg = d3svg
    }

    async updateSVG() {
        if(this.activeFlowElement){            
            return
        }
        //var startTime = performance.now();
        const inputLength=this.value.inputs.length
        const outputLength=this.value.outputs.length
        const processLength=this.value.processes.length

        const width = this.clientWidth
        const height = this.clientHeight

        const flowElementWidth = this.clientWidth/6
        const flowElementHeight = this.clientHeight/6

        const xoffset = (width / 4)
        const inputx = (1 * xoffset - flowElementWidth / 2 - xoffset / 2)/width*100
        const processx = (2 * xoffset - flowElementWidth / 2)/width*100
        const outputx = (3 * xoffset - flowElementWidth / 2 + xoffset / 2)/width*100

        const inputyoffset = (height / (inputLength + 1))
        const processoryoffset = (height / (processLength + 1))
        const outputyoffset = (height / (outputLength + 1))

        var svg = this._svg
        svg.attr("viewBox", `0 0 ${width} ${height}`)



        //var duration = performance.now() - startTime;
        //console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);

        this.value.outputs.forEach((output, i) => {
            var flowElement = this.getFlowElement(output)
            flowElement.dimensions(flowElementWidth, flowElementHeight);
            flowElement.coordinates(outputx+'%',((i + 1) * outputyoffset - flowElementHeight / 2)/height*100+'%')
            this.myObserver.observe(flowElement);
        });
        //var duration = performance.now() - startTime;
        //console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);

        this.value.processes.forEach((process, i) => {
            var flowElement = this.getFlowElement(process)
            flowElement.dimensions(flowElementWidth, flowElementHeight);
            flowElement.coordinates(processx+'%',((i + 1) * processoryoffset - flowElementHeight / 2)/height*100+'%')

            Array.from([...process.outputIdentifiers]).forEach(outputIdentifier => {
                var destinationFU = this.value._outputMap[outputIdentifier]
                if (destinationFU) {
                    var link = this.getLink(process.uniqueIdentifier, outputIdentifier)
                    flowElement.addOutLink(link)
                    destinationFU.flowElement.addInLink(link)
                    
                }
            })
            
            //this.myObserver.observe(process.flowElement.node());


        });
        //var duration = performance.now() - startTime;
        //console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);

        this.value.inputs.forEach((input, i) => {
            var flowElement = this.getFlowElement(input)
            flowElement.dimensions(flowElementWidth, flowElementHeight);
            flowElement.coordinates(inputx+'%',((i + 1) * inputyoffset - flowElementHeight / 2)/height*100+'%')

            Array.from([...input.processIdentifiers]).forEach(processIdentifier => {
                var destinationFU = this.value._processMap[processIdentifier]
                if (destinationFU) {
                    var link = this.getLink(input.uniqueIdentifier, processIdentifier)
                    flowElement.addOutLink(link)
                    destinationFU.flowElement.addInLink(link)
                    
                }
            })
            //this.myObserver.observe(input.flowElement.node());
        });
        //var duration = performance.now() - startTime;
        //console.log(`someMethodIThinkMightBeSlow took ${duration}ms`);




    }


    handleSVGResize() {
        if(!this.activeFlowElement){         
            this.updateSVG()
        }
    }

    getFlowElement(functionUnit) {
        if(functionUnit.flowElement){
            return functionUnit.flowElement
        }
        var flowElement=document.createElement('ui-flow-element')
        flowElement.value=functionUnit
        functionUnit.flowElement=flowElement;

        this.shadowRoot.querySelector('slot').append(flowElement)

        this.addFlowElementEventListeners(flowElement)
        
        return flowElement
    }
    getLink(sourceFlowElementIndentifier,destinationFlowElementIndentifier) {
        var link = this.value._linkMap[sourceFlowElementIndentifier + "->" + destinationFlowElementIndentifier] 
        if(!link){
            link = this._svg.append("line")
                .style("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#triangle-outline)")
            this.value._linkMap[sourceFlowElementIndentifier+ "->" + destinationFlowElementIndentifier] = link
        }
        return link.node();
    }


    setActiveflowElementBody(flowElement){
        this.removeFlowElementEventListeners(flowElement)
        this.activeFlowElement=flowElement;
        

        this.activeFlowElement.node().active();  
        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE=>{
            notActiveFE.hide()
        })      
        
        this._svg.attr("viewBox", `0 0 ${this.clientWidth} ${this.clientHeight}`) 
    }

    setInActiveflowElementBody(flowElement){
        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE=>{
            notActiveFE.show()
        })
        flowElement.node().inactive()     
        this.addFlowElementEventListeners(flowElement.node())
        this.activeFlowElement=null
        this.handleInactive()      

    }

    removeFlowElementEventListeners(flowElement){
        flowElement.on("mousedown",null)
    }
    
    addFlowElementEventListeners(flowElement){
        flowElement=d3.select(flowElement)
        var self=this
        

        flowElement.on("mousedown",function (d, i) {
            console.clear();
            console.log("mousedown",self.activeFlowElement,flowElement.attr("class"))           
            self.setActiveflowElementBody(flowElement)
        })
        
    }

    start
    stepLocked=false;
    step(timestamp) {
        if (this.start === undefined){
            this.start = timestamp;
            if(this.stepLocked){
                
            }else{
                this.stepLocked=true
            }
        }
        console.log("rendered")
        const elapsed = timestamp - this.start;

        
        if (elapsed < 600) { // Stop the animation after 2 seconds
            this.updateSVG();
            window.requestAnimationFrame(this.step.bind(this));
        }else{
            this.stepLocked=false
        }
    }

    log(msg) {//See https://stackoverflow.com/a/27074218/470749
        var e = new Error();
        if (!e.stack)
            try {
                // IE requires the Error to actually be thrown or else the 
                // Error's 'stack' property is undefined.
                throw e;
            } catch (e) {
                if (!e.stack) {
                    //return 0; // IE < 10, likely
                }
            }
        var stack = e.stack.toString().split(/\r\n|\n/);
        if (msg === '') {
            msg = '""';
        }
        console.log(msg, '          [' + stack[1] + ']');        
    }

    

    static getSample(){
        const listElement=document.createElement(ElementGroup.elementRegistry[this])
        listElement.value=['Item 1','Item 2','Item 3']
        return listElement
    }  
    
}
ElementGroup.register('ui-flow', Flow);
export { Flow };