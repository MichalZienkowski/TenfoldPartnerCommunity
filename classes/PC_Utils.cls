public with sharing class PC_Utils{

    //user companyName field will be used to store organizationId of the user
    private static User currentUser = null;

    public static User getCurrentUser() {
        if (currentUser == null || (currentUser.Id != UserInfo.getUserId())) {
            currentUser = [select id, Name, Email, Profile.Name, PC_TenfoldId__c, PC_TenfoldOrganizationId__c, AccountId, CompanyName from User where id =: UserInfo.getUserId()];
            currentUser.CompanyName = [SELECT Id, Callinize_DB_ID__c FROM Account WHERE Id =: currentUser.AccountId].Callinize_DB_ID__c;
        }
        return currentUser;
    }

    public static String getTenfoldIdOfCurrentUser(){
        return getCurrentUser().CompanyName;
    }

    public static String getOrganizationIdOfCurrentUser(){
        if(getCurrentUser().PC_TenfoldOrganizationId__c != ''){
            return getCurrentUser().PC_TenfoldOrganizationId__c;
        }else{

        }
        return getCurrentUser().PC_TenfoldOrganizationId__c;
    }

    public static String getCustomSettingValue(String nameOfTheProperty) {
        PartnerCommunitySettings__c prop = PartnerCommunitySettings__c.getInstance(nameOfTheProperty);
        if (prop != null){
            return prop.Value__c;
        } else {
            return '';
        }
    }

    public static String getCustomSettingValue(String nameOfTheProperty, List<String> parameters) {
        return String.format(getCustomSettingValue(nameOfTheProperty), parameters);
    }

    public static  String capitalizeFirstLetter(String original) {
        if (original == null || original.length() == 0) {
            return original;
        }
        return original.substring(0, 1).toUpperCase() + original.substring(1);
    }

    public static List<String> getPickListValues(sObject objObject, String fld) {
        List<String> allOpts = new list<String> ();
        Schema.sObjectType objType = objObject.getSObjectType();
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        Map<String,Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
        List<Schema.PicklistEntry> values = fieldMap.get(fld).getDescribe().getPickListValues();
        for (Schema.PicklistEntry item : values) {
            allOpts.add(item.getValue());
        }
        system.debug('allOpts ---->' + allOpts);
        allOpts.sort();
        return allOpts;
    }

}