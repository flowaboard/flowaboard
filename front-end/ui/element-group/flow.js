import {ElementGroup} from '../element-group/group.js'
import {Element} from '../element/element.js'
import '/node_modules/d3/dist/d3.js'
import { Next } from '../element-group/next.js'
//import '../../node_modules/d3-3d/src/3d.js'


import * as architecture from '../../data/architecture/architecture.js';

class FlowUtility{

    static getEvenlySpaced(length){
        var evenlySpaced=[]
        if(length==1){
            //console.log(0,0)
            evenlySpaced.push(0)
        }
        if(length%2==0){
            //console.log('even')
            for(var j=0;j<length;j++){
                if(j<length/2){
                    //console.log(j,Math.trunc(j+1-(i)/2)-1)
                    evenlySpaced.push(Math.trunc(j+1-(length)/2)-1)
                }
                if(j>=length/2){
                    //console.log(j,Math.trunc(j+1-(i)/2))
                    evenlySpaced.push(Math.trunc(j+1-(length)/2))
                }  
            }
        }
        if(length!=1&&length%2==1){
            //console.log('odd')
            for(j=0;j<length;j++){
                //console.log(i,j,(j)-((i-1)/2))
                evenlySpaced.push((j)-((length-1)/2))
            }
        }
        return evenlySpaced;
    }

}


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
    parentFlow;

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
        .content{
            width: 100%;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: capitalize;
        }
        :host(.active) .content{
            width: 100%;
            height: 100%;
            background: darkviolet;
            color: whitesmoke;
            padding: 1rem;
            border-radius: 0.5rem;
            justify-content: center;
            align-items: center;
            display: flex;
        }        
        `
    }
    get HTML(){
        return `
            <div class="content ${this.type}">
                
                    ${this.value.label}
                
            </div>     
        `
        
    }

    attachEventHandlers(){   
        if(!this.isActive)     
        this.attachInactiveEventHandlers()
    }
    removeEventHandlers(){
        if(this.isActive)
        this.removeInactiveEventHandlers()
    }

    afterRender(){
        this.currentView=this.shadowRoot.querySelector('.content')
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
    }
    handleMouseLeave(){
        this.blur()       
    }
    handleTransitionEnd(){
        this.updateLink()
    }
    handleAnimationEnd(){
        this.updateLink()
    }

    width;
    height;

    dimensions(width,height,depth){
        this.width=width;
        this.height=height;
        this.depth=depth;

        this.style.width=width;
        this.style.height=height;

        if(!this.isActive)
        this.inactiveState={...this.inactiveState,...{
            width:width,
            height:height,
            depth:depth,
        }}
        
    }

    coordinates(x,y,z){
        this.x=x
        this.y=y
        this.z=z

        this.style.left=x-this.getBoundingClientRect().width/2;//center the component
        this.style.top=y-this.getBoundingClientRect().height/2;//center the component;

        //console.log(this.style.left,x-this.getBoundingClientRect().width)

        if(this.style.top>this.parentFlow.height/2)
        this.style.transformOrigin="left center"

        if(!this.isActive)
        this.inactiveState={...this.inactiveState,...{
            x:x,
            y:y,
            z:z
        }}
    }

    nextCoordinates(x,y,z){
        var evenlySpaced=FlowUtility.getEvenlySpaced(this.outLinks.size);
        [...this.outLinks].forEach((link,i)=>{
            link.headFlowElement.coordinates(
                x,
                y+(evenlySpaced[i])*(this.getBoundingClientRect().height)//evenly arrage vertically
            )
            
        })
    }
    previousCoordinates(x,y,z){
        var evenlySpaced=FlowUtility.getEvenlySpaced(this.inLinks.size);
        [...this.inLinks].forEach((link,i)=>{
            link.tailFlowElement.coordinates(
                x,
                y+(evenlySpaced[i])*(this.getBoundingClientRect().height*0.8)//evenly arrage vertically
            )
            
        })
    }

    inLinks=new Set();
    outLinks=new Set();
    addInLink(link){
        link.headFlowElement=this
        this.inLinks.add(link)
        this.updateLinkHead()
    }
    addOutLink(link){
        link.tailFlowElement=this
        this.outLinks.add(link)
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
        var inLinksSize=this.inLinks.size
        var inlinkCenter=this.inLinks.size/2;
        var isEven=this.inLinks.size%2==0;
         
        [...this.inLinks].forEach((link,i)=>{
           
            var x2 = this.getBoundingClientRect().x;
            var y2 = this.getBoundingClientRect().y;
            var width2=this.getBoundingClientRect().width;
            var height2=this.getBoundingClientRect().height;
            link.setAttribute("x2", x2-8);
            link.setAttribute("y2", (y2 + height2 / 2)+(inLinksSize==1?0:10*(i+1-inlinkCenter))+(isEven?(-5):0));
        })
    }

    updateLinkTail(){
        [...this.outLinks].forEach((link)=>{
            var x1 = this.getBoundingClientRect().x;
            var y1 = this.getBoundingClientRect().y;
            
            var width1=this.getBoundingClientRect().width;
            var height1=this.getBoundingClientRect().height;

            
            link.setAttribute("x1", x1 + width1);
            link.setAttribute("y1", y1 + height1 / 2);
        })
    }

    focus(){
        //this.style.transformOrigin="left center"
        this.classList.add('focus')
        var event = new CustomEvent("focus");
        this.dispatchEvent(event);
        
        this.updateLink() 
    }
    blur(){
        this.classList.remove('focus')

        //this.style.transformOrigin=null
        
        var event = new CustomEvent("blur");
        this.dispatchEvent(event);        
        this.updateLink() 
    }
    focusNext(index){
        this.blur();
        [...this.outLinks].find(v=>{return [...this.value.next()][0]==v.headFlowElement.value.uid}).headFlowElement.focus()
    }
    focusPrevious(index){
        this.blur();
        [...this.inLinks].find(v=>{return [...this.value.previous()][0]==v.tailFlowElement.value.uid}).tailFlowElement.focus()
    }

    inactiveState={}

    active(){

        this.blur()
        this.removeInactiveEventHandlers()
        this.isActive=true
        this.classList.add("active")
        
        this.dimensions( this.parentFlow.active.width,this.parentFlow.active.height)
        this.animate({
            duration: 600,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: (progress)=>{                 
                this.coordinates(this.parentFlow.active.x, this.parentFlow.active.y)
            }
        });  
        this.updateView('active')
        
    }

    inactive(){
        this.attachInactiveEventHandlers()
        this.isActive=false
        this.classList.remove("active")  
        
        //console.log(this.inactiveState)        
        
        this.dimensions( this.inactiveState.width,this.inactiveState.height,this.inactiveState.depth)
        this.animate({
            duration: 600,
            timing: function(timeFraction) {
                return timeFraction;
            },
            draw: (progress)=>{                 
                this.coordinates(this.inactiveState.x,this.inactiveState.y,this.inactiveState.z)
            }
        });  
        
        this.updateView('inactive')
        
        this.blur()
        
    }

    currentView
    updateView(state){
        
        const content=this.value.getUi(state)
        if(content && this.currentView){
            this.shadowRoot.replaceChild(content,this.currentView)  
            this.currentView=content
        }else{            
            this.render()
            this.currentView=this.shadowRoot.querySelector('.content')
        }
        

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


class Flow extends ElementGroup{
    tags=['processes','inputs','outputs']
    link={}
    myObserver;
    active={
        
        width:"60%",
        height:"60%"
    }
    constructor() {
        super();        
        this.handleActiveListner = this.handleActive.bind(this)
        this.handleFocusListner = this.handleFocus.bind(this)
        
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
            
            position:absolute;            
            transition: all 300ms;
        }
        
        .flowElement:not(.active){
            border-radius: 4px;
            border: 2px solid #0c9ebf;
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
           visibility:visible;
           opacity:0.3;
           transform: scale(0.8);          
        }
        
        svg line{
            transition: all 300ms;
        }
        svg line.hidden {
           visibility:visible;
           opacity:0.3;
           ttransform: scale(0.8); 
                    
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
        document.onkeydown = (e)=>{this.checkKey(e)};
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
                      

        }else{

        }
    }  
    
    handleValueChange(){
        this.afterRender() 
    }
    
    checkKey(e) {

        e = e || window.event;

        if (e.keyCode == '38') {
            // up arrow
            this.focus('UP')
        }
        else if (e.keyCode == '40') {
            // down arrow
            this.focus('DOWN')
        }
        else if (e.keyCode == '37') {
            // left arrow
            this.focus('LEFT')
        }
        else if (e.keyCode == '39') {
            // right arrow
            this.focus('RIGHT')
        }

    }    
    focus(dir){
        var focused=this.shadowRoot.querySelector('.focus')
        if(!focused){
            this.shadowRoot.querySelector('.'+this.tags[0]).focus()

        }
        switch (dir) {
            case 'RIGHT':
                focused.focusNext() 
                break;
            case 'LEFT':
                focused.focusPrevious() 
                break;
        
            default:
                this.shadowRoot.querySelector('.'+this.tags[0]).focus()
                break;
        }
        
    }

    handleClose(){
        this.handleInactive(this.activeFlowElement)
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

        const width = this.clientWidth
        const height = this.clientHeight

        this.active.x=this.clientWidth/2
        this.active.y=this.clientHeight/2

        this.flowElementWidth = this.clientWidth/6
        this.flowElementHeight = this.clientHeight/6

        var svg = this._svg
        svg.attr("viewBox", `0 0 ${width} ${height}`)


        var startTime=performance.now()
        const xoffset = (width / 2)
        
        this.tags.forEach((tag,tagIndex)=>{

            var evenlySpaced=FlowUtility.getEvenlySpaced(this.value[tag].length);

            this.value[tag].forEach((functionUnit, functionUnitIndex) => {
                var flowElement = this.getFlowElement(functionUnit)
                flowElement.dimensions(this.flowElementWidth, this.flowElementHeight);
                flowElement.coordinates(xoffset,(height / 2))
                flowElement.classList.add(tag)
                this.myObserver.observe(flowElement);
                Array.from([...functionUnit.next()]).forEach(identifier => {
                    var nextFU = this.value.getFunctionalUnit(identifier)
                    if (nextFU && nextFU.flowElement) {
                        var link = this.getLink(functionUnit.uid, identifier)
                        flowElement.addOutLink(link)
                        nextFU.flowElement.addInLink(link)
                        
                        if(tagIndex!=0)
                        nextFU.flowElement.previousCoordinates(xoffset-(xoffset*0.8),(height / 2))
                    }
                })
                Array.from([...functionUnit.previous()]).forEach(identifier => {
                    var previousFU = this.value.getFunctionalUnit(identifier)
                    if (previousFU && previousFU.flowElement) {
                        var link = this.getLink(identifier,functionUnit.uid)
                        flowElement.addInLink(link)
                        previousFU.flowElement.addOutLink(link)

                        if(tagIndex!=0)
                        previousFU.flowElement.nextCoordinates(xoffset+(xoffset*0.8),(height / 2))
                    }
                })
            });
        })

        console.warn(`Processing flowElements took ${performance.now() - startTime}ms`);





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
        flowElement.type=functionUnit.type
        flowElement.value=functionUnit
        functionUnit.flowElement=flowElement;
        flowElement.parentFlow=this

        this.shadowRoot.querySelector('slot').append(flowElement)

        this.addFlowElementEventListeners(flowElement)
        
        return flowElement
    }
    getLink(sourceFlowElementIndentifier,destinationFlowElementIndentifier) {
        var link = this.link[sourceFlowElementIndentifier + "->" + destinationFlowElementIndentifier] 
        if(!link){
            link = this._svg.append("line")
                .style("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#triangle-outline)")
            this.link[sourceFlowElementIndentifier+ "->" + destinationFlowElementIndentifier] = link
        }
        return link.node();
    }


    handleActive(event){
        this.activeFlowElement=event.target; 
        this.removeFlowElementEventListeners(this.activeFlowElement)          
        this.activeFlowElement.active();  
        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE=>{
            notActiveFE.hide()
            this.removeFlowElementEventListeners(notActiveFE)
        })      
        
        this._svg.attr("viewBox", `0 0 ${this.clientWidth} ${this.clientHeight}`) 
    }

    handleInactive(flowElement){
        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE=>{
            notActiveFE.show()
            this.addFlowElementEventListeners(notActiveFE)
        })
        flowElement.inactive()     
        this.addFlowElementEventListeners(flowElement)
        this.activeFlowElement=null   
         

    }

    handleFocus(event){
        var prevousFocused=[...this.shadowRoot.querySelectorAll('.focus')].find(focused=>focused !=event.target)
        if(prevousFocused)
            prevousFocused.blur()
       
    }

    removeFlowElementEventListeners(flowElement){
        flowElement.removeEventListener('mousedown',this.handleActiveListner)
        flowElement.removeEventListener('focus', this.handleFocusListner, true);
        
    }
    addFlowElementEventListeners(flowElement){
        flowElement.addEventListener('mousedown', this.handleActiveListner)
        flowElement.addEventListener('focus', this.handleFocusListner, true);
        
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