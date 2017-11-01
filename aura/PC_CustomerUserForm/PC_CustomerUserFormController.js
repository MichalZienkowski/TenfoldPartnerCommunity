({

    saveUser: function(component, event, helper) {
        console.log('Edit record ID..'+component.get("v.userName"));
        return helper.saveEditUser(component,event);

    },
    closeModal: function(component, event, helper) {
       // Close the action panel
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    onCheck: function(component, event) {
        var checkCmp = component.find("invite");
        resultCmp = component.find("checkResult");
        resultCmp.set("v.value", ""+checkCmp.get("v.value"));
    },
     inviteCheck : function(component, event, helper) {
         var checkCmp = component.find("invite");
         component.set("v.invite", checkCmp.get("v.value"));

    }
})