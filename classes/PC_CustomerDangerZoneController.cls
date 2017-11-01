public with sharing class PC_CustomerDangerZoneController {

    @AuraEnabled
    public static String suspendCustomer(String acctId) {
        return deleteOrRemoveActInTenfold(acctId, false);
    }

    @AuraEnabled
    public static String removeCustomer(String acctId) {
        return deleteOrRemoveActInTenfold(acctId, true);
    }

    public static String deleteOrRemoveActInTenfold(String acctId, Boolean isRemoveAction) {
        Account act = [
                SELECT Id, Name, Callinize_DB_ID__c, PC_IsSuspended__c
                FROM Account
                WHERE id = :acctId
        ];

        Map<String, String> headers = new Map<String, String>();
        String resultFromTenfold = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('DELETEcustomer', new List<String> {PC_UserUtils.getOrganizationIdOfCurrentUser(),act.Callinize_DB_ID__c}),
                PC_RESTutils.DELETE_METHOD,
                headers,
                JSON.serialize(new RemoveInTenfoldWrapper(isRemoveAction))
        );
        system.debug('result-->' + resultFromTenfold);
        try{
            if(isRemoveAction == true){
                delete act;
            }else{
                act.PC_Status__c = PC_Utils.capitalizeFirstLetter(Label.PC_Suspended);
                update act;
            }
        }catch (Exception ex){
            PC_Exception  data1 = new PC_Exception('Error during operation', ex.getMessage(), 1);
            throw new AuraHandledException(JSON.serialize(data1));
        }

        String operation = (isRemoveAction ? Label.PC_Removed : Label.PC_Suspended);
        return String.format(Label.PC_CustomerAction, new List<String>{operation});

    }

    public class RemoveInTenfoldWrapper
    {
        public Boolean remove { get; set; }
        public RemoveInTenfoldWrapper(Boolean remove){
            this.remove = remove;
        }
    }
}