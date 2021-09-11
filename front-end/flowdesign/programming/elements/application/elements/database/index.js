import DatabaseDesign,{DatabaseStorage,DatabaseHandler,DatabaseAction,DatabaseResult} from "./design/db.js";

var dbDesign = new DatabaseDesign('Database', 'db', `https://en.wikipedia.org/wiki/Artificial_intelligence`);
dbDesign.addProcess(new DatabaseHandler('DatabaseHandler','handler',''))
dbDesign.addInput(new DatabaseStorage('Storage','input','',['handler']))
dbDesign.addOutput(new DatabaseAction('Action','action','',['handler']))
dbDesign.addOutput(new DatabaseResult('Result','Result','',['handler']))

export default dbDesign;



