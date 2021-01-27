import { Behaviour } from "./behaviour.js";

class BoxModel extends Behaviour {

    constructor() {
        super()
    }
    width;
    height;
    border; 
    "border-top";
    "border-left";
    "border-right";
    "border-bottom";
    margin;
    "margin-top";
    "margin-left";
    "margin-right";
    "margin-bottom";
    padding;
    "padding-top";
    "padding-left";
    "padding-right";
    "padding-bottom";
    
    "box-shadow";


    afterRender() {
        // const resizeObserver = new ResizeObserver(entries => {
        //     for (let entry of entries) {
        //         if (entry.contentBoxSize) {
        //             console.log(entry.target.style)
        //         } else {
        //             console.log(entry.target.style)
        //         }
        //     }
        // });

        //resizeObserver.observe(this.host);
    }
    get CSS() {
        
        return `
        :host{
            ${this.getOwnPropertyNames().filter(p=>this[p]&&p!='host').map(p=>`${p}:`+this[p]+';').join('\n')}
        }
        `
    }
    get HTML(){
        return `
        `
    }
    toJSON(){
        //window.getComputedStyle(txt, null).getPropertyValue('padding-left')
        return {
            padding:this.padding,
            margin:this.margin,
            border:this.border,
            outline:this.outline,
            width:this.width,
            height:this.height
        }
    }

}
export { BoxModel };