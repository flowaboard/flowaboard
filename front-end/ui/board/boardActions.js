import { ElementGroup } from "../element-group/group.js";

class BoardActions extends ElementGroup {

    get CSS() {
        return `
        ::slotted(.button) {
            background-color: #394753;
            border: none;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            border-radius: 4px;
            color: #1a73e8;
            box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);        
            pointer-events: auto;
            text-transform: none;
            text-decoration: none;
            
            -webkit-transition: -webkit-transform .3s ease-in-out;
            transition: -webkit-transform .3s ease-in-out;
            transition: transform .3s ease-in-out;
            transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
            -webkit-transform: scale(1);
            transform: scale(1);

            line-height: 1rem;
            margin: 0.5rem 0.2rem;
            padding: 0.5rem 1rem;
        }
        .slot-actions{
            position:absolute;
            display: block;
            bottom: 0;
            width: 100%;
        }

        .actions .button.hover-visible {
            width: 0;
            padding: 0;
            margin: 0;
            overflow:hidden;
        }
        .actions:hover .button.hover-visible {
            width: auto;
            margin: 0.5rem 0.2rem;
            padding: 0.5rem 1rem;
        }
        .actions{
            position: sticky;
            bottom: 0;
            right: 0;
            display: flex;
            justify-content: flex-end;
            z-index: 1000;
            flex: auto;
            flex-direction: row;
            align-content: space-around;
            align-items: stretch;
        }
        @media screen and (min-width: 480px) {
            .actions{
                
            }
            .button{

            }
        }

        @media screen and (min-width: 480px) {
            .actions{
                
            }
        }

        :host(.flex) .actions{
            
        }
        .bbutton:not(:hover) {
            display: none;
        }
        .actions:hover + .hide {
            display: block;
        }
        `

    }
    get HTML() {
        return `
            <div class="actions">
                <slot>                       
                    
                </slot>
            </div>
        `
    }
    static tag = 'ui-board-actions';

}
ElementGroup.register(BoardActions.tag, BoardActions);
export default BoardActions