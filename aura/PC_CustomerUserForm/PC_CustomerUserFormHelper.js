({
    saveEditUser : function(component,event){
        var action = component.get('c.saveNewCustomerUser');
        action.setParams({  "userName" : JSON.stringify(component.get("v.userName")),
                            "userEmail" : component.get("v.userEmail"),
                            "userPassword" : component.get("v.userPassword"),
                            "sendInvite" : component.get("v.invite")
                            });

        action.setCallback(this, function(response) {
                let state = response.getState();
                console.log('state of call->'+state);
                if (state === "SUCCESS") {
                    let returnValue = response.getReturnValue();

                    this.displayToast("Success",response.getReturnValue(),"Success");
                    // Close the action panel
                    var dismissActionPanel = $A.get("e.force:closeQuickAction");
                    dismissActionPanel.fire();
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