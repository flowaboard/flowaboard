import { ElementGroup } from '../element-group/group.js'

import 'https://cdn.jsdelivr.net/npm/d3@6.6.0/dist/d3.min.js'

import { FlowElement } from './flow-element.js'

import FlowUtility from './lib/flowutility.js';






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

            width: 100%;
            height: 100%;
            background: #27282c;
            color: cornflowerblue;

            transform-style: preserve-3d;
            overflow:hidden;            
            position: relative;
            bbox-shadow: 0px 0px 7px 2px cornflowerblue;
            bborder-radius: 0.5rem;
        } 
        :host::-webkit-scrollbar {
            width: 0.6rem;
        }
        :host::-webkit-scrollbar-thumb {
            background: #2f606a;
            bborder-radius: 0.5rem;
        }
        :host::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px #27282c;
            bborder-radius: 0.5rem;
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
        
        
        

        `

    }
    get HTML() {
        return `
            <slot>
                <svg></svg>
            </slot>
        `
    }
    isOverflown() {
        return this.scrollHeight > this.clientHeight || this.scrollWidth > this.clientWidth;
    }
    attachEventHandlers() {
        FlowUtility.subscribeResize(this, this.handleResizeListner.bind(this))
        window.addEventListener("resize", this.handleResizeListner)
        document.addEventListener("keydown", this.handleKeyPressListner)

        

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
            detail: { value: event.target.value ,bubble:true}//send DesignElement Instance
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
                detail: { value: this.value,bubble:true }
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

export { Flow };
