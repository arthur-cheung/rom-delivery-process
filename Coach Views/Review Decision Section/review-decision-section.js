var ReviewDecisionSection = (function(){
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
        app: 'ReviewDecisionSection',
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

    var reworkHistoryEntry;
    function findReworkHistoryEntry(){
        var currentStep = !!this.context.options.reviewStep && this.context.options.reviewStep.get('value');
        if(!currentStep){
            log.error('No reviewStep provided. Aborting. Check reviewStep is bound under Config Options of coach view.');
            return;
        }
        var binding = this.context.binding && this.context.binding.get('value');
        var reworkHistory = binding.get('reworkHistory');
        var foundIndex = -1;
        forEach(reworkHistory.items, function forEachHistoryItem(historyItem, index){
            if(historyItem.reworkStep === currentStep){
                foundIndex = index;
            }
        });

        if(foundIndex == -1){   // If we don't find an entry, create one
            var newItem = reworkHistory.createListElement();
            newItem.reworkStep = currentStep;
            reworkHistory.add(newItem);
            foundIndex = reworkHistory.length() - 1;
        }

        return reworkHistory.get(foundIndex);
    }

    function createChangeHandlers() {
        // There are no variables bound directly to the radio buttons or the text area. Instead, we have bespoke onchange handlers
        // These handlers looks for a matching entry in request.reworkHistory - matching by reviewStep. If it can't find it, it'll create a new one.
        var element = this.context.element;
        var userName = this.context.bpm.system.user_fullName;
        require(['dijit/registry', 'dojo/query', 'dojo/NodeList-dom'], function (registry, query) {

            // Bind to the each select - when values change, we want to bind to request
            var widgets = registry.findWidgets(element);
            forEach(widgets, function forEachWidget(widget) {
                widget.onChange = function () {
                    if (this.checked == true) {
                        reworkHistoryEntry.set('reworkOutcome', this.value);
                        reworkHistoryEntry.set('timeStamp', (new Date()));
                        reworkHistoryEntry.set('actionedByUser', userName);
                    }
                    if (this.value === 'Approve' && this.checked == true) {
                        query('.rejectReason').addClass('hidden');
                        reworkHistoryEntry.set('comments', '');
                    }
                    else if (this.value === 'Reject' && this.checked == true) {
                        query('.rejectReason').removeClass('hidden');
                    }
                };
            });
        });

        var rejectReasonTextArea = element.querySelector('.rejectReason textarea');
        rejectReasonTextArea.addEventListener('change', function onChange(event) {
            reworkHistoryEntry.set('comments', event.target.value);
            reworkHistoryEntry.set('timeStamp', (new Date()));
            reworkHistoryEntry.set('actionedByUser', userName);
        });
    }
    function hideRejectReasonUnlessReject(){
        var element = this.context.element;
        var reworkOutcome = reworkHistoryEntry.get('reworkOutcome');
        if(reworkOutcome !== 'Reject'){
            require(['dojo/query', 'dojo/NodeList-dom'], function (query) {
                query('.rejectReason', element).addClass('hidden');
            });
        }
    }

    return {
        load: function(){
            reworkHistoryEntry = findReworkHistoryEntry.call(this);
        },
        unload: function(){
            for(var i = 0; handlers && i < handlers.length; i++){
                handlers[i].remove && handlers[i].remove();
            }
        },
        view: function(){
            createChangeHandlers.call(this);
            hideRejectReasonUnlessReject.call(this);
        },
        change: function(event){

        },
        collaboration: function(event){

        },
        validateFields: function(event){

        }
    };
})();