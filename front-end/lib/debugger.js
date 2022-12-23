var Debugger = function (gState,prefix) {

    var debug = {}

    if (gState) {
        for (var m in console)
            if (typeof console[m] == 'function')
                debug[m] = console[m].bind(window.console, '%c'+ prefix + "", 'color: green')
    } else {
        for (var m in console)
            if (typeof console[m] == 'function')
                debug[m] = function () { }
    }
    return debug
}
Debugger.debugs = {}
export default Debugger