import {ElementGroup} from '../element-group/group.js'
import '../../node_modules/d3/dist/d3.js'
//import '../../node_modules/d3-3d/src/3d.js'



class Flow extends ElementGroup{
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
        @keyframes rotation-right {
            from {
                    transform: rotate3d(0,1,0,0deg);
            }
            to { 
                    transform: rotate3d(0,1,0,-90deg);                    
                    top:50%;
                    left:50%;
            }
        }
        svg{
            animation-fill-mode: forwards;
            animation: rotation-right 4s infinite  linear;
        }
        .flowElement{
            border-radius: 4px;
            border: 2px solid #0c9ebf;
            position:absolute;
        }
        @keyframes rotation-process {
            from {
                    transform: rotate3d(0,1,0,0deg);
            }
            to { 
                    transform: rotate3d(0,1,0,90deg) rotate3d(0, 1, 0, -90deg) translateZ(200px) perspective(600px) translateX(-50%) translateY(-50%);
                    
                    top:50%;
                    left:50%;
            }
        }
        .flowElement.process{
            animation-fill-mode: forwards;
            animation: rotation-process 4s infinite  linear;
        }
        @keyframes rotation-input {
            from {
                    transform: rotate3d(0,1,0,0deg);
            }
            to { 
                    transform: rotate3d(0,1,0,0deg) translateZ(400px) rotate3d(0, 1, 0, 0deg) perspective(600px) translateX(-50%) translateY(-50%);
                    
                    top:50%;
                    left:50%;
            }
        }
        .flowElement.input{
            animation-fill-mode: forwards;
            animation: rotation-input 4s infinite  linear;
        }
        @keyframes rotation-output {
            from {
                    transform: rotate3d(0,1,0,0deg);
            }
            to { 
                    transform: rotate3d(0,1,0,-90deg) translateZ(0) rotate3d(0, 1, 0, 90deg) translateX(-50%) translateY(-50%);
                    
                    top:50%;
                    left:50%;                   
                    
            }
        }
        
        .flowElement.output{
            animation-fill-mode: forwards;
            animation: rotation-output 4s infinite  linear;
        }
        

        .flowElement.active>span{
            margin: 0;
            margin-top: 4rem;
            margin-bottom: 5rem;
            overflow: hidden;
        }
        
        .flowElement>span>div {
            height: 100%;
            display:flex;
            justify-content: center;
            align-items: center;
            text-transform: capitalize;
            cursor: pointer;
            transition: all 0.5s;
        }
        .flowElement>span>div:hover {
            transform: scale(1.2);
        }
        
        .flowElement:not(.active):hover {
            -webkit-filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5));
            filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))
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
            border-radius: 16px;
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
                    <button class="button">Add</button>
                    <button class="button" id="close"><i class="fas fa-times"></i></button>
                </div>
            </slot>
        `
    }
    attachEventHandlers(){
        document.body.onresize = this.handleSVGResize.bind(this)
        this.shadowRoot.querySelector('#close').onclick = this.handleClose.bind(this);
    }
    afterRender(){
        if(this.value){
            if(!this._svg)
            this.createSVG()
            this.updateSVG()
        }
    }

    handleClose(){
        this.setInActiveflowElementBody(this._activeForeignObject)
    }
    myObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
          console.log('width', entry.contentRect.width);
          console.log('height', entry.contentRect.height);
          console.log('x',entry.contentRect.top)
          console.log('y',entry.contentRect.bottom)
        });
    });
      
    
    createSVG() {
        var svg = d3.select(this.shadowRoot.querySelector('svg'))
            //.append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")

        svg.append("svg:defs").append("svg:marker")
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

        svg.append("svg:defs").append("svg:marker")
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

        this._svg = svg
    }

    updateSVG() {
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





        this.value.outputs.forEach((output, i) => {
            output.flowElement = output.flowElement || this.createForiegnObject(output, flowElementWidth, flowElementHeight, 'output')
            //output.flowElement.style("transform", "translate(" + outputx + "," + ((i + 1) * outputyoffset - flowElementHeight / 2) + ")")
            output.flowElement.style("left",outputx+'%')
            output.flowElement.style("top",((i + 1) * outputyoffset - flowElementHeight / 2)/height*100+'%')
            output.flowElement.node().value=output
            output.flowElement.style("width", flowElementWidth)
            output.flowElement.style("height", flowElementHeight)
            this.myObserver.observe(output.flowElement.node());
        });
        this.value.processes.forEach((process, i) => {
            process.flowElement = process.flowElement || this.createForiegnObject(process, flowElementWidth, flowElementHeight, 'process')
            //process.flowElement.style("transform", "translate(" + processx + "," + ((i + 1) * processoryoffset - flowElementHeight / 2) + ")")
            process.flowElement.style("left",processx+'%')
            process.flowElement.style("top",((i + 1) * processoryoffset - flowElementHeight / 2)/height*100+'%')
            Array.from([...process.outputIdentifiers]).forEach(outputIdentifier => {
                var destinationFU = this.value._outputMap[outputIdentifier]
                if (destinationFU) {
                    var link = this.value._linkMap[process.uniqueIdentifier + "->" + outputIdentifier] || this.createLink()
                    var x1 = process.flowElement.node().getBoundingClientRect().x
                    var y1 = process.flowElement.node().getBoundingClientRect().y
                    var x2 = destinationFU.flowElement.node().getBoundingClientRect().x
                    var y2 = destinationFU.flowElement.node().getBoundingClientRect().y
                    this.updateLink(link, x1, y1, x2, y2, flowElementWidth, flowElementHeight)
                    this.value._linkMap[process.uniqueIdentifier + "->" + outputIdentifier] = link
                }
            })
            process.flowElement.node().value=process
            process.flowElement.style("width", flowElementWidth)
            process.flowElement.style("height", flowElementHeight)
            this.myObserver.observe(process.flowElement.node());


        });
        this.value.inputs.forEach((input, i) => {
            input.flowElement = input.flowElement || this.createForiegnObject(input, flowElementWidth, flowElementHeight, 'input')
            //input.flowElement.style("transform", "translate(" + inputx + "," + ((i + 1) * inputyoffset - flowElementHeight / 2) + ")")
            input.flowElement.style("left",inputx+'%')
            input.flowElement.style("top",((i + 1) * inputyoffset - flowElementHeight / 2)/height*100+'%')
            Array.from([...input.processIdentifiers]).forEach(processIdentifier => {
                var destinationFU = this.value._processMap[processIdentifier]
                if (destinationFU) {
                    var link = this.value._linkMap[input.uniqueIdentifier + "->" + processIdentifier] || this.createLink()
                    var x1 = input.flowElement.node().getBoundingClientRect().x
                    var y1 = input.flowElement.node().getBoundingClientRect().y
                    var x2 = destinationFU.flowElement.node().getBoundingClientRect().x
                    var y2 = destinationFU.flowElement.node().getBoundingClientRect().y
                    this.updateLink(link, x1, y1, x2, y2, flowElementWidth, flowElementHeight)
                    this.value._linkMap[input.uniqueIdentifier + "->" + processIdentifier] = link
                }
            })
            input.flowElement.node().value=input
            input.flowElement.style("width", flowElementWidth)
            input.flowElement.style("height", flowElementHeight)
            this.myObserver.observe(input.flowElement.node());
        });




    }
    handleSVGResize() {
        if(this._activeForeignObject){
            this._updateActiveForeignObject()
        }else{            
            this.updateSVG()
        }
    }
    createForiegnObject(functionUnit, width, height, functionUnitClass) {
        
        var flowElement = d3.select(this.shadowRoot.querySelector('slot')).append("div")
            .attr("class", "flowElement "+functionUnitClass + " " + functionUnit.uniqueIdentifier)
            .style("width", width)
            .style("height", height)
            .style("transform-origin", width/2+" 0");
        flowElement.node().classList.add("flowElement");
        flowElement.append("span")
            .append("div")
            .text(functionUnit.label)

        this.addForeignObjectEvents(flowElement)
        return flowElement
    }
    setActiveflowElementBody(flowElement){
        flowElement.node().classList.add("active");
        d3.select(this.shadowRoot.querySelector('slot')).selectAll(".flowElement:not(.active)").style("opacity", 0);
        this._svg.selectAll("line").style("opacity", 0);

        const content=flowElement.node().value.getUi()
        flowElement.node().querySelector('span').replaceChild(content,flowElement.node().querySelector('span>div'))
        
        this._activeForeignObject=flowElement 


    }
    _updateActiveForeignObject(){
        this._svg.attr("viewBox", `0 0 ${this.clientWidth} ${this.clientHeight}`)
        this._activeForeignObject.transition()
                .duration(500)
                .style("width", this.clientWidth)
                .style("height", this.clientHeight)
                //.style("transform", "translate(0,0)")
                .style("top", "0%")
                .style("left", "0%")
    }
    setInActiveflowElementBody(flowElement){
        flowElement.node().classList.remove("active");
        d3.select(this.shadowRoot.querySelector('slot')).selectAll("flowElement:not(.active)").style("opacity", 1);
        this._svg.selectAll("line").style("opacity", 1);

        const content=document.createElement("div")
        flowElement.node().querySelector('span').replaceChild(content,flowElement.node().querySelector('span').firstChild)  
        d3.select(content).text(flowElement.node().value.label)
        this.addForeignObjectEvents(flowElement)
        this._activeForeignObject=null
        this.updateSVG()      

    }
    addForeignObjectEvents(flowElement){
        var self=this
        flowElement.on("mouseover", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .style("transform", "scale(1.05,1.05)")
                
            //console.log('mouseover',this.getAttribute('transform'))
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .style("transform", d3.select(this).style('transform').replace(/scale\(.*\)/, ""))

            //console.log('mouseout',this.getAttribute('transform'))

        })
        .on("mousedown",function (d, i) {
            d3.select(this).on("mouseover",null)
            d3.select(this).on("mouseout",null)
            d3.select(this).on("mousedown",null)
            d3.select(this)
                .transition()
                .duration(500)
                .style("width", self.clientWidth+'px')
                .style("height", self.clientHeight+'px')
                .style("top", "0px")
                .style("left", "0px")
                .style("transform", d3.select(this).style('transform').replace(/scale\(.*\)/, "scale(1,1)"))
            //this.classList.add('rotate-animation')
            
            self.setActiveflowElementBody(d3.select(this))
        });
    }
    createLink() {
        var line = this._svg.append("line")
            .style("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#triangle-outline)")

        return line;
    }
    updateLink(link, x1, y1, x2, y2, flowElementWidth, flowElementHeight) {
        link
            .attr("x1", x1 + flowElementWidth)
            .attr("y1", y1 + flowElementHeight / 2)
            .attr("x2", x2-8)
            .attr("y2", (y2 + flowElementHeight / 2))

    }
    static getSample(){
        const listElement=document.createElement(ElementGroup.elementRegistry[this])
        listElement.value=['Item 1','Item 2','Item 3']
        return listElement
    }  
    
}
ElementGroup.register('ui-flow', Flow);
export { Flow };