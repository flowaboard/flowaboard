import { DesignElement } from './design.js'



class Database extends DesignElement {
    constructor(label, uniqueIdentifier, processIdentifiers) {
        super('Database', label, uniqueIdentifier)
        this.processIdentifiers = new Set(processIdentifiers)
    }
}

export { Database }