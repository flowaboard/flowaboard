import { ElementGroup } from "../element-group/group.js";
import { Flow } from "../flow/flow.js";
import { FlowDesigns } from "../../flowdesign/design.js";
import BoardActions from "./boardActions.js";

class Board extends ElementGroup {
    debug =true;
    flowValues = []
    get CSS() {
        return `
        :host{
            position: relative;
        }
        ui-board-actions{
            position: absolute;
            bottom: 1rem;
            right: 1rem;
        }
        `

    }
    get HTML() {
        return `
            <slot>
                <ui-flow></ui-flow>
            </slot>
            <slot name="actions" class="slot-actions">
                <ui-board-actions></ui-board-actions>
            </slot>
        `
    }
    isOverflown() {
        return this.scrollHeight > this.clientHeight || this.scrollWidth > this.clientWidth;
    }

    attachEventHandlers(){        
        let flow = this.shadowRoot.querySelector(Flow.tag)
        flow.addEventListener('openflow', async (e) => {
            this.debugger.log('openflow',e)
            this.setupFlow(e.detail.value)  

        })
        flow.addEventListener('closeflow', async (e) => {
            this.debugger.log('closeflow',e.detail.value)
            let currentflow = this.flowValues.pop()
            this.debugger.log('closeflow',currentflow==e.detail.value)
            //Optimize below code to setupFlow
            let flow = this.shadowRoot.querySelector(Flow.tag)
            flow.value = this.flowValues[this.flowValues.length-1]
            this.addActions(flow.value)

        })
        flow.subscribe('change', (e) => {
            this.debugger.log('flow change', e.detail.value)
            flow.update(e)
        })
        let boardActions = this.shadowRoot.querySelector(BoardActions.tag)
        boardActions.addEventListener('flowaction',async (e) => {
            let action = e.deatil
            switch (action) {
                case 'close':  
                    this.shadowRoot.querySelector(Flow.tag).handleClose()                 
                    break;            
                default:
                    this.shadowRoot.querySelector(Flow.tag).value.actions.find(v=>v.id==action).handler()
                    break;
            }

        })
    }

    afterRender(){
        this.setupFlow(this.value)  
              
    }

    async setupFlow(designElement){
        let flow = this.shadowRoot.querySelector(Flow.tag)
        flow.value = await designElement.toDesign()
        this.flowValues.push(flow.value) 
        this.addActions(flow.value)
    }
    async addActions(design){
        let boardActions = this.shadowRoot.querySelector(BoardActions.tag)
        boardActions.innerHTML = '';

        [...design.getFlowActions(), {icon: "fas fa-times", id: 'close' }].forEach(action => {
            let button = document.createElement('button')
            button.classList.add('button')
            button.innerHTML = `${action.icon?'<i class="fas fa-times"></i>':''} ${action.label?'<span class="label">'+action.label+'</span>':''}`
            button.setAttribute('data-action-id',action.id)
            button.onclick = ()=>this.handleAction(button)
            button.action = action
            boardActions.appendChild(button) 

        });
        
        
    }
    handleAction(button){
        let flow = this.shadowRoot.querySelector(Flow.tag)
        let actionId = button.action.id
        switch (actionId) {
            case 'close':
                let flow = this.shadowRoot.querySelector(Flow.tag)
                flow.handleClose()
                break;        
            default:
                button.action.handler.call(flow.value,flow,button.action.id)
                break;
        }
       
    }

    static tag = 'ui-board';

}
ElementGroup.register(Board.tag, Board);
export default Board