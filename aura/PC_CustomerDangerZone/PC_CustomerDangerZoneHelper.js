({
    closeModal: function (component) {
        console.log('closeModal from helper');
        var eventToFire = $A.get("e.c:PC_ModalCloseEvent");
        eventToFire.fire();
    },

    suspendCustomer: function (component, event) {
        console.log('suspendCustomer helper' + component.get("v.recordId"));
        var action = component.get('c.suspendCustomer');
        action.setParams({
            "acctId": component.get("v.recordId")
        });

        action.setCallback(this, function (response) {
            let state = response.getState();
            console.log('state helper-->' + state);
            if (state === "SUCCESS") {
                let returnValue = response.getReturnValue();

                this.displayToast("Success", response.getReturnValue(), "Success");
                this.closeModal();
            } else if (state === "ERROR") {
                this.handleErrors(response.getError());
            } else {
                // Handle other reponse states
                this.displayToast("Unkown error", response.getReturnValue(), "");
            }
        });
        console.log('finish helper');
        $A.enqueueAction(action);
    },

    removeCustomer: function (component, event) {
        console.log('removeCustomer helper');
        var action = component.get('c.removeCustomer');
        action.setParams({
            "acctId": component.get("v.recordId")
        });

        action.setCallback(this, function (response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let returnValue = response.getReturnValue();

                this.displayToast("Success", response.getReturnValue(), "Success");
                this.closeModal();
                console.log('URL-->');
                console.log('URL-->'+$A.get("$Label.c.PC_CustomersURL"));
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": $A.get("$Label.c.PC_CustomersURL")
                });
                urlEvent.fire();
            } else if (state === "ERROR") {
                this.handleErrors(response.getError());
            } else {
                // Handle other reponse states
                this.displayToast("Unkown error", response.getReturnValue(), "");
            }
        });
        $A.enqueueAction(action);
    },

    handleErrors: function (errors) {
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
    displayToast: function (title, message, type) {
        var toast = $A.get("e.force:showToast");
        if (toast) {
            toast.setParams({
                "title": title,
                "message": message,
                "type": type
            });
            toast.fire();
        } else // otherwise throw an alert
        {
            alert(title + ': ' + message);
        }
    }
})