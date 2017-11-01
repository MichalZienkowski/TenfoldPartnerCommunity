global class PC_CustomerResendToTenfoldBatch implements Database.Batchable<sObject>, Database.Stateful, Database.AllowsCallouts {
    Boolean sendInfoAboutProblemsWithWebService = false;
    //String activitiesSent = Utils_g_peer.getInstanceNameForBatchNotification() + ' Below activities were sent to Concur. <BR/>';
    String query = 'SELECT Id, Name, CrmProvider__c, PC_PhoneSystem__c, PC_Active_Purchased_Frm__c, Users_Potentially__c, Plan__c, Subscription_Status__c,CreatedDate,Callinize_DB_ID__c, '+
                    'Purchased_Users__c, Description '+
                    'FROM Account';
    String token;

    global PC_CustomerResendToTenfoldBatch() {
        token = PC_RESTutils.getRESTTenfoldAccessToken();
    }

    global PC_CustomerResendToTenfoldBatch(String customQuery) {
        token = PC_RESTutils.getRESTTenfoldAccessToken();
        query = customQuery;
    }

    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, List<Account> scope) {
        for(Account item : scope){
            //saveActToTenfold.saveActToTenfold(JSON.serialize(item),);
        }
    }

    global void finish(Database.BatchableContext BC) {
        if(sendInfoAboutProblemsWithWebService){
            //Email_Util_g.sendMassEmail(Utils_g_peer.getListFromPeerProperty('ConcurResendFailuresPeer') , 'PEER - Concur integration resend activities', activitiesSent);
        }
    }
}