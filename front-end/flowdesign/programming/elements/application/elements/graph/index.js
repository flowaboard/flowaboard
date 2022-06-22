import GraphDesign,{GraphDataInput,GraphUiInput,GraphLoader,GraphOutput} from './design/graph.js'

const graphdesign = new GraphDesign();
graphdesign.addProcess(new GraphLoader('Loader','loader','','',{}))
graphdesign.addInput(new GraphDataInput('Data','data','',['loader']))
graphdesign.addInput(new GraphUiInput('Element','element','',['loader']))
graphdesign.addOutput(new GraphOutput('Graph','graph','',['loader'],'',{}))
export default graphdesign;