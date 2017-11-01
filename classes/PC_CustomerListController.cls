public with sharing class PC_CustomerListController {
    private static IntegrationWrapper integrationsData;
    @AuraEnabled
    public static List<Account> getAccounts() {
        PC_UserUtils.getUserInfoFromTenfold();
        getIntegrations();
        return [SELECT Id, Name, CrmProvider__c, PC_PhoneSystem__c, PC_Active_Purchased_Frm__c, Users_Potentially__c, Plan__c, PC_Status__c, CreatedDate, Callinize_DB_ID__c,
                        Purchased_Users__c, Description, PC_CustomerAdminName__c, PC_CustomerAdminEmail__c, PC_CustomerAdminPhoneNumber__c, PC_Sendinvite__c, PC_LanguageCode__c
                FROM Account
                WHERE ownerId =: PC_Utils.getCurrentUser().Id];
    }

    @AuraEnabled
    public static Account getAccountForEdit(String accountId) {
        getIntegrations();
        return [SELECT Id, Name, CrmProvider__c, PC_PhoneSystem__c, PC_Active_Purchased_Frm__c, Users_Potentially__c, Plan__c, Subscription_Status__c,CreatedDate,Callinize_DB_ID__c,
                Purchased_Users__c, Description, PC_LanguageCode__c
        FROM Account
        WHERE id =: accountId];
    }

    public static void getIntegrations(){
        if(integrationsData == null){
            Map<String,String> headers = new Map<String,String>();
            String integrationJSON = PC_RESTutils.callAPITenfold(
                    PC_Utils.getCustomSettingValue('GetIntegrationPhoneEndpoint', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser()}),
                    PC_RESTutils.GET_METHOD,
                    headers
            );
            integrationsData = (IntegrationWrapper)System.JSON.deserialize(integrationJSON, IntegrationWrapper.class);
        }
    }

    @AuraEnabled
    public static List<String> getPlanList() {
        return PC_Utils.getPickListValues(new Account(),'Plan__c');
    }

    @AuraEnabled
    public static List<String> getCRMIntegrationList() {
        List<String> retValue = new List<String>();
        if(integrationsData==null){
            getIntegrations();
        }
        for(Crm crmItems : integrationsData.integrations.crm){
            retValue.add(crmItems.name);
        }
        return retValue;
    }

    @AuraEnabled
    public static String getLanguageList() {
        /*Map<String,String> headers = new Map<String,String>();
        String languages = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('GetCustomerLanguage', new List<String> ()),
                PC_RESTutils.GET_METHOD,
                headers
        );
        List<String> languagesData = (List<String>)System.JSON.deserialize(languages, List<String>.class);
*/

        Map<String,String> headers = new Map<String,String>();
        Map<String,String> languageKeys = (Map<String,String>) System.JSON.deserialize(PC_Utils.getCustomSettingValue('LanguagesKeys') , Map<String,String>.class);
        Map<String,String> languagesData = new Map<String,String>();
        String languages = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('GetCustomerLanguage', new List<String> ()),
                PC_RESTutils.GET_METHOD,
                headers
        );

        List<String> languageKeysList = (List<String>)System.JSON.deserialize(languages, List<String>.class);
        for(Integer i = languageKeysList.size() - 1; i >= 0; i--){
            if(languageKeys.get(languageKeysList[i]) != null){
                languagesData.put(languageKeysList[i], languageKeys.get(languageKeysList[i]));
            }else{
                languagesData.put(languageKeysList[i], 'Unkown language');
            }
        }
        /*
        for(String item : languageKeysList){
            if(languageKeys.get(item) != null){
                languagesData.put(item, languageKeys.get(item));
            }else{
                languagesData.put(item, 'Unkown language');
            }
        }
*/
        return JSON.serialize(languagesData);
    }

    @AuraEnabled
    public static List<String> getPhoneIntegrationList() {
        List<String> retValue = new List<String>();
        if(integrationsData==null){
            getIntegrations();
        }
        for(Phone phoneItems : integrationsData.integrations.phone){
            retValue.add(phoneItems.name);
        }
        return retValue;
    }

    @AuraEnabled
    public static String deserializeAndUpdateCustomer(String actToUpdate) {
        system.debug('updateCustomer  method, parameter actToSave-->'+actToUpdate);
        system.debug('deserialization-->'+(Account)System.JSON.deserializeStrict(actToUpdate, Account.Class));
        return updateCustomer((Account)System.JSON.deserializeStrict(actToUpdate, Account.Class));
    }

    @AuraEnabled
    public static String updateCustomer(Account actToUpdate) {
        system.debug('updateCustomer  method, parameter actToSave-->'+actToUpdate);
        try{
            update actToUpdate;
        }catch (Exception ex){
            PC_Exception  data1 = new PC_Exception('Error during update operation', ex.getMessage(), 1);
            throw new AuraHandledException(JSON.serialize(data1));
        }
        updateActInTenfoldAsync(JSON.serialize(actToUpdate));
        return actToUpdate.Id;
    }

    @Future(callout=true)
    public static void updateActInTenfoldAsync(String actJson) {
        updateActInTenfold(actJson);
    }

    public static void updateActInTenfold(String actJson) {
        Account actToUpdate = (Account)System.JSON.deserializeStrict(actJson, Account.Class);
        CustomerWrapperToUpdate customerToUpdate = new CustomerWrapperToUpdate(actToUpdate);

        Map<String,String> headers = new Map<String,String>();
        String resultOfSaveInTenfold = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('PUTupdateCustomer', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(), actToUpdate.Callinize_DB_ID__c}),
                PC_RESTutils.PUT_METHOD,
                headers,
                customerToUpdate.getJSON()
        );
    }

    @AuraEnabled
    public static String saveNewCustomer(Account actToSave/*, String customerAdminName, String adminEmail, String phoneNumber, Boolean sendInvite*/) {
        system.debug('saveNewAccount method, parameter actToSave-->'+actToSave);
        //system.debug('saveNewAccount method, parameter actToSave-->'+actToSave+' customerAdminName--->'+customerAdminName+' adminEmail--->'+adminEmail+' PhoneNumber--->'+phoneNumber+' sendInvite--->'+sendInvite);

        try{
            insert actToSave;
        }catch (Exception ex){
            PC_Exception  data1 = new PC_Exception('Error during save operation', ex.getMessage(), 1);
            throw new AuraHandledException(JSON.serialize(data1));
        }
        saveActToTenfoldAsync(JSON.serialize(actToSave)/*, actToSave.PC_CustomerAdminName__c, actToSave.PC_CustomerAdminEmail__c, actToSave.PC_CustomerAdminPhoneNumber__c, actToSave.PC_Sendinvite__c*/);
        return actToSave.Id;
    }

    @Future(callout=true)
    public static void saveActToTenfoldAsync(String actJson/*, String customerAdminName, String adminEmail, String phoneNumber, Boolean sendInvite*/) {
        saveActToTenfold(actJson/*, customerAdminName, adminEmail, phoneNumber, sendInvite*/);
    }

    public static void saveActToTenfold(String actJson/*, String customerAdminName, String adminEmail, String phoneNumber, Boolean sendInvite*/) {
        Account actToSave = (Account)System.JSON.deserializeStrict(actJson, Account.Class);
        CustomerWrapperToSave customerToSave = new CustomerWrapperToSave(actToSave/*, customerAdminName, adminEmail, phoneNumber, sendInvite*/);

        Map<String,String> headers = new Map<String,String>();
        String resultOfSaveInTenfold = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('POSTsaveCustomer', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser()}),
                PC_RESTutils.POST_METHOD,
                headers,
                JSON.serialize(customerToSave)
        );
        system.debug('result-->'+resultOfSaveInTenfold);
        resultOfSaveInTenfold = resultOfSaveInTenfold.replace('_id', 'idP');
        resultOfSaveInTenfold = resultOfSaveInTenfold.replace('_admin', 'admin');
        TenfoldSaveCustomerWrapper responseObj = (TenfoldSaveCustomerWrapper)System.JSON.deserializeStrict(resultOfSaveInTenfold, TenfoldSaveCustomerWrapper.Class);
        actToSave.Callinize_DB_ID__c = responseObj.organization.id;
        update actToSave;
    }

    private static String saveCustomerAdmin(){

        return '';
    }

    public class Crm
    {
        public String name { get; set; }
        public String slug { get; set; }
        public String authentication_type { get; set; }
        public Boolean integrated { get; set; }
    }

    public class Phone
    {
        public String name { get; set; }
        public String slug { get; set; }
        public String authentication_type { get; set; }
        public Boolean integrated { get; set; }
        public String alias { get; set; }
        public String phone_type { get; set; }
    }

    public class Integrations
    {
        public List<Crm> crm { get; set; }
        public List<Phone> phone { get; set; }
    }

    public class IntegrationWrapper
    {
        public Integrations integrations { get; set; }
    }

    public class CustomerWrapperToUpdate
    {
        public String locale { get; set; }
        //public String admin { get; set; }
        public String company { get; set; }
        public String plan { get; set; }
        public String purchasedUsers { get; set; }
        //public String timezone { get; set; }
        //public String disabled { get; set; }
        //public String clickToDialCountryCodes { get; set; }
        public String phoneSystem { get; set; }
        public String crmProvider { get; set; }

        public CustomerWrapperToUpdate(Account accToUpdate){
            this.locale = accToUpdate.PC_LanguageCode__c;//'pl_PL';//TO DO UZUPELNIC
            //this.admin = null; //TO DO po co to?
            this.company = accToUpdate.Name;
            this.plan = 'partner_team';//accToUpdate.Plan__c;
            this.purchasedUsers = String.valueOf(accToUpdate.Purchased_Users__c);//'5';//TO DO UZUPELNIC accToUpdate.
            //this.timezone = null;
            //this.disabled = accToUpdate.
            //this.clickToDialCountryCodes = accToUpdate.
            this.phoneSystem = accToUpdate.PC_PhoneSystem__c;
            this.crmProvider = accToUpdate.CrmProvider__c;
        }

        public String getJSON(){
            String jsonToReturn = JSON.serialize(this);
            jsonToReturn = jsonToReturn.replaceFirst('admin', '_admin');
            return jsonToReturn;
        }
    }

    public class CustomerWrapperToSave
    {
        public String username { get; set; }
        public String name { get; set; }
        public Boolean sendInvite { get; set; }
        public String crmProvider { get; set; }
        public String phoneSystem { get; set; }
        public String purchasedUsers { get; set; }
        public String type { get; set; }
        public String locale { get; set; }
        public String plan { get; set; }
        public String phone { get; set; }
        public String company { get; set; }
        public String notes { get; set; }
        public Integrations integrations { get; set; }

        public CustomerWrapperToSave(Account actToSave/*, String customerAdminName, String adminEmail, String phoneNumber, Boolean sendInvite*/){
            this.username = actToSave.PC_CustomerAdminEmail__c;
            this.name = actToSave.PC_CustomerAdminName__c;//TO DO czy tu chodzi o admin name
            this.sendInvite = actToSave.PC_Sendinvite__c;
            this.crmProvider = actToSave.CrmProvider__c;
            this.phoneSystem = actToSave.PC_PhoneSystem__c;
            this.purchasedUsers =  String.valueOf(actToSave.Purchased_Users__c);//TO DO UZUPELNIC
            this.type = 'standard';//actToSave.Plan__c;//TO DO CO TO jest
            this.locale = actToSave.PC_LanguageCode__c;//'pl_PL';//TO DO UZUPELNIC
            this.plan = 'partner_team';//actToSave.Plan__c;
            this.phone = actToSave.PC_CustomerAdminPhoneNumber__c;
            this.company = actToSave.Name;
            this.notes = actToSave.Description;
            if(integrationsData == null){
                getIntegrations();
                this.integrations = integrationsData.integrations;
            }
        }
        /*public CustomerWrapperToSave(String username, String name, Boolean sendInvite, String crmProvider, String phoneSystem, String purchasedUsers,
        String type, String locale, String plan, String phone, String company, String note){
            this.username = adminEmail;
            this.name = name;//TO DO czy tu chodzi o admin name
            this.sendInvite = sendInvite;
            this.crmProvider = crmProvider
            this.phoneSystem = phoneSystem
            this.purchasedUsers = purchasedUsers;//TO DO UZUPELNIC
            this.type = type;//TO DO CO TO jest
            this.locale = locale;//TO DO UZUPELNIC
            this.plan = plan;
            this.phone = phone;
            this.company = company;
            this.notes = notes;
            this.integrations = integrationsData.integrations;
        }*/
    }






    public class RecordingsConfig
    {
        public List<sObject> excludedFolders { get; set; }
    }

    public class AgentStatus
    {
        public List<sObject> statuses { get; set; }
    }

    public class PhoneConfig
    {
        /*public String provider { get; set; }
        public String extMatchRegex { get; set; }
        public RecordingsConfig recordingsConfig { get; set; }
        public Boolean callStateChangeSupported { get; set; }
        public Integer ringGroupVariance { get; set; }
        public AgentStatus agentStatus { get; set; }
        public String idP { get; set; }
        public String alias { get; set;
          */
        public string provider { get; set; }
        public string host { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public Boolean authorizedThroughPortal { get; set; }
        public string groupId { get; set; }
        public string enterpriseId { get; set; }
        public string userProfile { get; set; }
        public Boolean extraUniqueCallId { get; set; }
        public Boolean attendedTransferSupport { get; set; }
        public AgentStatus agentStatus { get; set; }
        public string idP { get; set; }
        public String alias { get; set;}
        public Integer ringGroupVariance { get; set; }
        public String extMatchRegex { get; set; }
        public RecordingsConfig recordingsConfig { get; set; }
        public Boolean callStateChangeSupported { get; set; }
        public Boolean logAnonymousCalls { get; set; }
    }

    public class Environment
    {
        public String environment { get; set; }
    }

    public class Features
    {
        public Environment environment { get; set; }
    }

    public class Organization
    {
        public String idP { get; set; }
        public String id { get; set; }
        public String admin { get; set; }
        public String company { get; set; }
        public String crmProvider { get; set; }
        public String phoneSystem { get; set; }
        public List<PhoneConfig> phoneConfig { get; set; }
        public List<String> clickToDialCountryCodes { get; set; }
        public String plan { get; set; }
        public String commission { get; set; }
        public Integer enabledUsers { get; set; }
        public Integer purchasedUsers { get; set; }
        public Integer totalUsersCount { get; set; }
        public String status { get; set; }
        public Boolean disabled { get; set; }
        public String createdDate { get; set; }
        public Features features { get; set; }
        public String locale { get; set; }
    }

    public class TenfoldSaveCustomerWrapper
    {
        public Organization organization { get; set; }
    }

}