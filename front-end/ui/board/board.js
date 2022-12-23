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
        
        :host(.full-window){
            position: fixed;
            width: 100% !important;
            height: 100% !important;
            top: 0;
            left: 0;
        }
        `

    }
    get HTML() {
        return `
            <slot>
                <ui-flow></ui-flow>
            </slot>
            <slot name="actions" class="slot-actions">
                <ui-board-actions location="top-right"></ui-board-actions>
                <ui-board-actions location="bottom-right"></ui-board-actions>
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
    getBoardActions(location){
        let boardActions = this.shadowRoot.querySelector(BoardActions.tag+'[location="'+location+'"]')
        boardActions.innerHTML = '';
        return boardActions
    }

    async addActions(design){
        let bottomRightBAs = this.getBoardActions('bottom-right');
        let topRightBAs = this.getBoardActions('top-right');

        [...design.getFlowActions(),
            { icon: "fas fa-times", id: 'close' },
            { icon: "fas fa-arrows-alt", id: 'full-window',location:'top-right' },
        ].forEach(action => {
            let button = document.createElement('button')
            button.classList.add('button')
            button.innerHTML = `${action.icon?'<i class="'+action.icon+'"></i>':''} ${action.label?'<span class="label">'+action.label+'</span>':''}`
            button.setAttribute('data-action-id',action.id)
            button.onclick = ()=>this.handleAction(button)
            button.action = action
            
            switch (action.location) {
                case 'top-right':
                    topRightBAs.appendChild(button) 
                    break;
            
                default:
                    bottomRightBAs.appendChild(button) 
                    break;
            }
           

        });
        
        
    }
    handleAction(button){
        let flow = this.shadowRoot.querySelector(Flow.tag)
        let actionId = button.action.id
        switch (actionId) {
            case 'close':
                flow.handleClose()
                break; 
            case 'full-window':
                this.classList.toggle('full-window')
                break;
            case 'full-screen':
                this.classList.toggle('full-screen')
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