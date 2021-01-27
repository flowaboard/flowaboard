import { Behaviour } from "./behaviour.js";

class Resizable extends Behaviour {

    constructor() {
        super()
    }
    
    setAttribute(){
        this.host.setAttribute('resizable','true')
    }
    afterRender(){
        this.makeResizable(this.host)
    }
    get HTML() {
        return `
        <div class='resizers'>
            <div class='resizer top-left'></div>
            <div class='resizer top-right'></div>
            <div class='resizer bottom-left'></div>
            <div class='resizer bottom-right'></div>
        </div>
        `
    }
    get CSS() {
        return `
         :host {
             position: relative;
             overflow: visible;
         }
         :host .resizers{
            width: 100%;
            height: 100%;
            border: 3px solid #4286f4;
            box-sizing: border-box;
            position: absolute;
            top: 0;
          }
          
          :host .resizers .resizer{
            width: 10px;
            height: 10px;
            border-radius: 50%; /*magic to turn square into circle*/
            background: white;
            border: 3px solid #4286f4;
            position: absolute;
          }
          
          :host .resizers .resizer.top-left {
            left: -15px;
            top: -15px;
            cursor: nwse-resize; /*resizer cursor*/
          }
          :host .resizers .resizer.top-right {
            right: -15px;
            top: -15px;
            cursor: nesw-resize;
          }
          :host .resizers .resizer.bottom-left {
            left: -15px;
            bottom: -15px;
            cursor: nesw-resize;
          }
          :host .resizers .resizer.bottom-right {
            right: -15px;
            bottom: -15px;
            cursor: nwse-resize;
          }
        `
    }
    makeResizable(element) {
        const resizers = element.shadowRoot.querySelectorAll('.resizer')
        const minimum_size = 20;
        let original_width = 0;
        let original_height = 0;
        let original_x = 0;
        let original_y = 0;
        let original_mouse_x = 0;
        let original_mouse_y = 0;
        for (let i = 0; i < resizers.length; i++) {
            const currentResizer = resizers[i];
            currentResizer.addEventListener('mousedown', function (e) {
                e.preventDefault()
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_y = element.getBoundingClientRect().top;
                original_mouse_x = e.pageX;
                original_mouse_y = e.pageY;
                window.addEventListener('mousemove', resize)
                window.addEventListener('mouseup', stopResize)
            })

            function resize(e) {
                if (currentResizer.classList.contains('bottom-right')) {
                    const width = original_width + (e.pageX - original_mouse_x);
                    const height = original_height + (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                        element.style.width = width + 'px'
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px'
                    }
                }
                else if (currentResizer.classList.contains('bottom-left')) {
                    const height = original_height + (e.pageY - original_mouse_y)
                    const width = original_width - (e.pageX - original_mouse_x)
                    if (height > minimum_size) {
                        element.style.height = height + 'px'
                    }
                    if (width > minimum_size) {
                        element.style.width = width + 'px'
                        //element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                    }
                }
                else if (currentResizer.classList.contains('top-right')) {
                    const width = original_width + (e.pageX - original_mouse_x)
                    const height = original_height - (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                        element.style.width = width + 'px'
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px'
                        //element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                    }
                }
                else {
                    const width = original_width - (e.pageX - original_mouse_x)
                    const height = original_height - (e.pageY - original_mouse_y)
                    if (width > minimum_size) {
                        element.style.width = width + 'px'
                        //element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                    }
                    if (height > minimum_size) {
                        element.style.height = height + 'px'
                        //element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                    }
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize)
            }
        }
    }
}
export { Resizable };