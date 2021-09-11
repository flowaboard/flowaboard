import AIDesign,{AIInput,AIModel,AIOuput} from "./design/ai.js";

var aiDesign = new AIDesign('Artificial Intelligence', 'ai', `https://en.wikipedia.org/wiki/Artificial_intelligence`);
aiDesign.addProcess(new AIModel('Model','model',''))
aiDesign.addInput(new AIInput('Input','input','',['model']))
aiDesign.addOutput(new AIOuput('Output','output','',['model']))

export default aiDesign;



