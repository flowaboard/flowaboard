import { Input } from './input.js'
class FileInput extends Input {
    constructor() {
        super();
    }

    static getSample() {
        const input = document.createElement('ui-file-input')
        input.setAttribute('label', 'Label')
        return input
    }
    get CSS() {
        return `
        :host{
            display:flex;
            width: 100%;
        }
        .box
        {
            font-size: 1rem;
            position: relative;
            padding: 2rem;
            width: 100%;
            justify-content: center;
            display: flex;
        }
        .box.has-advanced-upload
        {
            outline: 2px dashed #92b0b3;
            outline-offset: -10px;

            -webkit-transition: outline-offset .15s ease-in-out, background-color .15s linear;
            transition: outline-offset .15s ease-in-out, background-color .15s linear;
        }
        .box__input
        {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        }
        .box.is-dragover
        {
            outline-offset: -20px;
            outline-color: #c8dadf;
            background-color: #fff;
        }
        .box__dragndrop,
        .box__icon
        {
            display: none;
        }
        .box.has-advanced-upload .box__dragndrop
        {
            display: inline;
        }
        .box.has-advanced-upload .box__icon
        {
            width: 100%;
            height: 80px;
            fill: #92b0b3;
            display: block;
            margin-bottom: 40px;
        }
        @-webkit-keyframes appear-from-inside
        {
            from	{ -webkit-transform: translateY( -50% ) scale( 0 ); }
            75%		{ -webkit-transform: translateY( -50% ) scale( 1.1 ); }
            to		{ -webkit-transform: translateY( -50% ) scale( 1 ); }
        }
        @keyframes appear-from-inside
        {
            from	{ transform: translateY( -50% ) scale( 0 ); }
            75%		{ transform: translateY( -50% ) scale( 1.1 ); }
            to		{ transform: translateY( -50% ) scale( 1 ); }
        }

        .box__restart
        {
            font-weight: 700;
        }
        .box__restart:focus,
        .box__restart:hover
        {
            color: #39bfd3;
        }
        .box__file
        {
            width: 0.1px;
            height: 0.1px;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            z-index: -1;
        }
        .box__file + label
        {
            max-width: 80%;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            display: inline-block;
            overflow: hidden;
        }
        .box__file + label:hover strong,
        .box__file:focus + label strong,
        .box__file.has-focus + label strong
        {
            color: #39bfd3;
        }
        .box__file:focus + label,
        .box__file.has-focus + label
        {
            outline: 1px dotted #000;
            outline: -webkit-focus-ring-color auto 5px;
        }				
        `
    }
    get HTML() {
        return `
        <slot>
        <div class="box has-advanced-upload">
            <div class="box__input">
                <svg class="box__icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
                    <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"></path>
                </svg>
                <input type="file" name="files[]" id="file" class="box__file" data-multiple-caption="{count} files selected" multiple="">
                <label for="file"><strong>Choose a file</strong><span class="box__dragndrop"> or drag it here</span>.</label>
            </div>
        </div>
        </slot>   
        `

    }
    attachEventHandlers() {
        this.shadowRoot.querySelector('input').addEventListener('change', this.handleInputChange.bind(this))
        this.shadowRoot.querySelector('input').addEventListener('keyup', this.handleInputChange.bind(this))
    }
    handleInputChange() {
        this._value = this.shadowRoot.querySelector('input').value
        const changeEvent = new CustomEvent('change', {
            bubbles: true,
            composed: true,
            detail: { value: () => this.value }
        });
        this.dispatchEvent(changeEvent)


    }

}
FileInput.register('ui-file-input', FileInput);
export { FileInput };