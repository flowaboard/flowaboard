import Swiper from '/swiper/js/swiper.esm.browser.bundle.js';
import {GroupBehaviour} from './group-behaviour.js'
class Swipable extends GroupBehaviour {

    constructor() {
        super()
    }
    attachEventHandlers(){
        
        var mySwiper = new Swiper('.swiper-container', { /* ... */ });
        
    }
    removeEventHandlers(){
        
    }
    get HTML() {
        return `
        <div class="swiper-container">
            <!-- Additional required wrapper -->
            <div class="swiper-wrapper">
                <!-- Slides -->
                <div class="swiper-slide">Slide 1</div>
                <div class="swiper-slide">Slide 2</div>
                <div class="swiper-slide">Slide 3</div>
                ...
            </div>
            <!-- If we need pagination -->
            <div class="swiper-pagination"></div>

            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>

            <!-- If we need scrollbar -->
            <div class="swiper-scrollbar"></div>
        </div>
        `
    }
    get CSS() {
        return `
        .swiper-container {
            width: 600px;
            height: 300px;
        }
        `
    }
}
export { Swipable };