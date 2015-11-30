var ROMBackgroundSection = (function(){
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
        app: 'ROMBackgroundSection',
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

    function setViewMode(){
        var showCompactView = this.context.options.showCompactView.get('value');
        if(showCompactView){
            require(['dojo/query', 'dojo/NodeList-dom'], function(query){
                query('[data-viewType=extended]').addClass('hidden');
            });
        }
    }
    function setFieldVisibility(){
        var element = this.context.element;
        if(this.context.options._metadata.visibility.get('value') == 'READONLY'){    // Lock the fields if readonly.
            var fields = element.querySelectorAll('.wrapper input, .wrapper textarea, .timezoneNeutralDateWrapper .dijitDateTextBox');
            forEach(fields, function forEachField(field){
                field.readOnly = true;
                field.parentNode.className += ' readOnly';  // Add class of readOnly to parent so that css can style
            });
            require(['dijit/registry'], function(registry){
                setTimeout(function(){
                    // Slight delay as we need to give time for the dropdown widget to build
                    // Originally tried a "ready", but there are asynchronous tasks on the build of the dropdown that fire after "ready"
                    var widgets = registry.findWidgets(element);
                    forEach(widgets, function forEachWidget(widget){
                        (widget.disabled !== undefined) && (widget.disabled = true);    // If there is a disabled property on widget, set it to true
                    });
                }, 1500);
            });
        }

    }

    return {
        load: function(){

        },
        unload: function(){
            for(var i = 0; handlers && i < handlers.length; i++){
                handlers[i].remove && handlers[i].remove();
            }
        },
        view: function(){
            // If the option to see only compact / summarised view
            setViewMode.bind(this)();

            // Disable the fields, if that's what's set
            setFieldVisibility.bind(this)();
        },
        change: function(event){

        },
        collaboration: function(event){

        },
        validateFields: function(event){

        }
    };
})();