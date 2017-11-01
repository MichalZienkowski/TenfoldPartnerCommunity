public with sharing class PC_TabsController {

    @AuraEnabled
    public static String syncUsersFromTenfoldWithContacts(string acctId) {
        return PC_CustomerUsersController.syncUsersFromTenfoldWithContacts(acctId);

    }
}