({
    closeModal: function (component, event, helper) {
        console.log('closeModal from customer change password controller');
        helper.closeModal(component);
    },
    changePasswordForUser: function (component, event, helper) {
        console.log('changePasswordForCustomerUser from customer change password controller');
        console.log('data--->'+component.get('v.recordData'));
        helper.changePassword(component);



    },
})