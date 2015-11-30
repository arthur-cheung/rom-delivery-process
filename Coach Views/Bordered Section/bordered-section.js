var BorderedSection = (function(){
    // Utilities
    function forEach(list, callback){
        function isNodeList(nodes) {
            var stringRepr = Object.prototype.toString.call(nodes);

            return typeof nodes === 'object' &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr);
        }

        if(Object.prototype.toString.call(list) === '[object Array]'){
            for(var i = 0; !!list && i < list.length; i++){
                callback(list[i], i);
            }
        }
        else if(typeof list == 'object'){
            var isNodeList = isNodeList(list);

            for(var i in list){
                if(!isNodeList || (isNodeList && i != 'length' && i != 'item')){
                    callback(list[i], i);
                }
            }
        }
    }
    var log = {
        app: 'BorderedSection',
        level: 'all',
        setLogLevel: function(level){
            this.level = level;
        },
        error: function(message){
            if(['error', 'warning', 'info', 'all'].indexOf(this.level) != -1){
                if(typeof message == 'object'){
                    message = JSON.stringify(message);
                }
                console.error(this.app + ' => ' + message);
            }
        },
        info: function(message){
            if(['info', 'all'].indexOf(this.level) != -1){
                if(typeof message == 'object'){
                    message = JSON.stringify(message);
                }
                console.info(this.app + ' => ' + message);
            }
        },
        warning: function(message){
            if(['warning', 'info', 'all'].indexOf(this.level) != -1){
                if(typeof message == 'object'){
                    message = JSON.stringify(message);
                }
                console.warn(this.app + ' => ' + message);
            }
        }
    }
    var handlers = [];
    var widgets = [];
    var bindings = [];

    // Put your code into the functions below as you would within the coach view.
    // Within the actual coach view, bring in the AMD Dependencies for dojo/_base/lang.
    // Call lang.hitch on the the respective function
    // E.g. in the inline javascript section paste the following to link the load functions:
    // this.load = lang.hitch(this, CoachView.load);

    return {
        load: function(){
            var element = this.context.element;
            var header = element.querySelector('.borderedSectionHeader');
            header.innerText = this.context.options._metadata.label.get('value');
        },
        unload: function(){
            for(var i = 0; handlers && i < handlers.length; i++){
                handlers[i].remove && handlers[i].remove();
            }
        },
        view: function(){

        },
        change: function(event){

        },
        collaboration: function(event){

        },
        validateFields: function(event){

        }
    };
})();