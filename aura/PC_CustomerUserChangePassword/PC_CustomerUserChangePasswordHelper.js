({
    closeModal: function (component) {
        console.log('closeModal from helper');
        var eventToFire = $A.get("e.c:PC_ModalCloseEvent");
        eventToFire.fire();
    },
    changePassword: function (component) {
        var action = component.get('c.changePasswordForCustomerUser');
        let pass = component.find('password');
        action.setParams({"customerUserJson" : component.get('v.recordData'), "password" : pass.get("v.value") });

        console.log(' changePassword data--->999');
        action.setCallback(this, function(response) {
        console.log('data--->111'+ response.getState());
                let state = response.getState();
                if (state === "SUCCESS") {
        console.log('data--->123');
                    let returnValue = response.getReturnValue();
                    this.displayToast("Success",response.getReturnValue(),"Success");
                    this.closeModal();
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