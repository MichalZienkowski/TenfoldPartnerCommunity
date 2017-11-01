({

    getCustomerUserList: function(component) {
        var action = component.get('c.getCustomerUserLists');
        action.setParams({ "acctId" : component.get("v.recordId") });

        var self = this;
        action.setCallback(this, function(actionResult) {
            component.set('v.customerUserList', actionResult.getReturnValue());
        });
        $A.enqueueAction(action);
    },

    saveEditUser : function(component,event){
        var action = component.get('c.editCustomerUser');
        action.setParams({ "customerToSave": JSON.stringify(component.get("v.currentCustomerUser")) });

        var self = this;
        action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    component.set("v.isEditUserModalOpen", false);
                    this.displayToast("Success",response.getReturnValue(),"Success");
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

    reInviteUser: function(component, userToReinvite) {
        var action = component.get('c.sendInviteToUser');
        action.setParams({"customerToReinviteId" : userToReinvite.Tenfold_User_Id__c, "customerUserOrgId" : userToReinvite.PC_TenfoldOrganizationId__c});

        action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success",response.getReturnValue(),"Success");
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

    generateCustomerUserTable: function(component) {
        $A.createComponent(
            "c:PC_Table2", {
            "aura:id": "customerUsersTable",
            "Title": "",
            "SObjectName": "Contact",
            "FieldNames": ['Id', 'PC_IsAdmin__c', 'LastName', 'Email', 'PC_TenfoldUserStatus__c', 'Tenfold_User_Id__c', 'PC_TenfoldOrganizationId__c'],
            "FieldNamesToShowInTable": ['PC_IsAdmin__c', 'LastName', 'Email'],
            "FieldLabels": ['LastName:Username', 'PC_IsAdmin__c:admin', 'Email:Username'],
            "ReferenceFields": [],
            "OverrideFieldType": ['Email:STRING'],
            "ShowActionColumn": "true",
            "ActionItems": ['Change password', 'Re-invite', 'Set as admin'],
            "MatchCriteria": "accountId = '" + component.get("v.recordId") + "' and (PC_TenfoldUserStatus__c in ('Active', 'Suspended', 'Syncing with Tenfold' ) )",
            "SortOrder": "DESC"
        },
            function (newComponent, status, errorMessage) {
            console.log('status.' + status);
            if (status === "SUCCESS") {
                component.set("v.body", body);

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

    setUserAsAdmin: function(component, userToReinvite) {
        var action = component.get('c.setCustomerUserAsAdmin');
        console.log('aaa'+component.get("v.recordId"));
        action.setParams({"customerToReinviteId" : userToReinvite.Tenfold_User_Id__c, "customerUserOrgId" : userToReinvite.PC_TenfoldOrganizationId__c, "acctId" : component.get("v.recordId") });

        action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success",response.getReturnValue(),"Success");

                    var navEvt = $A.get("e.c:PC_Table2RefreshTable");
        console.log('setUserAsAdmin3111'+navEvt);
        console.log('setUserAsAdmin3');
                    navEvt.fire();
        console.log('po evencie');
        //generateCustomerUserTable(component);

/*  component.set("v.refreshTableFlag", false);
  component.set("v.matchCriteriaForUsersList", "");
  component.set("v.refreshTableFlag", true);
        $A.get('e.force:refreshView').fire();*/


/*
        $A.createComponent(
            "c:PC_Table2", {
            "aura:id": "customerUsersTable",
            "Title": "",
            "SObjectName": "Contact",
            "FieldNames": "['Id', 'PC_IsAdmin__c', 'LastName', 'Email', 'PC_TenfoldUserStatus__c', 'Tenfold_User_Id__c', 'PC_TenfoldOrganizationId__c']",
            "FieldNamesToShowInTable": "['PC_IsAdmin__c','LastName', 'Email']",
            "FieldLabels": "['LastName:Username','PC_IsAdmin__c:admin', 'Email:Username']",
            "ReferenceFields": "[]",
            "OverrideFieldType": "['Email:STRING']",
            "ShowActionColumn": "true",
            "ActionItems": "['Change password', 'Re-invite', 'Set as admin']",
            "MatchCriteria": "{!v.matchCriteriaForUsersList}",
            "SortOrder": "DESC"
        },
            function (newComponent, status, errorMessage) {
            if (status === "SUCCESS") {
                var modalComponent = component.find('customerUsersTable');
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


*/







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

    deleteUser: function(component, userToDelete) {
        var action = component.get('c.deleteUser');
        action.setParams({ "customerToDelete": JSON.stringify(userToDelete) });

        var self = this;
        action.setCallback(this, function(response) {
                let state = response.getState();
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success",response.getReturnValue(),"Success");
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

    handleErrors : function(errors) {
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
    displayToast : function (title, message, type)
    {
        var toast = $A.get("e.force:showToast");
        if (toast)
        {
            toast.setParams({
                "title": title,
                "message": message,
                "type": type
            });
            toast.fire();
        }
        else // otherwise throw an alert
        {
            alert(title + ': ' + message);
        }
    }


})