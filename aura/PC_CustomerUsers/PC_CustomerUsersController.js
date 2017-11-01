({
    doInit: function (component, event, helper) {
        console.log('Edit record ID..' + component.get("v.recordId"));
        component.set("v.matchCriteriaForUsersList", "accountId = '" + component.get("v.recordId") + "' and (PC_TenfoldUserStatus__c in ('Active', 'Suspended', 'Syncing with Tenfold' ) )");
    },

    closeEditUserModal: function (component, event, helper) {
        component.set("v.isEditUserModalOpen", false);
    },

    saveEditUser: function (component, event, helper) {
        console.log('Edit record ID..' + component.get("v.currentCustomerUser").username);
        return helper.saveEditUser(component, event);
    },

    reInviteUser: function (component, event, helper) {
        return helper.reInviteUser(component, JSON.parse(event.getParam("recordData")));
    },

    setUserAsAdmin: function (component, event, helper) {
        console.log('setUserAsAdmin');
        return helper.setUserAsAdmin(component, JSON.parse(event.getParam("recordData")));
    },

    changePassword: function (component, event, helper) {
        console.log('changePassword');
        $A.createComponent(
            "c:PC_CustomerUserChangePassword", {
            "aura:id": "changePasswordBody",
            "recordData": event.getParam("recordData"),
            "isRunningFromQuickAction": false,
            "isInCreateMode": false
        },
            function (newComponent, status, errorMessage) {
            if (status === "SUCCESS") {
                var modalComponent = component.find('changePassword');
                modalComponent.set("v.visible", true);
                modalComponent.set("v.body", newComponent);
                modalComponent.show();
            } else if (status === "INCOMPLETE") {
                console.log("No response from server or client is offline.")
                helper.handleErrors("No response from server or client is offline.");
                // Show offline error
            } else if (status === "ERROR") {
                console.log("Error: " + errorMessage);
                helper.handleErrors(errorMessage);
                // Show error message
            }
        });
    },
})