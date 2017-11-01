({
    getAdminAccountForLogin: function (component) {
        var action = component.get('c.getAdminAccountForLogin');
        action.setParams({
            "accountId": component.get("v.recordId")
        });
        var self = this;
        action.setCallback(this, function (actionResult) {
            console.log(actionResult.getReturnValue());
            component.set('v.currentAccount', actionResult.getReturnValue());
            console.log('currentAccount-->' + component.get('v.currentAccount'));
        });
        $A.enqueueAction(action);
    },

    getUrlToLoginAsAdmin: function (component) {
        console.log('getUrlToLoginAsAdmin-->');
        var action = component.get('c.getUrlToLoginAsAdmin');
        action.setParams({
            "accountId": component.get("v.recordId")
        });
        var self = this;
        action.setCallback(this, function (actionResult) {
            console.log('return-->' + actionResult.getReturnValue());
            component.set('v.urlToLoginAsAdmin', actionResult.getReturnValue());
            console.log('urlToLoginAsAdmin-->' + component.get('v.urlToLoginAsAdmin'));
        });
        $A.enqueueAction(action);
    },

    loginAsCustomerAdminInTenfold: function (component, event) {
        var action = component.get('c.getUrlToLoginAsAdmin');
        action.setParams({
            "accountId": component.get("v.recordId")
        });
        var self = this;
        action.setCallback(this, function (actionResult) {
            console.log('return-->' + actionResult.getReturnValue() + encodeURIComponent(window.location.pathname));
            window.location.href = actionResult.getReturnValue() + encodeURIComponent(window.location.pathname);
        });
        $A.enqueueAction(action);
    },

})