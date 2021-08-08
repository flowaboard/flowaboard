
import { DragAndDrop } from "../group-behaviour/drag-and-drop.js";
import Element from "../element/element.js";
class DragAndDropElments extends DragAndDrop{
    dragStart(e){
        e.dataTransfer.setData("text", e.target.value.tagName);
    }
    drop(e) {
        e.preventDefault();
        var data = e.dataTransfer.getData("text");
        if(Element.elementRegistry[data]){
            Element.elementRegistry[data].getSample()
            e.target.appendChild(Element.elementRegistry[data].getSample());
            this.host.shadowRoot.querySelector('ui-root').afterRender()
        }
    }
    allowDrop(e) {
        e.preventDefault();
    }
}
export { DragAndDropElments };