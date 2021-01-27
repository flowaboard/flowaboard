import { Behaviour } from "./behaviour.js";

class Draggable extends Behaviour {

    constructor() {
        super()
    }
    setAttribute() {
        this.host.setAttribute('draggable', 'true')
        this.dragElement(this.host)
    }
    get CSS() {
        return `
        :host{
            position:relative;
            cursor: move;
        }
        :host *{
            cursor: move;
        }
        `
    }
    dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            const parentBoundingClientRect=elmnt.parentNode.getBoundingClientRect()
            const left=elmnt.offsetLeft - pos1
            const top=elmnt.offsetTop - pos2
            if(left<parentBoundingClientRect.left+parentBoundingClientRect.width-elmnt.clientWidth
                && left>parentBoundingClientRect.left
                && top<parentBoundingClientRect.top+parentBoundingClientRect.height
                && top>parentBoundingClientRect.top
                ){
                elmnt.style.top = top + "px";
                elmnt.style.left = left + "px";
            }
            
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }


}
export { Draggable };