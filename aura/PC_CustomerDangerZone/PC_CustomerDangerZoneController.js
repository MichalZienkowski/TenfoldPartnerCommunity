({
    suspendCustomerConfirm: function (component, event, helper) {
        var modalComponent = component.find('suspendCustomer');
        modalComponent.set("v.visible", true);
        modalComponent.set("v.showFooter", true);
        modalComponent.show();
    },

    removeCustomerConfirm: function (component, event, helper) {
        var modalComponent = component.find('removeCustomer');
        modalComponent.set("v.visible", true);
        modalComponent.set("v.showFooter", true);
        modalComponent.show();
    },

    callSuspendCustomer: function (component, event, helper) {
        console.log('suspendCustomer controler');
        return helper.suspendCustomer(component, event);
    },

    callRemoveCustomer: function (component, event, helper) {
        console.log('removeCustomer controler');
        return helper.removeCustomer(component, event);
    },

    closeSuspendModal: function (component, event, helper) {
        helper.closeModal(component);
    },

    closeRemoveModal: function (component, event, helper) {
        helper.closeModal(component);
    },
})
