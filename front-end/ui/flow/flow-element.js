import Element from '../element/element.js'
import FlowUtility from './lib/flowutility.js';

class FlowElement extends Element {

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
        

        // this.shadowRoot.querySelector('.add-previous').onclick = this.handleAdd.bind(this);
        // this.shadowRoot.querySelector('.add-next').onclick = this.handleAdd.bind(this);

        this.attachInactiveEventHandlers()

        FlowUtility.subscribeResize(this, this.handleResize.bind(this))
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

            this.debugger.log("Set Dimenions", this, x1, y1, width1, height1, link)
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
export { FlowElement };