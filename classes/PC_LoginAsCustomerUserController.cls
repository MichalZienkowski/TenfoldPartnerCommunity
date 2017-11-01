public with sharing class PC_LoginAsCustomerUserController {

    @AuraEnabled
    public static Account getAdminAccountForLogin(String accountId) {
        system.debug('account id --->'+accountId);
        if(accountId == null || accountId == ''){
            return new Account();
        }
        return [SELECT Id, Name, Callinize_DB_ID__c
                FROM Account
                WHERE id =: accountId];
    }

    @AuraEnabled
    public static String getUrlToLoginAsAdmin(String accountId) {
        system.debug('accountId-->'+accountId);
        String adminId = '';
        Account currentAccount;
        if(accountId == null || accountId == ''){
            currentAccount = new Account();
        }else{
            currentAccount = [SELECT Id, Name, Callinize_DB_ID__c
            FROM Account
            WHERE id =: accountId];
        }
        system.debug('currentAccount-->'+currentAccount);


        String customerUserJSON = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('GetCustomerUsersEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(),currentAccount.Callinize_DB_ID__c}),
                PC_RESTutils.GET_METHOD,
                new Map<String,String>()
        );
        customerUserJSON = customerUserJSON.replace('"_id":',  '"CustomerUserId":' ); //name of the variable can not start from underline
        customerUserJSON = customerUserJSON.replace('"_organization":',  '"CustomerOrganization":' ); //name of the variable can not start from underline
        PC_CustomerUsersController.CustomerUserRoot customerUsers = (PC_CustomerUsersController.CustomerUserRoot)System.JSON.deserialize(customerUserJSON, PC_CustomerUsersController.CustomerUserRoot.class);

        for(PC_CustomerUsersController.CustomerUser item : customerUsers.users){
            system.debug('item-->'+item);
            if(item.isAdmin == true){
                adminId = item.CustomerUserId;
            }
        }
        if(adminId == ''){
            return '';
        }
        return PC_Utils.getCustomSettingValue('UrlToLoginAsCustomerAdminPart1')
                +adminId
                +PC_Utils.getCustomSettingValue('UrlToLoginAsCustomerAdminPart2');
    }

}