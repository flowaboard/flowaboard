export default class Utility {
    static match(text,regexString){
        var regex = new RegExp(regexString);
        return typeof text=="string" && text.match(regex) 
    }
    static isURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return typeof id=="string" && id.match(regex)
    }
    static isJSURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?\.js$/gi;
        var regex = new RegExp(expression);
        return typeof id=="string" && id.match(regex)
    }
    static isFlowURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?\.flow$/gi;
        var regex = new RegExp(expression);
        return typeof id=="string" && id.match(regex)
    }
    static isJSUrlPath(id) {
        var expression = /(\/)+(.*).js$/gi;
        var regex = new RegExp(expression);
        return typeof id=="string" && id.match(regex)
    }
    static isFlowUrlPath(id) {
        var expression = /(\/)+(.*).flow$/gi;
        var regex = new RegExp(expression);
        return typeof id=="string" && id.match(regex)
    }
    static getUrlPath(id) {
        var urlRegex = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/ig;
        var urlInfo = urlRegex.exec(id)
        return urlInfo[3]
    }
    static getUrlFileName(id) {
        return /(?:[^/][\d\w\.]+)$(?<=(?:.jpg)|(?:.pdf)|(?:.gif)|(?:.jpeg)|(more_extension))/.exec(id)
    }
}