({
    getNewAccount: function () {
        let newAccount = {
            'sobjectType': 'Account',
            'Name': '',
            'Phone': '',
            'Description': '',
            'Purchased_Users__c': 5,
            'PC_CustomerAdminName__c': '',
            'PC_CustomerAdminEmail__c': '',
            'PC_CustomerAdminPhoneNumber__c': '',
            'PC_Sendinvite__c': true
        };
        return newAccount;
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