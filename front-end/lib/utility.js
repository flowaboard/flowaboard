export default class Utility {
    static match(text, regexString) {
        var regex = new RegExp(regexString);
        return typeof text == "string" && text.match(regex)
    }
    static isURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        return typeof id == "string" && id.match(regex)
    }
    static isJSURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?\.js$/gi;
        var regex = new RegExp(expression);
        return typeof id == "string" && id.match(regex)
    }
    static isFlowURL(id) {
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?\.flow$/gi;
        var regex = new RegExp(expression);
        return typeof id == "string" && id.match(regex)
    }
    static isJSUrlPath(id) {
        var expression = /(\/)+(.*).js$/gi;
        var regex = new RegExp(expression);
        return typeof id == "string" && id.match(regex)
    }
    static isFlowUrlPath(id) {
        var expression = /(\/)+(.*).flow$/gi;
        var regex = new RegExp(expression);
        return typeof id == "string" && id.match(regex)
    }
    static getUrlPath(id) {
        var urlRegex = /(http[s]?:\/\/)?([^\/\s]+\/)(.*)/ig;
        var urlInfo = urlRegex.exec(id)
        return urlInfo[3]
    }
    static getUrlFileName(id) {
        return /(?:[^/][\d\w\.]+)$(?<=(?:.jpg)|(?:.pdf)|(?:.gif)|(?:.jpeg)|(more_extension))/.exec(id)
    }
    static debounce(func, wait) {
        let timeout;

        // This is the function that is returned and will be executed many times
        // We spread (...args) to capture any number of parameters we want to pass
        return function executedFunction(...args) {

            // The callback function to be executed after 
            // the debounce time has elapsed
            const later = () => {
                // null timeout to indicate the debounce ended
                timeout = null;
                // Execute the callback
                func(...args);
            };
            // This will reset the waiting every function execution.
            // This is the step that prevents the function from
            // being executed because it will never reach the 
            // inside of the previous setTimeout  
            clearTimeout(timeout);
            // Restart the debounce waiting period.
            // setTimeout returns a truthy value (it differs in web vs Node)
            timeout = setTimeout(later, wait);
        };
    };
}