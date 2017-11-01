({
    doInit: function (component, event, helper) {
        helper.prepareDataForModal(component, event, helper);
        if (component.get("v.recordId") != null) {
            helper.getAccountForEdit(component);
        }
    },

    closeModalFromQucikAction: function (component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },

    closeModal: function (component, event, helper) {
        console.log('closeModal from customer edit form');
        helper.closeModal(component);
    },

    startUpForm: function (component, event, helper) {
        console.log('startUpForm--->');
        helper.startUpForm(component, event, helper);
    },

    onCRMproviderChange: function (component) {
        var selectCmp = component.find("crmProvider");
        let currentAct = component.get("v.currentAccount");
        currentAct.CrmProvider__c = selectCmp.get("v.value");
        component.get("v.currentAccount", currentAct);
    },

    onPhoneSystemChange: function (component) {
        var selectCmp = component.find("phoneSystem");
        let currentAct = component.get("v.currentAccount");
        currentAct.PC_PhoneSystem__c = selectCmp.get("v.value");
        component.set("v.currentAccount", currentAct);
    },

    onPlanChange: function (component) {
        var selectCmp = component.find("plan");
        let currentAct = component.get("v.currentAccount");
        currentAct.Plan__c = selectCmp.get("v.value");
        component.set("v.currentAccount", currentAct);
    },

    inviteCheck: function (component, event, helper) {
        var checkCmp = component.find("invite");
        let currentAct = component.get("v.currentAccount");
        currentAct.PC_Sendinvite__c = selectCmp.get("v.value");
        component.set("v.currentAccount", currentAct);
        //component.set("v.invite", checkCmp.get("v.value"));
    },

    closeAccountModal: function (component, event, helper) {
        component.set("v.isCustomerEditModalOpen", false);
    },

    saveNewAccount: function (component, event, helper) {
        console.log('saveNewAccount controler');
        return helper.saveNewAccount(component, event);
    },

    updateAccount: function (component, event, helper) {
        console.log('updateAccount controler');
        return helper.updateAccount(component, event);
    },

    updateAccountFromQuickAction: function (component, event, helper) {
        console.log('updateAccountFromQuickAction controler');
        return helper.updateAccountFromQuickAction(component, event);
    }
})