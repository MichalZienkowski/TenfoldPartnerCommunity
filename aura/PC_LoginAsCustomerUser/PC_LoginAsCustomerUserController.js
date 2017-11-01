({
    doInit: function (component, event, helper) {
        console.log('Login as customer user doInit');
        //helper.getAdminAccountForLogin(component);
        //helper.getUrlToLoginAsAdmin(component);
        if(component.get('v.recordId')!=undefined && component.get('v.recordId')!=null){
            helper.loginAsCustomerAdminInTenfold(component, event);
        }
    },

    handleLoginAsCustomerUserEvent: function (component, event, helper) {
        component.set("v.recordId", JSON.parse(event.getParam("recordData")).Id);
        helper.loginAsCustomerAdminInTenfold(component, event);
    },

    goToTenfold: function (component, event, helper) {
        helper.loginAsCustomerAdminInTenfold(component, event);
    },

})