var SingleSelectRadio = (function(){
    // Utilities
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

    function setBindAll(context){
        // Connect properties of binding (if NVP) to the change event
        var changeFunc = context.change;
        var binding = getBinding(context);
        require(['dojo/_base/lang'], function(lang){
            // to trigger change in case binding is NVP
            if(!!binding && !!binding.get && typeof binding.get('value') == 'object'){
                bindings[bindings.length] = binding.get("value").bindAll(lang.hitch(context, changeFunc));
            }
        });
    }
    function isObjectNVP(object){
        return typeof object === 'object' && object.hasOwnProperty('name') && object.hasOwnProperty('value');
    }


    // Put your code into the functions below as you would within the coach view.
    // Within the actual coach view, bring in the AMD Dependencie for dojo/_base/lang.
    // Call lang.hitch on the the respective function
    // E.g. in the inline javascript section paste the following to link the load functions:
    // this.load = lang.hitch(this, SingleSelectRadio.load);
    return {
        load: function(){
            var binding = getBinding(this);
            var boundValue = binding.get('value');
            var querySelector = getElement(this).querySelector.bind(getElement(this));
            var wrapperDiv = querySelector('.singleSelectRadio.wrapper');
            var alwaysUseSuppliedList = !!this.context.options.alwaysUseSuppliedList && this.context.options.alwaysUseSuppliedList.get('value');
            var labelVisible = (this.context.options._metadata.labelVisibility.get('value') == 'SHOW');
            var label = !!this.context.options._metadata.label ? this.context.options._metadata.label.get('value') : '';

            // Set Bind All - if it is NVP so if properties change, we know
            setBindAll(this);

            // If label visible
            if(labelVisible){
                var labelSpan = document.createElement('span');
                labelSpan.innerText = label;
                labelSpan.className = 'label';
                wrapperDiv.appendChild(labelSpan);
            }

            if(alwaysUseSuppliedList){
                var listOptions = !!this.context.options.listOptions && !!this.context.options.listOptions.get('value') && this.context.options.listOptions.get('value').items;
                var radioUniqueId = this.context.viewid + '_' + (new Date()).getTime();
                var defaultValue = isObjectNVP(boundValue) ? boundValue.value : boundValue;
                var disabled = (this.context.options._metadata.visibility.get('value') == 'READONLY');
                var radiosContainer = document.createElement('div');
                radiosContainer.className = 'radiosContainer';

                require(['dijit/form/RadioButton'], function (RadioButton) {
                    for (var i = 0; listOptions && i < listOptions.length; i++)(function captureIterator(i){
                        // Create the dom nodes
                        var div = document.createElement('div');
                        var radio = document.createElement('input');
                        var description = document.createElement('span');
                        var label = document.createElement('label');
                        label.appendChild(radio);
                        description.innerText = listOptions[i].name;
                        label.appendChild(description);
                        div.appendChild(label);
                        radiosContainer.appendChild(div);

                        // Create the widget and attach
                        var radioWidget = new RadioButton({
                            checked: (listOptions[i].value == defaultValue),
                            value: listOptions[i].value,
                            name: radioUniqueId,
                            id: radioUniqueId + i,
                            disabled: disabled,
                            onClick: function(){
                                console.info('clicked ' + this.value);
                                if(isObjectNVP(boundValue)){
                                    var boundNVP = binding.get('value');
                                    boundNVP.name = label.innerText;
                                    boundNVP.value = this.value;
                                    binding.set('value', boundNVP);
                                }
                                else{
                                    binding.set('value', this.value);
                                }
                            }
                        }, radio);
                        widgets[widgets.length] = radioWidget;
                    })(i);  // to make sure new variable defined for iterator
                    wrapperDiv.appendChild(radiosContainer);
                })
            }
        },
        unload: function(){
            for(var i = 0; handlers && i < handlers.length; i++){
                handlers[i].remove && handlers[i].remove();
            }
            for(var i = 0; widgets && i < widgets.length; i++){
                widgets[i].destroy && widgets[i].destroy();
            }
        },
        view: function(){

        },
        change: function(event){

        },
        collaboration: function(event){

        },
        validate: function(event){

        }
    };
})();
