
import { Design, DesignElement, FlowDesigns } from './flowdesign/design.js';



import Debugger from './lib/debugger.js';
import Board from './ui/board/board.js';
import { Flow } from './ui/flow/flow.js'

class FlowAboard {
    skipWindowHistory = true;
    debugger = new Debugger(true, 'FlowAboard')
    parent = document.body;
    graph = new WeakMap();
    pushState(present, future, skipWindowHistory) {
        if (future instanceof FlowDesigns.ListDesign && !skipWindowHistory) {
            window.history.pushState({}, future.label, (location.pathname == '/' ? '' : location.pathname) + "/" + future.id)
        }
        this.graph.set(future, present)
    }
    popState(present, skipWindowHistory) {
        let past = this.graph.get(present)
        if (present instanceof FlowDesigns.ListDesign && past && !skipWindowHistory) {
            window.history.back()
        }

        return past;
    }
    historyListener(e) {
        let currentDesign = this.getCurrentDesign()
        let parentdesign = this.popState(currentDesign, this.skipWindowHistory)
        if (parentdesign) {
            this.load(parentdesign)

        } else {
            e.preventDefault()
        }
    }
    constructor(parent) {
        this.parent = parent;
        //window.addEventListener('popstate', (e)=>this.historyListener(e));
    }
    async load(designElement) {
        try {

            this.board = await this.getBoardUI(designElement);                
            this.board.value = designElement
            return this.board
        } catch (error) {
            this.debugger.error(error)
        }

    }
    async getBoardUI(designElement) {

        let board = this.parent.querySelector(Board.tag)
        if (board) {
            return board
        }
        this.board = Board.getNewInstance();       

        return this.board;
    }
}

export default FlowAboard;