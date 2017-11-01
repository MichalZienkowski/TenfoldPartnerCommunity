public with sharing class PC_LoginController {

    @AuraEnabled
    public static String getURLforTenfoldSSO(){
        return PC_Utils.getCustomSettingValue('TenfoldLoginURL');
    }

}