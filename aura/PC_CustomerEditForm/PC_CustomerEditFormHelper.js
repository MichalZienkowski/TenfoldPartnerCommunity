({
    getAccountForEdit: function (component) {
        var action = component.get('c.getAccountForEdit');
        action.setParams({
            "accountId": component.get("v.recordId")
        });
        var self = this;
        action.setCallback(this, function (actionResult) {
            console.log(actionResult.getReturnValue());
            component.set('v.currentAccount', actionResult.getReturnValue());
            console.log('-->' + component.get('v.currentAccount'));
            this.startUpForm(component, null, null);
        });
        $A.enqueueAction(action);
    },

    closeModal: function (component) {
        console.log('closeModal from helper');
        var eventToFire = $A.get("e.c:PC_ModalCloseEvent");
        eventToFire.fire();
    },

    prepareDataForModal: function (component, event, helper) {
        console.log('prepareDataForModal');
        this.getCRMIntegrationList(component);
        this.getPhoneIntegrationList(component);
        this.getPlanList(component);
        this.getLanguageList(component);
    },

    startUpForm: function (component, event, helper) {
        console.log('helper startUpForm--->');
        this.setValuesOnPicklists(component, event, helper);
    },

    setValuesOnPicklists: function (component, event, helper) {
        console.log('helper setValuesOnPicklists--->');
        this.setValueOnSelectList(component, 'CrmProvider__c', 'v.crmList');
        this.setValueOnSelectList(component, 'Plan__c', 'v.planList');
        this.setValueOnSelectList(component, 'PC_PhoneSystem__c', 'v.phoneList');
        this.setValueOnSelectList(component, 'PC_LanguageCode__c', 'v.languageList');
    },

    setValueOnSelectList: function (component, fieldNameInCurrentAccount, optionListId) {
        var opts = component.get(optionListId);
        console.log('fieldNameInCurrentAccount-->'+fieldNameInCurrentAccount);
        console.log('opts-->'+opts);
        console.log('selectedValue-->'+component.get("v.currentAccount")[fieldNameInCurrentAccount]);
        var selectedValue = component.get("v.currentAccount")[fieldNameInCurrentAccount];
        var selectedValueAdded = false;
        if (selectedValue == undefined) {
            selectedValue = null;
        }
        for (var i = 0; i < opts.length; i++) {
            opts[i].selected = false;
            if (opts[i].value == selectedValue) {
                opts[i].selected = true;
                selectedValueAdded = true;
            }
        }

        if (selectedValueAdded == false) {
            opts.push({
                label: selectedValue,
                value: selectedValue,
                selected: true
            });
        }
        component.set(optionListId, opts);
    },

    getPlanList: function (component) {
        var action = component.get('c.getPlanList');
        var opts = [];
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                opts = this.prepareSelectList(response.getReturnValue());
                //component.find('plan').set("v.options", opts);
                component.set('v.planList', opts);
                //component.find('plan').set("v.value", null);
            }
        });
        $A.enqueueAction(action);
    },

    prepareSelectList: function (allValues) {
        console.log('prepareSelectList-->'+allValues);
        var opts = [];
        opts.push({
            class: "optionClass",
            label: "-- None --",
            value: null,
            selected: "true"
        });
        for (var i = 0; i < allValues.length; i++) {
            opts.push({
                class: "optionClass",
                label: allValues[i],
                value: allValues[i],
                selected: "false"
            });
        }
        return opts;
    },

    prepareSelectListFromMap: function (allValues) {
        console.log('prepareSelectListFromMap-->'+allValues);
        var opts = [];
        opts.push({
            class: "optionClass",
            label: "-- None --",
            value: null,
            selected: "true"
        });
        for (var key in allValues) {
        console.log(key + ' --prepareSelectListFromMap-->'+allValues[key]);
            opts.push({
                class: "optionClass",
                label: allValues[key],
                value: key,
                selected: "false"
            });
        }
        return opts;
    },

    getCRMIntegrationList: function (component) {
        var action = component.get('c.getCRMIntegrationList');
        var opts = [];
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {

                opts = this.prepareSelectList(response.getReturnValue());
                component.set('v.crmList', opts);
                //component.find('crmProvider').set("v.value", null);
            }
        });
        /*console.log(actionResult.getReturnValue());
        let crmList = actionResult.getReturnValue();
        component.set('v.crmList', crmList);
        });*/
        $A.enqueueAction(action);
    },

    getLanguageList: function (component) {
        var action = component.get('c.getLanguageList');
        var opts = [];
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                console.log('response--->'+response.getReturnValue() );
                console.log('response2--->'+JSON.parse(response.getReturnValue())   );
                opts = this.prepareSelectListFromMap(JSON.parse(response.getReturnValue()));
                console.log('response3--->' + opts );
                component.set('v.languageList', opts);
            }
        });
        $A.enqueueAction(action);
    },

    getPhoneIntegrationList: function (component) {
        console.log('getPhoneIntegrationList');
        var action = component.get('c.getPhoneIntegrationList');
        var opts = [];
        action.setCallback(this, function (response) {
            if (response.getState() == "SUCCESS") {
                opts = this.prepareSelectList(response.getReturnValue());
                //component.find('phoneSystem').set("v.options", opts);
                component.set('v.phoneList', opts);
                //component.find('phoneSystem').set("v.value", null);
            }
        });
        $A.enqueueAction(action);
    },

    validateForm: function (component) {
        //console.log('validateForm helper');
        var isValidated = this.validateInput(component, 'adminName', isValidated);
        isValidated = this.validateInput(component, 'email', isValidated);
        isValidated = this.validateInput(component, 'phoneNbr', isValidated);
        isValidated = this.validateInput(component, 'companyName', isValidated);
        isValidated = this.validateInput(component, 'crmProvider', isValidated);
        isValidated = this.validateInput(component, 'phoneSystem', isValidated);
        isValidated = this.validateInput(component, 'plan', isValidated);
        isValidated = this.validateInput(component, 'purchasedUsers', isValidated);
        isValidated = this.validateInput(component, 'notes', isValidated);
        return isValidated;
    },

    validateInput: function (component, fieldName, lastIsValidated) {
        //console.log('validateInput helper');
        var fieldToValidate = component.find(fieldName);
        //console.log(fieldName+ ' = ' + fieldToValidate);
        if (fieldToValidate == undefined) {
            return lastIsValidated;
        }
        //console.log('validateInput helper2');
        //console.log(fieldName+' 1- '+fieldToValidate.get('v.validity').valid);
        fieldToValidate.showHelpMessageIfInvalid();
        //console.log(fieldName+' 2- '+fieldToValidate.get('v.validity').valid);
        if (lastIsValidated == false) {
            return false;
        }
        return fieldToValidate.get('v.validity').valid;
    },

    setNotesOnCurrentAccount: function(component){
        console.log('setNotesOnCurrentAccount helper');
        let currentAct = component.get("v.currentAccount");
        console.log('saveNewAccount'+currentAct);
        let notes = component.find("notes");
        console.log('notes'+notes);
        console.log('notes valu--->'+notes.get("v.value"));
        currentAct.Description = notes.get("v.value");
        component.set("v.currentAccount", currentAct);
    },

    saveNewAccount: function (component, event) {
        console.log('saveNewAccount helper');
        this.setNotesOnCurrentAccount(component);
        if (this.validateForm(component) == true) {
            var action = component.get('c.saveNewCustomer');
            action.setParams({
                "actToSave": JSON.stringify(component.get("v.currentAccount"))
            });

            action.setCallback(this, function (response) {
                let state = response.getState();
                console.log('state of call->' + state);
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success", "Customer saved successfully.", "Success");
                    this.closeModal();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": response.getReturnValue(),
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                } else if (state === "ERROR") {
                    this.handleErrors(response.getError());
                } else {
                    // Handle other reponse states
                    this.displayToast("Unkown error", response.getReturnValue(), "");
                }
            });
            $A.enqueueAction(action);
        }
    },

    updateAccount: function (component, event) {
        console.log('updateAccount helper');
        this.setNotesOnCurrentAccount(component);
        if (this.validateForm(component) == true) {
            var action = component.get('c.deserializeAndUpdateCustomer');
            action.setParams({
                "actToUpdate": JSON.stringify(component.get("v.currentAccount"))
            });

            action.setCallback(this, function (response) {
                let state = response.getState();
                console.log('state of call->' + state);
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success", "Customer updated successfully.", "Success");
                    this.closeModal();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": response.getReturnValue(),
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                } else if (state === "ERROR") {
                    this.handleErrors(response.getError());
                } else {
                    // Handle other reponse states
                    this.displayToast("Unkown error", response.getReturnValue(), "");
                }
            });
            $A.enqueueAction(action);
        }
    },

    updateAccountFromQuickAction: function (component, event) {
        console.log('updateAccount helper');
        this.setNotesOnCurrentAccount(component);
        if (this.validateForm(component) == true) {
            var action = component.get('c.updateCustomer');
            action.setParams({
                "actToUpdate": JSON.stringify(component.get("v.currentAccount"))
            });

            action.setCallback(this, function (response) {
                let state = response.getState();
                console.log('state of call->' + state);
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success", "Customer updated successfully.", "Success");
                    this.closeModal();
                    var navEvt = $A.get("e.force:navigateToSObject");
                    navEvt.setParams({
                        "recordId": response.getReturnValue(),
                        "slideDevName": "related"
                    });
                    navEvt.fire();
                    $A.get("e.force:closeQuickAction").fire();
                } else if (state === "ERROR") {
                    this.handleErrors(response.getError());
                } else {
                    // Handle other reponse states
                    this.displayToast("Unkown error", response.getReturnValue(), "");
                }
            });
            $A.enqueueAction(action);
        }
    },

    handleErrors: function (errors) {
        // Configure error toast
        let toastParams = {
            title: "Error",
            message: "Unknown error", // Default error message
            type: "error"
        };

        // Pass the error message if any
        if (errors && Array.isArray(errors) && errors.length > 0) {
            try {
                toastParams.message = JSON.parse(errors[0].message).message;
            } catch (e) {
                toastParams.message = errors[0].message;
            }
        }
        // Fire error toast
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },

    /**
     * Display a message
     */
    displayToast: function (title, message, type) {
        var toast = $A.get("e.force:showToast");
        if (toast) {
            toast.setParams({
                "title": title,
                "message": message,
                "type": type
            });
            toast.fire();
        } else // otherwise throw an alert
        {
            alert(title + ': ' + message);
        }
    }
})