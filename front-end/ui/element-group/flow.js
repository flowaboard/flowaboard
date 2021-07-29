import { ElementGroup } from '../element-group/group.js'
import { Element } from '../element/element.js'
//import '../../../node_modules/d3/dist/d3.js'
import 'https://cdn.jsdelivr.net/npm/d3@6.6.0/dist/d3.min.js'
import { Next } from '../element-group/next.js'
//import '../../node_modules/d3-3d/src/3d.js'

class FlowUtility {


    static getEvenlySpacedFromCenter(totalDivisonAvailable, divisonElements, divisonElementDimension, minseparation) {
        if(totalDivisonAvailable==0){
            return {coordinates:[],divisonElementDimensions:[]}
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

    constructor() {
        super();
    }


    static getSample() {
        const flowElement = document.createElement('ui-flow-element')
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
        return `
            <button class="action add-previous" value="add-previous">+</button>
            <div class="content ${this.type}">
                
                    ${this.value.label}
                
            </div> 
            <button class="action add-next" value="add-next" >+</button>    
        `

    }

    attachEventHandlers() {
        FlowUtility.subscribeResize(this, this.handleResize.bind(this))

        this.shadowRoot.querySelector('.add-previous').onclick = this.handleAdd.bind(this);
        this.shadowRoot.querySelector('.add-next').onclick = this.handleAdd.bind(this);

        if (!this.isActive)
            this.attachInactiveEventHandlers()
    }
    removeEventHandlers() {
        if (this.isActive)
            this.removeInactiveEventHandlers()
    }

    afterRender() {
        this.updateView()
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
        console.log(e.value)
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
        //console.log('Handling Resixe for',this.type,this.x,this.y,this.width,this.height,this.getBoundingClientRect().width,this.getBoundingClientRect().height)

        this.coordinates(this.x, this.y, this.z)//Added to handle scenerio when coordinates depends on srinking size based on dimension e.g when a element is converted to active


        this.updateLink(true)//Updates Links on window or element resize
    }

    //Event to Action Converter
    handleAction(event) {
        const action = this.parentFlow.config.action[event]
        switch (action) {
            case 'active':
                this.active()
                break;
            case 'focus':
                this.focus()
                break;
            case 'blur':
                this.blur()
                break;
            case 'hide':
                this.hide()
                break;
            case 'show':
                this.show()
                break;
            case 'flow':
                this.flow()
                break;

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

        //console.log("Set Dimenions",width,height)
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

        //console.log("Set Coordinates",x,this.style.left,this.width,this.getBoundingClientRect().width,this.value.id)

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
                    //console.log('updateLink')
                }
            });
        }
    }

    updateLinkHead() {
        var inLinksSize = this.inLinks.size
        var inlinkCenter = this.inLinks.size / 2;
        var isEven = this.inLinks.size % 2 == 0;

        [...this.inLinks].forEach((link, i) => {

            var x2 = this.getBoundingClientRect().x;
            var y2 = this.getBoundingClientRect().y;
            var width2 = this.getBoundingClientRect().width;
            var height2 = this.getBoundingClientRect().height;
            link.setAttribute("x2", x2 + (isEven ? (-8) : (-6)));
            link.setAttribute("y2", (y2 + height2 / 2) + (inLinksSize == 1 ? 0 : 10 * (i + 1 - inlinkCenter)) + (isEven ? (-5) : 0));
        })
    }

    updateLinkTail() {
        [...this.outLinks].forEach((link) => {
            var x1 = this.getBoundingClientRect().x;
            var y1 = this.getBoundingClientRect().y;

            var width1 = this.getBoundingClientRect().width;
            var height1 = this.getBoundingClientRect().height;


            link.setAttribute("x1", x1 + width1);
            link.setAttribute("y1", y1 + height1 / 2);
        })
    }

    //Flow Element State handlers
    focus() {
        //this.style.transformOrigin="left center"
        this.classList.add('focus')
        var event = new CustomEvent("focus");
        this.dispatchEvent(event);

        this.updateLink()
    }
    blur() {
        this.classList.remove('focus')

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

    active() {

        this.blur()
        this.removeInactiveEventHandlers()
        this.isActive = true
        this.classList.add("active")
        var { width, height } = this.parentFlow.getFlowElementDimension(this)
        this.dimensions(width, height)
        this.animate({
            duration: 600,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: (progress) => {
                var { x, y } = this.parentFlow.getFlowElementCoordinates(this)
                this.coordinates(x, y)
            }
        });
        this.updateView('active')

        var event = new CustomEvent("active");
        this.dispatchEvent(event);

    }

    inactive() {
        this.attachInactiveEventHandlers()
        this.isActive = false
        this.classList.remove("active")

        //console.log(this.inactiveState)        

        this.dimensions(this.inactiveState.width, this.inactiveState.height, this.inactiveState.depth)
        this.animate({
            duration: 600,
            timing: function (timeFraction) {
                return timeFraction;
            },
            draw: (progress) => {
                var { x, y } = this.parentFlow.getFlowElementCoordinates(this)
                this.coordinates(x, y)
            }
        });

        this.updateView('inactive')

        this.blur()
        var event = new CustomEvent("inactive");
        this.dispatchEvent(event);

    }
    hide() {
        this.removeInactiveEventHandlers()
        this.classList.add('hidden');
        [...this.inLinks, ...this.outLinks].forEach((link) => {
            link.classList.add('hidden')
        })
        this.updateLink()
    }
    show() {
        this.attachInactiveEventHandlers()
        this.classList.remove('hidden');
        [...this.inLinks, ...this.outLinks].forEach((link) => {
            link.classList.remove('hidden')
        })
        this.updateLink()
    }
    flow() {
        var event = new CustomEvent("flow");
        this.dispatchEvent(event);
    }

    getState() {
        if (this.isActive) return 'active';
    }


    content
    async updateView(state) {

        const content = (await this.value.getUi(state,this.shadowRoot))||this.shadowRoot.querySelector('.content')
        if (content && this.content && content != this.content){
            this.shadowRoot.replaceChild(content,this.content)
            this.content = content                        
        }else if(!content){
            this.render()
            this.content = this.shadowRoot.querySelector('.content')
        }else if(!this.content){
            this.content = this.shadowRoot.querySelector('.content')
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




}
Element.register('ui-flow-element', FlowElement);


class Flow extends ElementGroup {
    //To cache fe for each fu 
    fufemap = new WeakMap()
    //To cache all links
    linkMap = {}

    config;
    defaultConfig = {
        active: {},
        action: {
            'click': 'active',
            'hover': 'focus',
            'blur': 'blur',
            'left-key': 'previous',
            'right-key': 'next',
            'down-key': 'sibling-based-on-previous'
        }
    }
    constructor() {
        super();


        this.handleActiveListner = this.handleActive.bind(this)
        this.handleInactiveListner = this.handleInactive.bind(this)
        this.handleFocusListner = this.handleFocus.bind(this)
        this.handleSVGResizeListner = this.handleSVGResize.bind(this)
        this.handleKeyPressListner = this.handleKeyPress.bind(this)
        this.handleFlowListner = this.handleFlow.bind(this)



    }
    get CSS() {
        return `
        :host,:host(.relative) {
            display: block;
            height:100%;
            width: 100%;
            transform-style: preserve-3d;
            overflow:hidden;            
            position: relative;
        }

        :host(.flex){
            position: relative;
            width: 100%;
            height: calc(100%);
            display: flex;
            justify-content: space-evenly;
            align-items: center;
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
            background-color: #96b4ce40;
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
            margin: 0.5rem;
            margin-right:2rem;
            padding: 0.5rem 1rem;
        }
        
        .button:hover {
            background-color: #f1f1f1;
        }
        .actions{
            position: fixed;
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
            <slot name="actions">
                <div class="actions">
                    <button class="button close" id="close"><i class="fas fa-times"></i></button>
                </div>
            </slot>
        `
    }
    attachEventHandlers() {
        FlowUtility.subscribeResize(this, this.handleSVGResizeListner.bind(this))
        window.addEventListener("resize", this.handleSVGResizeListner)
        document.addEventListener("keydown", this.handleKeyPressListner)

        this.shadowRoot.querySelector('#close').onclick = this.handleClose.bind(this);

    }
    removeEventHandlers() {
        window.removeEventListener("resize", this.handleSVGResizeListner)
        document.removeEventListener("keydown", this.handleKeyPressListner)

    }
    afterRender() {
        var flowConfig = this.value.flowConfig || {}
        var action = { ...this.defaultConfig.action, ...flowConfig.action || {} }
        var defaultValue = { ...this.defaultConfig.defaultValue, ...flowConfig.defaultValue || {} }
        this.config = { ...this.defaultConfig, ...flowConfig, action, defaultValue }

        if (this.config.flex) {
            this.classList.add('flex')
        } else {
            this.classList.remove('flex')
        }

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
            console.log('afterRender updateSVG')
            this.updateSVG()
        } else {

        }
    }


    update() {
        console.log('update updateSVG')
        this.updateSVG()
    }

    handleKeyPress(e) {
        //console.log(e)
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

        const width = this.clientWidth
        const height = this.clientHeight





        var container = this.getContainer(this.clientWidth, this.clientHeight)


        this.performanceStart(`Processing flowElements took`)



        
        this.typesToRender.forEach((type) => {
            this.performanceStart(`Processing flowElements took for ${type}`)

            var typeIndex = this.getTypeIndex(type)
            this.value.designElements.filter(de=>de.type==type).forEach((DesignElement, functionUnitIndex) => {
                var flowElement = this.getFlowElement(DesignElement)


                if (flowElement.isActive) {
                    return
                }

                var xEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(width, this.value.types.length, this.getFlowElementDimension(flowElement).width, this.getFlowElementDimensionpadding(flowElement).xpadding)



                flowElement.dimensions(xEvenelySpaced.divisonElementDimensions[typeIndex], this.getFlowElementDimension(flowElement).height);
                // /flowElement.coordinates(xEvenelySpaced.coordinates[typeIndex],(height / 2))
                //console.log(flowElement.type, 'Direct', xEvenelySpaced.coordinates[typeIndex], xEvenelySpaced.divisonElementDimensions[typeIndex], flowElement.getBoundingClientRect().x)


                flowElement.classList.add(type)
                
                var fuNexts = Array.from([...DesignElement.next()])
                var fuPreviouses = Array.from([...DesignElement.previous()])

                //Create Link for Each next FU if exist and update cordinates for that fu's fe if exist
                fuNexts.forEach(identifier => {
                    var nextFU = this.value.getFunctionalUnit(identifier)
                    var nextFUflowElement = this.getFlowElement(nextFU, true)
                    if (nextFU && nextFUflowElement) {
                        this.link(flowElement, nextFUflowElement)
                        //this.link(nextFUflowElement,flowElement)                        
                    }
                })
                //Create Link for Each next FU if exist and update cordinates for that fu's fe if exist
                fuPreviouses.forEach(identifier => {
                    var previousFU = this.value.getFunctionalUnit(identifier)
                    var previousFUflowElement = this.getFlowElement(previousFU, true)
                    if (previousFU && previousFUflowElement) {
                        this.link(previousFUflowElement, flowElement)
                        //this.link(flowElement,previousFUflowElement) 
                    }
                })

                //Calculate and set coordinates 
                flowElement.coordinates(this.getFlowElementCoordinates(flowElement).x, this.getFlowElementCoordinates(flowElement).y)

            });

            this.performanceEnd(`Processing flowElements took for ${type}`)


        })

        this.performanceEnd(`Processing flowElements took`)


    }

    order = 'right-to-left' || 'left-to-right' || 'center'
    get typesToRender() {
        if(this.types.length==1){
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

        this.shadowRoot.querySelector('slot').append(flowElement)

        this.addFlowElementEventListeners(flowElement)

        return flowElement
    }
    getFlowElementDimension(flowElement) {
        const state = flowElement.getState()
        switch (state) {
            case 'active':
                var width = this.config.active.width || "60%"
                var height = this.config.active.height || "60%"
                return { width, height }
                break;

            default:
                var width = flowElement.config.width||this.config.feWidth  || ((flowElement.config.widthPercentage ||this.config.feWidthPercentage || 33)/100)*this.clientWidth
                var height = flowElement.config.height||this.config.feHeight  || ((flowElement.config.heightPercentage||this.config.feHeightPercentage || 33)/100)*this.clientHeight
                return { width, height }
        }

    }
    getFlowElementDimensionpadding(flowElement) {
        var xpadding = flowElement.config.xPadding||this.getFlowElementDimension(flowElement).width * ((flowElement.config.xPaddingPercentage||this.config.fexPaddingPercentage)/100 || 0.4)
        var ypadding = flowElement.config.yPadding||this.getFlowElementDimension(flowElement).height * ((flowElement.config.yPaddingPercentage/100||this.config.feyPaddingPercentage) || 0.2)
        return { xpadding, ypadding }
    }
    getFlowElementCoordinates(flowElement) {
        const state = flowElement.getState()
        switch (state) {
            case 'active':

                var x = this.config.active.x || this.clientWidth / 2
                var y = this.config.active.y || this.clientHeight / 2
                return { x, y }

            default:
                var xEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(
                    this.clientWidth,
                    this.value.types.length,
                    this.getFlowElementDimension(flowElement).width,
                    this.getFlowElementDimensionpadding(flowElement).xpadding
                )

                var siblings = this.shadowRoot.querySelectorAll('.' + flowElement.type)//flowElement.siblings()//Have to find most scalable way
                var yEvenelySpaced = FlowUtility.getEvenlySpacedFromCenter(
                    this.clientHeight,
                    siblings.length,
                    this.getFlowElementDimension(flowElement).height,
                    this.getFlowElementDimensionpadding(flowElement).ypadding
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

    handleSVGResize() {
        console.log('handleSVGResize updateSVG')
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
        if (activeFlowElements.length > 0) {
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



    static getSample() {
        const listElement = document.createElement(ElementGroup.elementRegistry[this])
        listElement.value = ['Item 1', 'Item 2', 'Item 3']
        return listElement
    }

}
ElementGroup.register('ui-flow', Flow);
export { Flow };