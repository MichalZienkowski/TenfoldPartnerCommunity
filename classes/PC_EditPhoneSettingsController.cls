public class PC_EditPhoneSettingsController {

    private static Account act;
    //public static string tokoen {get; set;}
    public String accountEditPhoneSettingURL {get; set;}

    public PC_EditPhoneSettingsController(ApexPages.StandardController controller) {
        controller.addFields(new List<String>{'Callinize_DB_ID__c'});
        act = (Account)controller.getRecord();
        //tokoen = PC_RESTutils.getTenfoldAccessToken();
        accountEditPhoneSettingURL = PC_Utils.getCustomSettingValue('AccountEditPhoneSettingURL', new List<String>{act.Callinize_DB_ID__c});
        System.debug('****************res.accountEditPhoneSettingURL();'+accountEditPhoneSettingURL);
    }
/*
    public static void callToTenfold() {
       
        HttpRequest req = new HttpRequest();
        //'https://api-development.tenfold.com/api/v1/partner/'+'0011F0000036LBw'+'/integrations';
        String endPointURL = String.format(PC_Utils.getCustomSettingValue('GetIntegrationPhoneEndpoint'), new List<String>{'0011F0000039RAQQA2'});
        req.setendpoint(endPointURL);
        req.setHeader('Content-Type', 'application/xml; charset=utf-8');
        req.setmethod('GET');
        req.setHeader('Authorization','Authorization: Bearer ' + PC_RESTutils.getTenfoldAccessToken());
        Http http = new Http();
        HTTPResponse res = http.send(req);
        //res = res.getbody();



        System.debug('****************res.getStatusCode();'+res.getStatusCode());
        System.debug('****************res.getbody();'+res.getbody());
        
    }*/
}