
import * as alaSQLSpace from './node_modules/alasql/dist/alasql.js';
import * as architecture from './data/architecture/architecture.js';

import * as ui from '../../ui/export.js'
import { Flow } from './ui/builder/flow.js'
import { UI } from './data/architecture/ui.js'
import { Database } from './data/architecture/database.js'

var design = new architecture.Design()
design.addProcess(new architecture.Process('js','process','process',['ui'],['database']))
design.addOutput(new architecture.Output('outbound.rest','Outbound','outbound.rest',['process']))
const flow = document.createElement('ui-flow')
document.body.appendChild(flow)
flow.value=design;







//design.addInput(new architecture.Input('Inbound','Inbound','json',['process']))