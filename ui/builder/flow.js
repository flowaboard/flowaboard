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
            display: flex;
            height:100%;
        }
        #svg{
            width:100%;
            height: 100%;
        }
        svg{
            height: 100%;
        }
        foreignObject{
            border-radius: 4px;
            border: 2px solid #0c9ebf;
        }

        foreignObject.active body{
            margin: 0;
            margin-top: 4rem;
            margin-bottom: 5rem;
            overflow: hidden;
        }
        
        foreignObject body>div {
            height: 100%;
            display:flex;
            justify-content: center;
            align-items: center;
            text-transform: capitalize;
            cursor: pointer;
            transition: all 0.5s;
        }
        foreignObject body>div:hover {
            transform: scale(1.2);
        }
        
        foreignObject:not(.active):hover {
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
            <slot>
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
        this.setInActiveforeignObjectBody(this._activeForeignObject)
    }
    
    createSVG() {
        var svg = d3.select(this.shadowRoot.querySelector('svg'))
            //.append("svg")
            .attr("preserveAspectRatio", "xMidYMid meet")

        svg.append("svg:defs").append("svg:marker")
            .attr("id", "triangle-outline")
            .attr("refX", 6)
            .attr("refY", 6)
            .attr("markerWidth", 30)
            .attr("markerHeight", 30)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 12 6 0 12 3 6 0 0")
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
        //     this.value.inputs[0].foreignObject.attr("transform", d3.event.transform);
        // }

        this._svg = svg
    }

    updateSVG() {
        const width = this.clientWidth
        const height = this.clientHeight
        const foreignObjectWidth = this.clientWidth/6
        const foreignObjectHeight = this.clientWidth/6
        const xoffset = (width / 4)
        const inputx = 1 * xoffset - foreignObjectWidth / 2 - xoffset / 2
        const processx = 2 * xoffset - foreignObjectWidth / 2
        const outputx = 3 * xoffset - foreignObjectWidth / 2 + xoffset / 2
        const inputyoffset = (height / (this.value.inputs.length + 1))
        const processoryoffset = (height / (this.value.processes.length + 1))
        const outputyoffset = (height / (this.value.outputs.length + 1))

        var svg = this._svg
        svg.attr("viewBox", `0 0 ${width} ${height}`)





        this.value.outputs.forEach((output, i) => {
            output.foreignObject = output.foreignObject || this.createForiegnObject(output, foreignObjectWidth, foreignObjectHeight, 'output')
            output.foreignObject.attr("transform", "translate(" + outputx + "," + ((i + 1) * outputyoffset - foreignObjectHeight / 2) + ")")
            output.foreignObject.node().value=output
            output.foreignObject.attr("width", foreignObjectWidth)
            output.foreignObject.attr("height", foreignObjectHeight)
        });
        this.value.processes.forEach((process, i) => {
            process.foreignObject = process.foreignObject || this.createForiegnObject(process, foreignObjectWidth, foreignObjectHeight, 'process')
            process.foreignObject.attr("transform", "translate(" + processx + "," + ((i + 1) * processoryoffset - foreignObjectHeight / 2) + ")")
            Array.from([...process.outputIdentifiers]).forEach(outputIdentifier => {
                var destinationFU = this.value._outputMap[outputIdentifier]
                if (destinationFU) {
                    var link = this.value._linkMap[process.uniqueIdentifier + "->" + outputIdentifier] || this.createLink()
                    var x1 = process.foreignObject.node().getBoundingClientRect().x
                    var y1 = process.foreignObject.node().getBoundingClientRect().y
                    var x2 = destinationFU.foreignObject.node().getBoundingClientRect().x
                    var y2 = destinationFU.foreignObject.node().getBoundingClientRect().y
                    this.updateLink(link, x1, y1, x2, y2, foreignObjectWidth, foreignObjectHeight)
                    this.value._linkMap[process.uniqueIdentifier + "->" + outputIdentifier] = link
                }
            })
            process.foreignObject.node().value=process
            process.foreignObject.attr("width", foreignObjectWidth)
            process.foreignObject.attr("height", foreignObjectHeight)

        });
        this.value.inputs.forEach((input, i) => {
            input.foreignObject = input.foreignObject || this.createForiegnObject(input, foreignObjectWidth, foreignObjectHeight, 'input')
            input.foreignObject.attr("transform", "translate(" + inputx + "," + ((i + 1) * inputyoffset - foreignObjectHeight / 2) + ")")
            Array.from([...input.processIdentifiers]).forEach(processIdentifier => {
                var destinationFU = this.value._processMap[processIdentifier]
                if (destinationFU) {
                    var link = this.value._linkMap[input.uniqueIdentifier + "->" + processIdentifier] || this.createLink()
                    var x1 = input.foreignObject.node().getBoundingClientRect().x
                    var y1 = input.foreignObject.node().getBoundingClientRect().y
                    var x2 = destinationFU.foreignObject.node().getBoundingClientRect().x
                    var y2 = destinationFU.foreignObject.node().getBoundingClientRect().y
                    this.updateLink(link, x1, y1, x2, y2, foreignObjectWidth, foreignObjectHeight)
                    this.value._linkMap[input.uniqueIdentifier + "->" + processIdentifier] = link
                }
            })
            input.foreignObject.node().value=input
            input.foreignObject.attr("width", foreignObjectWidth)
            input.foreignObject.attr("height", foreignObjectHeight)

        });




    }
    handleSVGResize() {
        this.updateSVG()
    }
    createForiegnObject(functionUnit, width, height, functionUnitClass) {
        
        var foreignObject = this._svg.append("foreignObject")
            .attr("class", functionUnitClass + " " + functionUnit.uniqueIdentifier)
            .attr("width", width)
            .attr("height", height)
            .attr("transform-origin", width/2+" 0");

        foreignObject.append("xhtml:body")
            .append("div")
            .text(functionUnit.label)

        this.addForeignObjectEvents(foreignObject)
        return foreignObject
    }
    setActiveforeignObjectBody(foreignObject){
        foreignObject.node().classList.add("active");
        this._svg.selectAll("foreignObject:not(.active)").style("opacity", 0);
        this._svg.selectAll("line").style("opacity", 0);

        const content=foreignObject.node().value.getUi()
        foreignObject.node().querySelector('body').replaceChild(content,foreignObject.node().querySelector('body>div'))
        
        this._activeForeignObject=foreignObject        

    }
    setInActiveforeignObjectBody(foreignObject){
        foreignObject.node().classList.remove("active");
        this._svg.selectAll("foreignObject:not(.active)").style("opacity", 1);
        this._svg.selectAll("line").style("opacity", 1);

        const content=document.createElement("div")
        foreignObject.node().querySelector('body').replaceChild(content,foreignObject.node().querySelector('body').firstChild)  
        d3.select(content).text(foreignObject.node().value.label)
        this.addForeignObjectEvents(foreignObject)
        this._activeForeignObject=null
        this.updateSVG()      

    }
    addForeignObjectEvents(foreignObject){
        var self=this
        foreignObject.on("mouseover", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("transform", this.getAttribute('transform') + "scale(1.05,1.05)")
                
            //console.log('mouseover',this.getAttribute('transform'))
        })
        .on("mouseout", function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("transform", this.getAttribute('transform').replace(/scale\(.*\)/, ""))

            //console.log('mouseout',this.getAttribute('transform'))

        })
        .on("mousedown",function (d, i) {
            d3.select(this)
                .transition()
                .duration(500)
                .attr("width", self.clientWidth)
                .attr("height", self.clientHeight)
                .attr("transform", "translate(0,0)")
            d3.select(this).on("mouseover",null)
            d3.select(this).on("mouseout",null)
            d3.select(this).on("mousedown",null)
            self.setActiveforeignObjectBody(d3.select(this))
        });
    }
    createLink() {
        var line = this._svg.append("line")
            .style("stroke", "black")
            .attr("stroke-width", 2)
            .attr("marker-end", "url(#triangle-outline)")

        return line;
    }
    updateLink(link, x1, y1, x2, y2, foreignObjectWidth, foreignObjectHeight) {
        link
            .attr("x1", x1 + foreignObjectWidth)
            .attr("y1", y1 + foreignObjectHeight / 2)
            .attr("x2", x2)
            .attr("y2", y2 + foreignObjectHeight / 2)

    }
    static getSample(){
        const listElement=document.createElement(ElementGroup.elementRegistry[this])
        listElement.value=['Item 1','Item 2','Item 3']
        return listElement
    }  
    
}
ElementGroup.register('ui-flow', Flow);
export { Flow };