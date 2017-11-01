public with sharing class PC_CustomerUserChangePasswordController {



    @AuraEnabled
    public static String changePasswordForCustomerUser(String customerUserJson, String password) {
        System.debug('changePasswordForCustomerUser method, parameter customerUserJson--->'+customerUserJson+'   pass->'+password);
        Contact cnt = (Contact)System.JSON.deserializeStrict(customerUserJson, Contact.Class);
        Map<String,String> headers = new Map<String,String>();
        String setPasswordResponse = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('CustomerUserChangePasswordEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(), cnt.PC_TenfoldOrganizationId__c, cnt.Tenfold_User_Id__c  }),
                PC_RESTutils.PUT_METHOD,
                headers,
                '{"password": "'+password+'"}'
        );
        return 'Password was changed correctly.';
    }
}