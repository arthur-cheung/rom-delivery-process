var ROMInformationPane = (function(){
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
    var logLevel = 'all';
    function setLogLevel(level){
        logLevel = level;
    }
    var log = {
        app: 'ROMInformationPane',
        level: 'all',
        setLogLevel: function (level) {
            this.level = level;
        },
        time: function(){
            return '[' + (new Date) + ']'
        },
        error: function (message) {
            if (['error', 'warning', 'info', 'all'].indexOf(this.level) != -1) {
                if (typeof message == 'object') {
                    message = JSON.stringify(message);
                }
                console.error(this.time() + ' ' + this.app + ' => ' + message);
            }
        },
        info: function (message) {
            if (['info', 'all'].indexOf(this.level) != -1) {
                if (typeof message == 'object') {
                    message = JSON.stringify(message);
                }
                console.info(this.time() + ' ' + this.app + ' => ' + message);
            }
        },
        warning: function (message) {
            if (['warning', 'info', 'all'].indexOf(this.level) != -1) {
                if (typeof message == 'object') {
                    message = JSON.stringify(message);
                }
                console.warn(this.time() + ' ' + this.app + ' => ' + message);
            }
        }
    }
    function getElement(_this){
        // _this is the context from the coach view
        var element = _this.context.element;
        if(!element){
            console.error('ERROR: Failed to find element in coach view.');
            return;
        }

        return element;
    }
    function getBinding(_this){
        // _this is the context from the coach view
        var binding = _this.context.binding;

        if(binding === undefined || binding === null){
            console.info('WARNING: Nothing bound to input text ' + _this.context.viewid);
            return {get: function(){return '';}, set: function(){return '';}};   // Safe guard when .get('value') is called
        }

        return binding;
    }
    function isLabelVisible(_this){
        return _this.context.options._metadata.labelVisibility;
    }
    function getQuerySelector(_this){
        if(!!_this && !!_this.context.element && !!_this.context.element.querySelector){
            return _this.context.element.querySelector.bind(_this.context.element);
        }
        return document.querySelector;
    }
    var handlers = [];
    var widgets = [];
    var bindings = [];

    // Put your code into the functions below as you would within the coach view.
    // Within the actual coach view, bring in the AMD Dependencies for dojo/_base/lang.
    // Call lang.hitch on the the respective function
    // E.g. in the inline javascript section paste the following to link the load functions:
    // this.load = lang.hitch(this, InformationPane.load);

    function addClass(node, deltaClass){
        if(!node){
            log.error('ERROR: No node provided. Cannot add class, aborting.');
            return;
        }
        var start = /(\s+|^)/;
        var end = /(\s+|$)/;
        var regExp = (new RegExp(start.source + deltaClass + end.source, 'g'));

        if(!regExp.test(node.className)){
            node.className += ' ' + deltaClass;
        }
    }
    function removeClass(node, deltaClass){
        if(!node){
            log.error('ERROR: No node provided. Cannot add class, aborting.');
            return;
        }
        var start = /(\s+|^)/;
        var end = /(\s+|$)/;
        var regExp = (new RegExp(start.source + deltaClass + end.source, 'g'));
        node.className = node.className.replace(regExp, ' ').trim();
    }

    var currentStatus, element;
    function initialiseVariables(){
        currentStatus = 'info';
        element = this.context.element;
    }
    function show(message, options){
        var node = element.querySelector('.informationPane');
        var status = (!!options && options.status) || 'info';
        removeClass(node, currentStatus);
        currentStatus = status;
        if(!!status){
            addClass(node, status);
        }

        node.innerHTML = message;
        removeClass(node, 'hidden');
    }
    function hide(){
        var node = element.querySelector('.informationPane');
        removeClass(node, currentStatus);

        node.innerHTML = '';
        addClass(node, 'hidden');
    }

    return {
        show: show,
        hide: hide,
        load: function(){
            initialiseVariables.call(this)
            var status = (this.context.options.status && this.context.options.status.get('value')) || 'info';
            show(this.context.options._metadata.label.get('value'), {status: status})
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