
import { GroupBehaviour } from "./group-behaviour.js";
class DragAndDrop extends GroupBehaviour{
    
    constructor(drageelements,dropElements) {
        super()
        this.drageelements=drageelements||[]
        this.dropElements=dropElements||[]
    }
    
    get CSS(){
        return `
        
        `
    }
    afterRender(){
        var self=this
        this.dragStratHandler=self.dragStart.bind(self)
        this.dragoverHandler=self.allowDrop.bind(self)
        this.dropHandler=self.drop.bind(self)
        this.drageelements.forEach(element => {
            element.setAttribute('draggable',"true")
            element.addEventListener('dragstart',self.dragStratHandler)
        });
        this.dropElements.forEach(element => {
            //element.setAttribute('draggable',"true")
            element.addEventListener('dragover',self.dragoverHandler)
            element.addEventListener('drop',self.dropHandler)

        });

    }
    beforeRender(){
        this.drageelements.forEach(element => {
            element.removeAttribute('draggable',"true")
            element.removeEventListener('dragstart',self.dragStratHandler)
        });
        this.dropElements.forEach(element => {
            element.removeEventListener('dragover',self.dragoverHandler)
            element.removeEventListener('drop',self.dropHandler)
        });

    }
    dragStart(e){
        var id = 'drag-'+(new Date()).getTime();
        e.target.setAttribute('dragid',id);
        e.dataTransfer.setData("dragid", id);
    }
    drop(e) {
        e.preventDefault();
        var dragId = e.dataTransfer.getData("dragid");
        if(dragId){
            const element=e.target.querySelector('[dragid~="'+dragId+'"]')
            if(element)
            e.target.appendChild(element);
        }
    }
    allowDrop(e) {
        e.preventDefault();
        if (e.target.getAttribute("draggable") == "true")
            e.dataTransfer.dropEffect = "none"; // dropping is not allowed
        else
            e.dataTransfer.dropEffect = "all"; // drop it like it's hot
    }
}
export { DragAndDrop };