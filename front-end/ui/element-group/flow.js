import { ElementGroup } from '../element-group/group.js'
import Element from '../element/element.js'
import 'https://cdn.jsdelivr.net/npm/d3@6.6.0/dist/d3.min.js'
import { Next } from '../element-group/next.js'



class FlowUtility {


    static getEvenlySpacedFromCenter(totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation) {
        if (totalDivisonAvailable == 0) {
            return { coordinates: [], divisonElementDimensions: [] }
        }
        //console.log('getEvenlySpacedFromCenter',totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation)
        var coordinates = [], divisonElementDimensions = []
        //Calculate Max possible div dimension
        var maxdivisonDimensionPossible = totalDivisonAvailable / divisonElements;

        //Calculation Divison Dimesion required with margins on both sides
        var divisonDimensionWithSeperation = divisonElementDimension + 2 * (minseparation);

        //Calculate Left over  divison not occupying dimension
        var leftOverDivisonFreeDimension = maxdivisonDimensionPossible - divisonDimensionWithSeperation;

        //Calculate Total Left over  divison not occupying dimension
        var totalleftOverDivisonFreeDimension = leftOverDivisonFreeDimension * divisonElements
        if (leftOverDivisonFreeDimension > 0) {

            var requiredTotalValue = totalDivisonAvailable - totalleftOverDivisonFreeDimension
            for (var i = 0; i < divisonElements; i++) {
                var x = totalleftOverDivisonFreeDimension / 2 + (divisonDimensionWithSeperation * i) + (divisonDimensionWithSeperation * 0.5)
                coordinates.push(x)
                divisonElementDimensions.push(divisonElementDimension)
            }
            return { coordinates, divisonElementDimensions }
        } else {
            //Decrease divison element dimension less then max divison 
            divisonElementDimension = maxdivisonDimensionPossible - 2 * (minseparation / 2) - 1;//-1 for imax depth issue

            //Recalculate Coordinates based on new divison value
            return FlowUtility.getEvenlySpacedFromCenter(totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation / 2)
        }
    }

    static subscribeResize(element, callback) {
        var selfObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {

                callback(entry)
                // console.log(entry.target)
                // console.log('width', entry.contentRect.width);
                // console.log('height', entry.contentRect.height);
                // console.log('x',entry.contentRect.top)
                // console.log('y',entry.contentRect.bottom)
            });
        });
        selfObserver.observe(element);
    }


}


class FlowElement extends Element {

    debug=true;

    constructor() {
        super();
    }


    static getSample() {
        const flowElement = document.createElement(FlowElement.tag)
        return flowElement
    }

    get placeholder() {
        return this.getAttribute('placeholder')
    }
    get showLabel() {
        return !!this.getAttribute('showlabel')
    }
    set showLabel(value) {
        return this.setAttribute('showlabel', 'true')
    }
    get showAction() {
        return !!this.getAttribute('showaction')
    }
    set showAction(value) {
        return this.setAttribute('showaction', 'true')
    }

    type;
    parentFlow;

    beforeRender() {
        super.beforeRender()
        this.showLabel = true
    }
    set config(value) {
        this._config = value
    }
    get config() {
        return this._config || {}
    }
    get CSS() {
        return `
        :host{
            display:flex;
            width: 100%;
        }
        :host(.active){
            box-shadow: 2px 2px 6px 3px grey;
        }
        :host.active>span{
            margin: 0;
            margin-top: 4rem;
            margin-bottom: 5rem;
            overflow: hidden;
            
        }        
        .content{
            width: calc(100% - 2rem);
            padding: 1rem;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            text-transform: capitalize;
        }
        :host(.active) .content{
            width: calc(100% - 2rem);
            height: calc(100% - 2rem);
            background: darkviolet;
            color: whitesmoke;
            padding: 1rem;
            border-radius: 0.5rem;
            justify-content: center;
            align-items: center;
            display: flex;
        }
        .action{
            position: absolute;
            left: -40px;
            top: 50%;
            border-radius: 50%;
            font-weight: bold;
            font-size: 1.2rem;
            border: 0;
            background: cornflowerblue;
            color: currentcolor;
            line-height: 1.2rem;
            padding: 0.25rem 0.3rem;
            z-index: 10;
            box-shadow: 1px 1px 5px 1px #223556;
            visibility: hidden;
        }   
        .action:hover{
            visibility: visible;
        } 
          
        ui-flow{
            box-shadow: 2px 2px 12px 2px grey;
            border-radius: 0.5rem;
        } 
        ui-flow ::-webkit-scrollbar {
            width: 0.8rem;
        }
        ui-flow ::-webkit-scrollbar-thumb {
            background: #0c9ebf;
            border-radius: 0.5rem;
        }
        ui-flow ::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            border-radius: 0.5rem;
        }
        `
    }
    get HTML() {
        return (async () => {
            const content = await this.value.getUi(this.state, this.shadowRoot)
            if (content) {
                return content
            } else {
                return `
                <button class="action add-previous" value="add-previous">+</button>
                <div class="content ${this.type}">
                    
                        ${this.value.label}
                    
                </div> 
                <button class="action add-next" value="add-next" >+</button>    
            `
            }
        })()


    }

    attachEventHandlers() {
        FlowUtility.subscribeResize(this, this.handleResize.bind(this))

        // this.shadowRoot.querySelector('.add-previous').onclick = this.handleAdd.bind(this);
        // this.shadowRoot.querySelector('.add-next').onclick = this.handleAdd.bind(this);

        this.attachInactiveEventHandlers()
    }
    removeEventHandlers() {
        this.removeInactiveEventHandlers()
    }

    afterRender() {
        this.handleAction('loaded')
    }
    attachInactiveEventHandlers() {
        this.addEventListener("mousedown", this.handleMouseDown);
        this.addEventListener("mouseenter", this.handleMouseEnter);
        this.addEventListener("mouseleave", this.handleMouseLeave);
        this.addEventListener("transitionend", this.handleTransitionEnd);
        this.addEventListener("animationend", this.handleAnimationEnd);
    }
    removeInactiveEventHandlers() {
        this.removeEventListener("mousedown", this.handleMouseDown);
        this.removeEventListener("mouseenter", this.handleMouseEnter);
        this.removeEventListener("mouseleave", this.handleMouseLeave);
        this.removeEventListener("transitionend", this.handleTransitionEnd);
        this.removeEventListener("animationend", this.handleAnimationEnd);
    }
    handleValueChange() {
        //this._value='';//this.shadowRoot.querySelector('input').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)


    }

    handleAdd(e) {
        this.debugger.log(e.value)
    }

    //Event Handlers
    handleMouseDown() {
        this.handleAction('click')
    }
    handleMouseEnter() {
        this.handleAction('hover')
    }
    handleMouseLeave() {
        this.handleAction('blur')
    }
    handleTransitionEnd() {
        this.updateLink()
    }
    handleAnimationEnd() {
        this.updateLink()
    }
    handleResize() {
        //this.debugger.log('Handling Resixe for',this.type,this.x,this.y,this.width,this.height,this.getBoundingClientRect().width,this.getBoundingClientRect().height)

        this.coordinates(this.x, this.y, this.z)//Added to handle scenerio when coordinates depends on srinking size based on dimension e.g when a element is converted to active


        this.updateLink(true)//Updates Links on window or element resize
    }
    actionConfig={
        'click': {action:'active',state:'default'},
        'hover': 'focus',
        'blur': 'blur',
        'loaded': ''
    }
    //Event to Action Converter
    handleAction(event) {
        const actionConfig = this.parentFlow.config.elementAction[event]?this.parentFlow.config.elementAction[event]:this.actionConfig[event]
        const action = actionConfig.action || actionConfig
        const state = actionConfig.state
        switch (action) {
            case 'active':
                if (this.state == state || !state) {
                    this.active()
                    break;
                }
            case 'focus':
                if (this.state == state || !state) {
                    this.focus()
                    break;
                }
            case 'blur':
                if (this.state == state || !state) {
                    this.blur()
                    break;
                }
            case 'hide':
                if (this.state == state || !state) {
                    this.hide()
                    break;
                }
            case 'show':
                if (this.state == state || !state) {
                    this.show()
                    break;
                }
            case 'flow':
                if (this.state == state || !state) {
                    this.flow()
                    break;
                }
            default:
                break;
        }
    }

    width;
    height;

    dimensions(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;

        this.style.width = width;
        this.style.height = height;

        //this.debugger.log("Set Dimenions",width,height)
        if (!this.isActive)
            this.inactiveState = {
                ...this.inactiveState, ...{
                    width: width,
                    height: height,
                    depth: depth,
                }
            }

    }

    coordinates(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        // this.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)` //Has challenge to really make it independent of other transform css 
        this.style.left = x - this.getBoundingClientRect().width / 2;//center the component
        this.style.top = y - this.getBoundingClientRect().height / 2;//center the component;

        //this.debugger.log("Set Coordinates",x,this.style.left,this.width,this.getBoundingClientRect().width,this.value.id)

        if (this.style.top > this.parentFlow.height / 2)
            this.style.transformOrigin = "left center"

        if (!this.isActive)
            this.inactiveState = {
                ...this.inactiveState, ...{
                    x: x,
                    y: y,
                    z: z
                }
            }
    }

    next() {
        return [...this.outLinks].map((link) => link.headFlowElement)
    }
    previous() {
        return [...this.inLinks].map((link) => link.tailFlowElement)
    }

    siblings() {
        //Get all Previous Based Siblings
        var previousSiblings = Array.from([...this.previous()].reduce((siblings, p) => {

            return new Set([...siblings, ...p.next()])

        }, new Set()))

        //Get all Next Based Siblings
        var nextSiblings = Array.from([...this.next()].reduce((siblings, n) => {

            return new Set([...siblings, ...n.previous()])

        }, new Set()))

        //Priority for next based siblings
        if (nextSiblings.length > 0) {
            return nextSiblings
        }

        if (previousSiblings.length > 0) {
            return previousSiblings
        }
        return []
    }

    inLinks = new Set();
    outLinks = new Set();
    addInLink(link) {
        link.headFlowElement = this
        this.inLinks.add(link)
        this.updateLinkHead()
    }
    addOutLink(link) {
        link.tailFlowElement = this
        this.outLinks.add(link)
        this.updateLinkTail()
    }

    updateLink(once) {
        if (once) {
            //this.coordinates(this.x,this.y,this.z)// to update width based calculation
            this.updateLinkHead();
            this.updateLinkTail();
        } else {
            this.animate({
                duration: 600,
                timing: function (timeFraction) {
                    return timeFraction;
                },
                draw: (progress) => {
                    //this.coordinates(this.x,this.y,this.z)// to update width based calculation              
                    this.updateLinkHead();
                    this.updateLinkTail();
                    //this.debugger.log('updateLink')
                }
            });
        }
    }

    updateLinkHead() {
        var inLinksSize = this.inLinks.size
        var inlinkCenter = this.inLinks.size / 2;
        var isEven = this.inLinks.size % 2 == 0;

        [...this.inLinks].forEach((link, i) => {

            var x2 = (this.getBoundingClientRect().x - this.parentFlow.getBoundingClientRect().x);
            var y2 = (this.getBoundingClientRect().y - this.parentFlow.getBoundingClientRect().y);
            var width2 = this.getBoundingClientRect().width;
            var height2 = this.getBoundingClientRect().height;
            link.setAttribute("x2", x2 + (isEven ? (-8) : (-6)));
            link.setAttribute("y2", (y2 + height2 / 2) + (inLinksSize == 1 ? 0 : 10 * (i + 1 - inlinkCenter)) + (isEven ? (-5) : 0));
        })
    }

    updateLinkTail() {
        [...this.outLinks].forEach((link) => {

            var x1 = (this.getBoundingClientRect().x - this.parentFlow.getBoundingClientRect().x);
            var y1 = (this.getBoundingClientRect().y - this.parentFlow.getBoundingClientRect().y);
            var width1 = this.getBoundingClientRect().width;
            var height1 = this.getBoundingClientRect().height;


            link.setAttribute("x1", x1 + width1);
            link.setAttribute("y1", y1 + height1 / 2);

            console.log("Set Dimenions", this, x1, y1, width1, height1, link)
        })
    }

    //Flow Element State handlers
    focus() {
        return
        //this.style.transformOrigin="left center"
        this.state = "focus";
        var event = new CustomEvent("focus");
        this.dispatchEvent(event);

        this.updateLink()
    }
    blur() {
        return
        this.state = "default";

        //this.style.transformOrigin=null

        var event = new CustomEvent("blur");
        this.dispatchEvent(event);
        this.updateLink()
    }
    focusNext(index) {
        this.blur();
        var nextByIndex = this.next()[index]
        if (nextByIndex) {
            nextByIndex.focus()
        } else {
            this.flow()
        }
    }
    focusPrevious(index) {
        this.blur();
        var previousByIndex = this.previous()[index]
        if (previousByIndex) {
            previousByIndex.focus()
        } else {
            this.flow()
        }
    }

    inactiveState = {}

    get isActive() {
        return this.state == 'active'
    }
    active() {
        this.state = "active"

        this.animate({
            duration: 600,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: (progress) => {
                this.parentFlow.update()
            }
        });



        var event = new CustomEvent("active");
        this.dispatchEvent(event);

    }

    inactive() {
        
        this.state = "default";     

        
        this.animate({
            duration: 600,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: (progress) => {
                this.parentFlow.update()
            }
        });
        
        var event = new CustomEvent("inactive");
        this.dispatchEvent(event);

    }
    hide() {
        this.removeInactiveEventHandlers()
        this.state = "hidden";
        [...this.inLinks, ...this.outLinks].forEach((link) => {
            link.classList.add('hidden')
        })
        this.updateLink()
    }
    show() {
        this.attachInactiveEventHandlers()
        this.state = "default";
        [...this.inLinks, ...this.outLinks].forEach((link) => {
            link.classList.remove('hidden')
        })
        this.updateLink()
    }
    flow() {
        var event = new CustomEvent("flow");
        this.dispatchEvent(event);
    }

    _state
    get state() {
        return this._state || "default";
    }

    set state(value) {
        if (!this._state != value) {
            this.classList.remove(this._state)
            this._state = value;
            this.classList.add(value)
            this.render()
        }
    }



    //Utilities    
    animate({ duration, draw, timing }) {

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

    static tag = 'ui-flow-element'



}
Element.register(FlowElement.tag, FlowElement);


class Flow extends ElementGroup {
    //To cache fe for each fu 
    fufemap = new WeakMap()
    //To cache all links
    linkMap = {}

    config;
    defaultConfig = {
        active: {},
        elementAction: {
            
        },
        flowAction: {
            "execute-button": "execute",            
            'left-key': 'previous',
            'right-key': 'next',
            'down-key': 'sibling-based-on-previous',
        }
    }
    constructor() {
        super();


        this.handleActiveListner = this.handleActive.bind(this)
        this.handleInactiveListner = this.handleInactive.bind(this)
        this.handleFocusListner = this.handleFocus.bind(this)
        this.handleResizeListner = this.handleResize.bind(this)
        this.handleKeyPressListner = this.handleKeyPress.bind(this)
        this.handleFlowListner = this.handleFlow.bind(this)



    }
    get CSS() {
        return `
        :host,:host(.relative) {
            display: block; 

            wwidth: 100%;
            hheight: 100%;
            width: 90%;
            background: #27282c;
            color: cornflowerblue;
            height: 70%;

            transform-style: preserve-3d;
            overflow:hidden;            
            position: relative;
            box-shadow: 0px 0px 7px 2px cornflowerblue;
            border-radius: 0.5rem;
        } 
        :host::-webkit-scrollbar {
            width: 0.6rem;
        }
        :host::-webkit-scrollbar-thumb {
            background: #2f606a;
            border-radius: 0.5rem;
        }
        :host::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px #27282c;
            border-radius: 0.5rem;
        } 

        :host(.flex){
            position: relative;
            display: flex;
            justify-content: space-evenly;
            align-items: center;    
            /**align-content: center;**/ /**Scroll Issue**/
            flex-wrap: wrap;
            overflow: auto;
            top: 0; 
        }
               
        
        svg{
            height: 100%;
        }
        :host(.flex) svg{
            display:none
        }
        
        .flowElement{
            
            position:absolute;            
            transition: all 200ms;
        }

        :host(.flex) .flowElement{
            position:initial; 
            margin: 1rem;
            z-index:10;
        }
        @media screen and (max-width: 480px) {
            :host{
                font-size:32px
            }
            .flowElement{                
                -min-width: 25rem;
            }
        }
        @media screen and (min-width: 480px) {
            :host{
                font-size:16px
            }
            .flowElement{                
                -min-width: 15rem;
                -min-height: 10rem;
            }
        }
        :host(.flex) .flowElement.active {
            max-width: unset;
            min-width: unset;
            flex: auto;
            position:fixed; 
        }

        

        :host .flowElement.active,:host(.flex) .flowElement.active {
            z-index:11
        }
        
        .flowElement:not(.active){
            border-radius: 4px;
            border: 2px solid #0c9ebf;
            transform: scale(1);            
            -webkit-filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
            filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
            box-shadow: 1px 2px 5px 0px #05677d;
            overflow: hidden;
        }

        .flowElement:not(.active).focus {            
            transform: scale(1.2);
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
            stroke: #e87884;
        }
        svg line.hidden {
           visibility:visible;
           opacity:0.3;
           ttransform: scale(0.8); 
                    
        }

        svg line, svg marker>path{
            stroke: #171515;
        }
        
        
        
        .button {
            background-color: #394753;
            border: none;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            border-radius: 4px;
            color: #1a73e8;
            box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);        
            pointer-events: auto;
            text-transform: none;
            text-decoration: none;
            
            -webkit-transition: -webkit-transform .3s ease-in-out;
            transition: -webkit-transform .3s ease-in-out;
            transition: transform .3s ease-in-out;
            transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
            -webkit-transform: scale(1);
            transform: scale(1);

            line-height: 1rem;
            margin: 0.5rem 0.2rem;
            padding: 0.5rem 1rem;
        }
        .slot-actions{
            position: ${this.isOverflown()?'sticky':'absolute'};
            display: block;
            bottom: 0;
            width: 100%;
        }

        .actions .button.hover-visible {
            width: 0;
            padding: 0;
            margin: 0;
            overflow:hidden;
        }
        .actions:hover .button.hover-visible {
            width: auto;
            margin: 0.5rem 0.2rem;
            padding: 0.5rem 1rem;
        }
        .actions{
            position: sticky;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: flex-end;
            height: 3rem;
            z-index: 1000;
            flex: auto;
            flex-direction: row;
            align-content: space-around;
            align-items: stretch;
        }
        @media screen and (min-width: 480px) {
            .actions{
                height: 9rem;
            }
            .button{

            }
        }

        @media screen and (min-width: 480px) {
            .actions{
                height: 3rem;
            }
        }

        :host(.flex) .actions{
            
        }
        .bbutton:not(:hover) {
            display: none;
        }
        .actions:hover + .hide {
            display: block;
        }

        `

    }
    get HTML() {
        return `
            <slot>
                <svg></svg>
            </slot>
            <slot name="actions" class="slot-actions">
                <div class="actions">
                   ${this.actionHtml}
                    
                </div>
            </slot>
        `
    }
    get actionHtml() {
        return `
        ${this.value.getFlowActions().map(action => `<button class="button ${action.id} ${action.className || ''}" id="${action.id}">${action.label}</button>`).join('\n')}
        <button class="button close" id="close"><i class="fas fa-times"></i></button>
        `
    }
    isOverflown() {
        return this.scrollHeight > this.clientHeight || this.scrollWidth > this.clientWidth;
    }
    attachEventHandlers() {
        FlowUtility.subscribeResize(this, this.handleResizeListner.bind(this))
        window.addEventListener("resize", this.handleResizeListner)
        document.addEventListener("keydown", this.handleKeyPressListner)

        this.shadowRoot.querySelector('#close').onclick = this.handleClose.bind(this);
        this.value.getFlowActions().forEach(action => {
            this.shadowRoot.querySelector(`button.${action.id}`).onclick = () => { action.handler.call(this.value, this, action) }
        })

    }
    removeEventHandlers() {
        window.removeEventListener("resize", this.handleResizeListner)
        document.removeEventListener("keydown", this.handleKeyPressListner)

    }
    afterRender() {
       this.setupConfig()

        this.linkMap = {}
        this.fufemap = new WeakMap()
        this.config.active = {}
        if (this._svg) {
            this._svg.node().remove();
            this._svg = null
        }



        var flowElement = document.querySelector('ui-flow-element')
        while (flowElement) {
            flowElement.remove()
            flowElement = document.querySelector('ui-flow-element')
        }

        if (this.value) {
            this.debugger.log('afterRender updateSVG')
            this.updateSVG()
        } else {

        }
    }


    update() {
        this.setupConfig()
        this.debugger.log('update updateSVG')
        this.updateSVG()
    }

    setupConfig(){
        var flowConfig = this.value.flowConfig || {}
        var elementAction = { ...this.defaultConfig.elementAction, ...flowConfig.elementAction || {} }
        var flowAction = { ...this.defaultConfig.flowAction, ...flowConfig.flowAction || {} }
        var defaultValue = { ...this.defaultConfig.defaultValue, ...flowConfig.defaultValue || {} }
        this.config = { ...this.defaultConfig, ...flowConfig, elementAction, flowAction, defaultValue }

        if (this.config.flex) {
            this.classList.add('flex')
        } else {
            this.classList.remove('flex')
        }
    }

    handleKeyPress(e) {
        //this.debugger.log(e)
        e = e || window.event;
        if (e.keyCode == '13') {
            this.setActiveByEnterKey()
        }
        if (e.keyCode == '38') {
            // up arrow
            this.focusFEByKeyBoard('UP')
        }
        else if (e.keyCode == '40') {
            // down arrow
            this.focusFEByKeyBoard('DOWN')
        }
        else if (e.keyCode == '37') {
            // left arrow
            this.focusFEByKeyBoard('LEFT')
        }
        else if (e.keyCode == '39') {
            // right arrow
            this.focusFEByKeyBoard('RIGHT')
        }

    }

    _focusByKeyBoardIndex = 0;
    _focusByKeyBoardDir = 0;
    focusFEByKeyBoard(dir) {
        var focused = this.shadowRoot.querySelector('.focus')
        if (!focused) {
            this.shadowRoot.querySelector('.' + this.value.types[0]).focus()
            return;
        }
        switch (dir) {
            case 'RIGHT':
                this._focusByKeyBoardIndex = 0;
                this._focusByKeyBoardDir = 1;
                focused.focusNext(this._focusByKeyBoardIndex)
                break;
            case 'LEFT':
                this._focusByKeyBoardIndex = 0;
                this._focusByKeyBoardDir = -1;
                focused.focusPrevious(this._focusByKeyBoardIndex)
                break;
            case 'DOWN':
                this._focusByKeyBoardIndex += 1;
                (this._focusByKeyBoardDir > 0 ? focused.previous()[0].focusNext(this._focusByKeyBoardIndex) : focused.next()[0].focusPrevious(this._focusByKeyBoardIndex))
                break;

            case 'UP':
                this._focusByKeyBoardIndex -= 1;
                (this._focusByKeyBoardDir > 0 ? focused.previous()[0].focusNext(this._focusByKeyBoardIndex) : focused.next()[0].focusPrevious(this._focusByKeyBoardIndex))
                break;

            default:
                this._focusByKeyBoardDir = 0;
                this._focusByKeyBoardIndex = 0;
                this.shadowRoot.querySelector('.' + this.value.types[0]).focus()
                break;
        }

    }
    setActiveByEnterKey() {
        var focused = this.shadowRoot.querySelector('.focus')
        focused.active()
    }





    //Update flowElments and their links
    async updateSVG() {

        const containerWidth = this.clientWidth
        const containerheight = this.clientHeight





        var container = this.getContainer(this.clientWidth, this.clientHeight)


        this.performanceStart(`Processing flowElements took`)




        this.typesToRender.forEach(async (type) => {

            this.performanceStart(`Processing flowElements took for ${type}`)

            var typeIndex = this.getTypeIndex(type)
            this.value.getElements().filter(de => de.type == type).forEach((DesignElement, functionUnitIndex) => {
                var flowElement = this.getFlowElement(DesignElement)



                const { width, height } = this.getFlowElementDimension(flowElement)
                const { xpadding, ypadding } = this.getFlowElementDimensionpadding(flowElement);
                var xEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(containerWidth, this.value.types.length, width, xpadding)


                const newWidth = (this.config.flex || flowElement.isActive) ? width : xEvenelySpaced.divisonElementDimensions[typeIndex]
                flowElement.dimensions(newWidth, height);
                //this.debugger.log(flowElement.type, 'Direct', xEvenelySpaced.coordinates[typeIndex], xEvenelySpaced.divisonElementDimensions[typeIndex], flowElement.getBoundingClientRect().x)


                flowElement.classList.add(type)

                var fuNexts = Array.from([...DesignElement.next()])
                var fuPreviouses = Array.from([...DesignElement.previous()])

                //Create Link for Each next FU if exist and update cordinates for that fu's fe if exist
                fuNexts.forEach(id => {
                    var nextFU = this.value.getElement(id)
                    var nextFUflowElement = this.getFlowElement(nextFU, true)
                    if (nextFU && nextFUflowElement) {
                        this.link(flowElement, nextFUflowElement)
                        //this.link(nextFUflowElement,flowElement)                        
                    }
                })
                //Create Link for Each next FU if exist and update cordinates for that fu's fe if exist
                fuPreviouses.forEach(id => {
                    var previousFU = this.value.getElement(id)
                    var previousFUflowElement = this.getFlowElement(previousFU, true)
                    if (previousFU && previousFUflowElement) {
                        this.link(previousFUflowElement, flowElement)
                        //this.link(flowElement,previousFUflowElement) 
                    }
                })

                //Calculate and set coordinates 
                if (!this.config.flex) {
                    const { x, y } = this.getFlowElementCoordinates(flowElement)
                    flowElement.coordinates(x, y)
                }

            });

            this.performanceEnd(`Processing flowElements took for ${type}`)


        })

        this.performanceEnd(`Processing flowElements took`)


    }

    order = 'right-to-left' || 'left-to-right' || 'center'
    get typesToRender() {
        if (this.types.length == 1) {
            return this.types
        }
        if (this.order == 'left-to-right')
            return [...this.types, this.types[0]]
        else if (this.order == 'right-to-left')
            //return [...this.types.reverse(), this.types[this.types.length - 1], ...this.types.reverse(), this.types[this.types.length - 1]]
            return [...this.types.reverse(), this.types[this.types.length - 1]]
        else
            return [...this.types, this.types[0]]
    }
    get types() {
        return this.value.types
    }

    getTypeIndex(type) {
        return this.types.indexOf(type)
    }


    //Create SVG Container
    getContainer(width, height) {
        if (this._svg) {

            this._svg.attr("viewBox", `0 0 ${width} ${height}`)
            return this._svg
        }
        var svg = this.shadowRoot.querySelector('svg')
        var d3svg = d3.select(svg)
            //.append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("viewBox", `0 0 ${width} ${height}`)

        d3svg.append("svg:defs")
            .append("filter")
            .attr("id", "blurEdge")
            .append("feGaussianBlur")
            .attr("in", "SourceGraphic")
            .attr("stdDeviation", "2")


        d3svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle-outline")
            .attr("viewBox", "0 0 10 10")
            .attr("refX", 3)
            .attr("refY", 5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 0 L 10 5 L 0 10 z")
        //.style("fill", "black");



        d3svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle-fill")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0 -5 10 10")
        //.style("stroke", "black");

        // svg.call(d3.zoom()
        //     .extent([[0, 0], [width, height]])
        //     .scaleExtent([1, 8])
        //     .on("zoom", zoomed));

        // function zoomed() {
        //     this.value.inputs[0].flowElement.attr("transform", d3.event.transform);
        // }

        // // Create scale
        // var scale = d3.scaleLinear()  
        //             .domain([0, this.clientWidth])                  
        //             .range([0, this.clientWidth]);

        // // Add scales to axis
        // var x_axis = d3.axisBottom()
        //             .scale(scale);

        // //Append group and insert axis
        // d3svg.append("g")
        // .call(x_axis);


        this._svg = d3svg
        return this._svg
    }
    //Create or use cached flowelements
    getFlowElement(designElement, avoidCreation) {
        if (this.fufemap.has(designElement)) {
            return this.fufemap.get(designElement)
        }
        if (avoidCreation) {
            return
        }
        var flowElement = document.createElement('ui-flow-element')

        this.fufemap.set(designElement, flowElement)

        flowElement.type = designElement.type
        flowElement.value = designElement
        flowElement.parentFlow = this
        flowElement.config = designElement.config
        flowElement.actionConfig = {...flowElement.actionConfig,...designElement.config.action||{}}

        this.shadowRoot.querySelector('slot').append(flowElement)

        this.addFlowElementEventListeners(flowElement)

        return flowElement
    }
    getFlowElementDimension(flowElement) {
        const state = flowElement.state
        switch (state) {
            case 'active':
                var width = this.config.active.width || this.clientWidth*0.6
                var height = this.config.active.height || this.clientHeight*0.6
                return { width, height }
                break;

            default:
                var width = flowElement.config.width || this.config.feWidth || ((flowElement.config.widthPercentage || this.config.feWidthPercentage || 33) / 100) * this.clientWidth
                var height = flowElement.config.height || this.config.feHeight || ((flowElement.config.heightPercentage || this.config.feHeightPercentage || 33) / 100) * this.clientHeight
                return { width, height }
        }

    }
    getFlowElementDimensionpadding(flowElement) {
        const { width, height } = this.getFlowElementDimension(flowElement)
        var xpadding = flowElement.config.xPadding || width * ((flowElement.config.xPaddingPercentage || this.config.fexPaddingPercentage) / 100 || 0.4)
        var ypadding = flowElement.config.yPadding || height * ((flowElement.config.yPaddingPercentage / 100 || this.config.feyPaddingPercentage) || 0.2)
        return { xpadding, ypadding }
    }
    getFlowElementCoordinates(flowElement) {
        const { width, height } = this.getFlowElementDimension(flowElement)
        const { xpadding, ypadding } = this.getFlowElementDimensionpadding(flowElement);
        const state = flowElement.state
        switch (state) {
            case 'active':

                var x = this.config.active.x || this.clientWidth / 2
                var y = this.config.active.y || this.clientHeight / 2
                return { x, y }

            default:
                var xEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(
                    this.clientWidth,
                    this.value.types.length,
                    width,
                    xpadding
                )

                var siblings = this.shadowRoot.querySelectorAll('.' + flowElement.type)//flowElement.siblings()//Have to find most scalable way
                var yEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(
                    this.clientHeight,
                    siblings.length,
                    height,
                    ypadding
                )

                var xindex = this.value.types.indexOf(flowElement.type)
                var yindex = [...siblings].indexOf(flowElement)


                var x = xEvenelySpaced.coordinates[xindex]
                var y = yEvenelySpaced.coordinates[yindex]
                return { x, y }
        }

    }


    //link two flowments
    link(sourceFlowElement, destinationFlowElement) {
        var link = this.getLink(sourceFlowElement, destinationFlowElement)
        sourceFlowElement.addOutLink(link)
        destinationFlowElement.addInLink(link)
    }
    //Create or use cached flowelement links
    getLink(sourceFlowElement, destinationFlowElement) {
        var link = this.linkMap[sourceFlowElement.value.id + "->" + destinationFlowElement.value.id]
        if (!link) {
            link = this._svg.append("line")
                //.style("stroke", "black")
                .attr("stroke-width", 2)
                .attr("marker-end", "url(#triangle-outline)")
            this.linkMap[sourceFlowElement.value.id + "->" + destinationFlowElement.value.id] = link
        }
        return link.node();
    }

    handleResize() {
        this.debugger.log('handleResize updateSVG')
        this.updateSVG()
    }

    handleActive(event) {
        this.removeFlowElementEventListeners(event.target);

        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE => {
            notActiveFE.hide()
            this.removeFlowElementEventListeners(notActiveFE)
        })
        document.removeEventListener("keydown", this.handleKeyPressListner)
    }

    handleInactive(event) {
        [...this.shadowRoot.querySelector('slot').querySelectorAll(".flowElement:not(.active)")].forEach(notActiveFE => {
            notActiveFE.show()
            this.addFlowElementEventListeners(notActiveFE)
        })
        this.addFlowElementEventListeners(event.target)
        document.addEventListener("keydown", this.handleKeyPressListner)

    }

    handleFocus(event) {
        var prevousFocused = [...this.shadowRoot.querySelectorAll('.focus')].find(focused => focused != event.target)
        if (prevousFocused)
            prevousFocused.blur()

    }

    handleFlow(event) {
        //this.value=event.target.value.design;
        const changeEvent = new CustomEvent('openflow', {
            detail: { value: event.target.value }//send DesignElement Instance
        });

        this.dispatchEvent(changeEvent)
    }

    handleClose() {
        var activeFlowElements = this.shadowRoot.querySelectorAll('.active')
        var flowElements = this.shadowRoot.querySelectorAll('ui-flow-element')
        if (activeFlowElements.length > 0 && flowElements.length>1) {
            activeFlowElements.forEach(fu => fu.inactive())
        } else {

            const changeEvent = new CustomEvent('closeflow', {
                detail: { value: this.value }
            });

            this.dispatchEvent(changeEvent)
        }
    }

    removeFlowElementEventListeners(flowElement) {
        flowElement.removeEventListener('active', this.handleActiveListner)
        flowElement.addEventListener('inactive', this.handleInactiveListner)
        flowElement.removeEventListener('focus', this.handleFocusListner, true);
        flowElement.addEventListener('flow', this.handleFlowListner);

    }
    addFlowElementEventListeners(flowElement) {
        flowElement.addEventListener('active', this.handleActiveListner)
        flowElement.removeEventListener('inactive', this.handleInactiveListner)
        flowElement.addEventListener('focus', this.handleFocusListner, true);//capture focus instead of bubble
        flowElement.addEventListener('flow', this.handleFlowListner);

    }



    static getSample() {
        const listElement = document.createElement(ElementGroup.elementRegistry[this])
        listElement.value = ['Item 1', 'Item 2', 'Item 3']
        return listElement
    }

    static tag = 'ui-flow';

}
ElementGroup.register(Flow.tag, Flow);

export { Flow, FlowElement };
