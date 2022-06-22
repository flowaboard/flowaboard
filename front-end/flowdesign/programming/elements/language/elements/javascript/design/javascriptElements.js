import { Process, Input, Output, Step, DesignElement } from '/flowdesign/design.js';
class JSBody extends Process {
    constructor(label, id, description, design, config, inputIdentifiers, outputIdentifiers) {
        super(label, id, description, null, config, inputIdentifiers, outputIdentifiers)
        this.design = design
    }

}
class JSInput extends Input {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design = design
    }
}
class JSOutput extends Output {
    constructor(label, id, description, processIdentifiers, design, config) {
        super(label, id, description, processIdentifiers, null, config)
        this.design = design
    }
}

class JSStep extends Step {
    constructor(label, id, description, design, inputIdentifiers, outputIdentifiers,config) {
        super(label, id, description, null, config, inputIdentifiers, outputIdentifiers)
        this.design = design

    }
}

class JavascriptElement extends DesignElement {

}

export { JSStep, JSBody, JSInput, JSOutput, JavascriptElement }