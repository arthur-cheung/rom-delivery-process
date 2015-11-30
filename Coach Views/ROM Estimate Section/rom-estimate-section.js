var ROMEstimateSection = (function(){
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
        app: 'ROMEstimateSection',
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
            var binding = this.context.binding.get('value').bindAll(this.change.bind(this));
            bindings.push(binding);
        },
        unload: function(){
            for(var i = 0; handlers && i < handlers.length; i++){
                handlers[i].remove && handlers[i].remove();
            }
            for(var i = 0; bindings && i < bindings.length; i++){
                if(bindings[i] && bindings[i].unbind){
                    bindings[i].unbind();
                }
            }
        },
        view: function(){
            if(this.context.options._metadata.visibility.get('value') == 'READONLY'){    // Lock the fields if readonly.
                var element = this.context.element;
                var fields = element.querySelectorAll('input, textarea');
                forEach(fields, function forEachField(field){
                    field.readOnly = true;
                    field.parentNode.className += ' readOnly';  // Add class of readOnly to parent so that css can style
                });
            }
        },
        change: function(event){
            var estimateWithContingency = this.context.binding.get('value').get('estimateWithContingency') || 0;
            if(event.property === 'initialEstimate'){
                estimateWithContingency = (Number(event.newVal) * (1 + (Number(this.context.binding.get('value').get('contingency')))/100)).toFixed(2);
            }
            if(event.property === 'contingency'){
                estimateWithContingency = ((1 + (Number(event.newVal)/100)) * this.context.binding.get('value').get('initialEstimate')).toFixed(2);
            }
            this.context.binding.get('value').set('estimateWithContingency', estimateWithContingency);
            log.info(event);
        },
        collaboration: function(event){

        },
        validateFields: function(event){

        }
    };
})();