({
    doInit: function (component, event, helper) {
        console.log('doInit-->');
        if (component.get("v.isInCreateMode") == true) {
            var newAccount = helper.getNewAccount();
            component.set("v.currentAccount", newAccount);
        }
    },

    newAccount: function (component, event, helper) {
        var newAccount = helper.getNewAccount();
        console.log('newAccount-->' + newAccount);
        $A.createComponent(
            "c:PC_CustomerEditForm", {
            "aura:id": "customerEditModal2",
            "currentAccount": newAccount,
            "isRunningFromQuickAction": false,
            "isInCreateMode": true,
            "recordId": null
        },
            function (newComponent, status, errorMessage) {
            if (status === "SUCCESS") {
                newComponent.set("v.currentAccount", newAccount);
                var modalComponent = component.find('customerEditModal');
                modalComponent.set("v.title", "New Customer");
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

    editCustomer: function (component, event, helper) {
        $A.createComponent(
            "c:PC_CustomerEditForm", {
            "aura:id": "customerEditModal2",
            "currentAccount": JSON.parse(event.getParam("recordData")),
            "isRunningFromQuickAction": false,
            "isInCreateMode": false,
            "recordId": JSON.parse(event.getParam("recordData")).Id
        },
            function (newComponent, status, errorMessage) {
            if (status === "SUCCESS") {
                newComponent.set("v.currentAccount", JSON.parse(event.getParam("recordData")));
                var modalComponent = component.find('customerEditModal');
                modalComponent.set("v.title", "Edit Customer");
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