var ReworkHistorySection = (function(){
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
        app: 'ReworkHistorySection',
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
    function addClass(node, deltaClass){
        if(!node){
            console.error('ERROR: No node provided. Cannot add class, aborting.');
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
            console.error('ERROR: No node provided. Cannot add class, aborting.');
            return;
        }
        var start = /(\s+|^)/;
        var end = /(\s+|$)/;
        var regExp = (new RegExp(start.source + deltaClass + end.source, 'g'));
        node.className = node.className.replace(regExp, ' ').trim();
    }
    function hasClass(node, checkClass){
        return !!node && !!node.className && (node.className.split(' ').indexOf(checkClass) !== -1);
    }
    var handlers = [];
    var widgets = [];
    var bindings = [];

    // Put your code into the functions below as you would within the coach view.
    // Within the actual coach view, bring in the AMD Dependencies for dojo/_base/lang.
    // Call lang.hitch on the the respective function
    // E.g. in the inline javascript section paste the following to link the load functions:
    // this.load = lang.hitch(this, CoachView.load);

    var element, data, columns, tableNode;
    function initialiseVariables(){
        element = this.context.element;
        columns = [
            {"display": "Rework Step", "id": "reworkStep", "type": "text"},
            {"display": "Rework Comments", "id": "comments", "type": "text"},
            {"display": "Date", "id": "timeStamp", "type": "date", "format": "dd/MM/yyyy h:mm tt"},
            {"display": "User", "id": "actionedByUser", "type": "text"}
        ];
        data = !this.context.binding ? [] : this.context.binding.get('value').items;
        tableNode = element.querySelector('.reworkHistoryTable');
    }
    function createTable(){
        if(data.length > 0){
            var table = new LightWeightTable(tableNode, columns, data);
        }
        else{
            addClass(element, 'hidden');
        }
    }

    return {
        load: function(){
            initialiseVariables.call(this);
            createTable();
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