var RequestHeaderSection = (function(){
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
    function formatDate(date){
        if(!date){
            log.error('No date supplied');
            return
        }
        var month = (date.getMonth()+1) >= 10 ? date.getMonth() : '0' + (date.getMonth()+1);
        var dateString = date.getDate() + '/' + month + '/' + date.getFullYear();

        return dateString
    }
    function formatCurrency(currency){
        if(currency == null){
            log.error('No currency provided');
            return;
        }
        return '$' + String(currency).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    var log = {
        app: 'RequestHeaderSection',
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
    // var handlersToBind= ['load']; // You can add the event handlers you want to attach as you need
    //    for(var i = 0; !!handlersToBind && i < handlersToBind.length; i++){
    //        this[handlersToBind[i]] = lang.hitch(this, RequestHeaderSection[handlersToBind[i]]); // Make sure you rename "CoachViewTemplate" to what your object is named in your file
    //    }

    var header = {}, element, fields, fieldDefinitions = [];
    function getVariables(){
        element = this.context.element;
        if(!this.context.binding || !this.context.binding.get('value')){
            log.warning('Nothing bound to Request Header Section coach view.');
            return;
        }
        var binding = this.context.binding.get('value');
        var requestProperties = ['requestorName', 'projectName', 'projectManager', 'dueDate', 'requestorContactNumber'];
        forEach(requestProperties, function forEachRequestProperty(property){
            if(binding.get(property)){
                header[property] = binding.get(property);
            }
        });
        var estimateProperties = ['initialEstimate', 'estimaterName'];
        if(!binding || !binding || !binding.get('estimate')){
            log.info('No estimate property found on Request variable.');
        }
        else{
            forEach(estimateProperties, function forEachEstimateProperty(property){
                header[property] = binding.get('estimate').get(property);
            });
        }

        log.info('Initialised header:\n' + JSON.stringify(header));
    }
    function createFieldDefinition(){
        var defaultDefinitions = [
            {"type": "output", "label": "Requestor Name", "id": "requestorName", "value": header['requestorName']},
            {"type": "output", "label": "Project Name", "id": "projectName", "value": header['projectName']},
            {"type": "output", "label": "Project Manager", "id": "projectManager", "value": header['projectManager']},
            {"type": "output", "label": "Due Date", "id": "dueDate", "value": formatDate(header['dueDate'])},
            {"type": "output", "label": "Contact Number", "id": "requestorContactNumber", "value": header['requestorContactNumber']},
            {"type": "output", "label": "ROM Total", "id": "initialEstimate", "value": formatCurrency(header['initialEstimate'])},
            {"type": "output", "label": "ROM Produced By", "id": "estimaterName", "value": header['estimaterName']}
        ];
        // Only create field definitions for header properties we have values for
        forEach(defaultDefinitions, function forEachDefinition(definition){
            if(!!header[definition.id]){
                fieldDefinitions.push(definition);
            }
        });
    }
    function isHeaderEmpty(){
        var isEmpty = true;
        for(var i in header){
            if(!!header[i]){
                isEmpty = false;
            }
        }
        return isEmpty;
    }
    function createFields(){
        if(!isHeaderEmpty()){ // There are things in the header
            fields = new FieldsUtility(element, fieldDefinitions);
        }
        else{
            addClass(element, 'hidden');    // Otherwise, hide the empty header
        }
    }

    return {
        load: function(){
            getVariables.bind(this)();
            createFieldDefinition();
            createFields();
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