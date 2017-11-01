public with sharing class PC_CustomerUsersController {

    public static CustomerUserRoot customerUsers {get;set;}

    @AuraEnabled
    public static CustomerUser currentCustomerUser {get; set;}

    @AuraEnabled
    public static List<CustomerUser> getCustomerUserLists(string acctId) {
        act = [ SELECT Id, Name, CrmProvider__c, PC_PhoneSystem__c, PC_Active_Purchased_Frm__c, Users_Potentially__c, Plan__c, Subscription_Status__c,CreatedDate,Callinize_DB_ID__c,
                Purchased_Users__c, Description
                FROM Account
        WHERE id =: acctId];
        organizationId = act.Callinize_DB_ID__c;
        getCustomerUsersFromTenfold();
        return customerUserList;
    }

    public static String syncUsersFromTenfoldWithContacts(string acctId) {
        List<Contact> contacts = [ SELECT Id, PC_IsAdmin__c, LastName, Email, PC_TenfoldUserStatus__c, Tenfold_User_Id__c
        FROM Contact
        WHERE accountId = :acctId and (PC_TenfoldUserStatus__c in ('Active', 'Suspended', 'Syncing with Tenfold'))];
        Map<String, Contact> tenfoldContactMap = new Map<String, Contact>();
        for(Contact item : contacts){
            tenfoldContactMap.put(item.Tenfold_User_Id__c, item);
        }
        getCustomerUserLists(acctId);
        List<Contact> contactsToUpsert = new List<Contact>();
        Boolean needsToUpdate = false;
        Contact currentContact;
        for(CustomerUser tenfoldUser : customerUserList ){
            needsToUpdate = false;
            system.debug('inside loop');
            if(tenfoldContactMap.get(tenfoldUser.CustomerUserId) != null){
                currentContact = tenfoldContactMap.get(tenfoldUser.CustomerUserId);
                system.debug('found SF --> '+currentContact);
                system.debug('found tenfold --> '+tenfoldUser);

                system.debug(currentContact.LastName + ' LastName --> '+tenfoldUser.name);
                if(currentContact.LastName != tenfoldUser.name){
                    currentContact.LastName = tenfoldUser.name;
                    needsToUpdate = true;
                }
                system.debug(currentContact.email + ' email --> '+tenfoldUser.username);
                if(currentContact.email != tenfoldUser.username){
                    currentContact.email = tenfoldUser.username;
                    needsToUpdate = true;
                }
                system.debug(currentContact.PC_IsAdmin__c + ' PC_IsAdmin__c --> '+tenfoldUser.isAdmin);
                if(currentContact.PC_IsAdmin__c != tenfoldUser.isAdmin){
                    system.debug(' inside admin  --> ');
                    currentContact.PC_IsAdmin__c = tenfoldUser.isAdmin;
                    needsToUpdate = true;
                }
            }else{
                currentContact = new Contact(
                        Tenfold_User_Id__c = tenfoldUser.CustomerUserId,
                        FirstName = null,
                        LastName = tenfoldUser.name,
                        email = tenfoldUser.username,
                        PC_IsAdmin__c = tenfoldUser.isAdmin,
                        AccountId = acctId,
                        PC_TenfoldUserStatus__c = (tenfoldUser.disabled == true ? 'Suspended' : 'Active')
                        );
                needsToUpdate = true;
            }
            if(needsToUpdate == true){
                contactsToUpsert.add(currentContact);
            }
        }
        try{
            if(!contactsToUpsert.isEmpty()){
                Database.upsert(contactsToUpsert,false);
            }
        }catch(Exception ex){
            System.debug('Exception -->'+ex.getMessage());
            return 'Problem with sync users.';
        }
        return 'Synced with Tenfold';
    }


    public static List<CustomerUser> customerUserList {get;set;}
    public static String organizationId {get;set;}
    public static Account act;

    public PC_CustomerUsersController(ApexPages.StandardController controller) {
        controller.addFields(new List<String>{'Callinize_DB_ID__c'});
        currentCustomerUser = new CustomerUser();
        act = (Account)controller.getRecord();
        organizationId = act.Callinize_DB_ID__c;
        getCustomerUsersFromTenfold();
    }

    @AuraEnabled
    public static String saveNewCustomerUser(String userName, String userEmail, String userPassword, Boolean sendInvite) {
        System.debug('saveNewCustomerUser method, parameter name2--->'+userName+' email->'+userEmail+' password->'+userPassword+' sendInvite->'+sendInvite);

        PC_Exception  data1 = new PC_Exception('MyCustomServerError', 'Need to implement create new customer user - ' +userName , 123);
        throw new AuraHandledException(JSON.serialize(data1));

        return 'ok';
    }

    @AuraEnabled
    public static String editCustomerUser(String customerToSave) {
        System.debug('editCustomerUser method, parameter customerToSave--->'+customerToSave);
        currentCustomerUser = (CustomerUser)System.JSON.deserializeStrict(customerToSave, CustomerUser.Class);

        PC_Exception  data1 = new PC_Exception('MyCustomServerError', 'Need to implement save customer user', 123);
        throw new AuraHandledException(JSON.serialize(data1));

        return 'ok';
    }

    @AuraEnabled
    public static String sendInviteToUser(String customerToReinviteId, String customerUserOrgId) {
        System.debug('reInviteUser method, parameter customerToReinvite--->'+customerToReinviteId);
        System.debug('reInviteUser method, parameter acctId--->'+customerUserOrgId);

        Map<String,String> headers = new Map<String,String>();
        String sendInviteResponse = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('CustomerUserReinviteEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(),customerUserOrgId, customerToReinviteId }),
                PC_RESTutils.POST_METHOD,
                headers,
                '{}'
        );
        if(sendInviteResponse == 'OK'){
            return 'Invitation was sent successfully.';
        }
        return sendInviteResponse;
    }


    @AuraEnabled
    public static String setCustomerUserAsAdmin(String customerToReinviteId, String customerUserOrgId, String acctId) {
        System.debug('reInviteUser method, parameter customerToReinvite--->'+customerToReinviteId);
        System.debug('reInviteUser method, parameter acctId--->'+customerUserOrgId);

        Map<String,String> headers = new Map<String,String>();
        String sendInviteResponse = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('CustomerUserSetAsAdminEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(),customerUserOrgId  }),
                PC_RESTutils.PUT_METHOD,
                headers,
                '{"_admin": "'+customerToReinviteId+'"}'
        );
        syncUsersFromTenfoldWithContacts(acctId);
        return 'User was set as admin correctly.';
    }


    @AuraEnabled
    public static String deleteUser(String customerToDelete) {
        System.debug('deleteUser method, parameter customerToDelete--->'+customerToDelete);
        currentCustomerUser = (CustomerUser)System.JSON.deserializeStrict(customerToDelete, CustomerUser.Class);

        PC_Exception  data1 = new PC_Exception('MyCustomServerError', 'Need to implement deleteUser', 123);
        throw new AuraHandledException(JSON.serialize(data1));

        return 'ok';
    }

    private static void getCustomerUsersFromTenfold(){
        system.debug('PC_UserUtils.getOrganizationIdOfCurrentUser()--->'+PC_UserUtils.getOrganizationIdOfCurrentUser());
        String customerUserJSON = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('GetCustomerUsersEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(),organizationId}),
                PC_RESTutils.GET_METHOD,
                new Map<String,String>()
        );
        customerUserJSON = customerUserJSON.replace('"_id":',  '"CustomerUserId":' ); //name of the variable can not start from underline
        customerUserJSON = customerUserJSON.replace('"_organization":',  '"CustomerOrganization":' ); //name of the variable can not start from underline
        customerUsers = (CustomerUserRoot)System.JSON.deserialize(customerUserJSON, CustomerUserRoot.class);
        customerUserList = customerUsers.users;
    }

    public class CustomerUserRoot
    {
        public List<CustomerUser> users { get; set; }
    }

    public class CustomerUser{
        @AuraEnabled
        public String CustomerUserId { get; set; }
        @AuraEnabled
        public String CustomerOrganization { get; set; }
        @AuraEnabled
        public String username { get; set; }
        @AuraEnabled
        public String name { get; set; }
        @AuraEnabled
        public List<Object> extensions { get; set; }
        @AuraEnabled
        public Boolean inboundEnabled { get; set; }
        @AuraEnabled
        public Boolean disabled { get; set; }
        @AuraEnabled
        public Boolean isAdmin { get; set; }

        public CustomerUser(){

        }
    }
}