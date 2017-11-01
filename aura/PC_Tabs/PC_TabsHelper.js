({
    lazyLoadTabs: function (cmp, event) {
        var tab = event.getSource();
        console.log('wybrany--->' + tab.get('v.id'));
        switch (tab.get('v.id')) {
        case cmp.get("v.NameOfSecondTab"):
            console.log(cmp.get("v.NameOfSecondTab"));
            this.injectComponent('c:PC_CustomerUsers', tab, cmp.get("v.recordId"));
            break;
        case cmp.get("v.NameOfThirdTab"):
            console.log(cmp.get("v.NameOfThirdTab"));
            this.injectComponent('c:PC_CustomerDangerZone', tab, cmp.get("v.recordId"));
            break;
        }
    },
    injectComponent: function (name, target, recordId) {
        $A.createComponent(name, {
            "recordId": recordId
        },
            function (contentComponent, status, error) {
            if (status === "SUCCESS") {
                target.set('v.body', contentComponent);
            } else {
                throw new Error(error);
            }
        });
    },

    init: function (component){
        console.log('PC_TabsHelper.doInit');
        this.syncUsersFromTenfoldWithContacts(component);
    },

    syncUsersFromTenfoldWithContacts: function(component) {
        console.log('PC_TabsHelper.syncUsersFromTenfoldWithContacts');
        var action = component.get('c.syncUsersFromTenfoldWithContacts');
        action.setParams({"acctId" : component.get('v.recordId') });
        console.log('recordId-->'+ component.get('v.recordId'));

        action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    component.set('v.isCustomerUsersSyncing', false);
                }
                else if (state === "ERROR") {
                   this.handleErrors(response.getError());
                }
                else {
                    // Handle other reponse states
                    this.displayToast("Unkown error",response.getReturnValue(),"");
                }
        });
        $A.enqueueAction(action);
    },
})