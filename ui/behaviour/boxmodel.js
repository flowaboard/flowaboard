import { Behaviour } from "./behaviour.js";

class BoxModel extends Behaviour {

    constructor() {
        super()
    }
    width;
    height;
    border = {
        top:null,
        left:null,
        right:null,
        bottom:null
    };
    margin = {
        top:null,
        left:null,
        right:null,
        bottom:null
    }
    padding = {
        top:null,
        left:null,
        right:null,
        bottom:null
    }
    box_shadow;


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
            padding:2rem;
            margin:2rem;
            border:2px solid black;
            outline:2px solid blue;
            width:100%;
            height:100%;
        }
        `
    }
    toJSON(){
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