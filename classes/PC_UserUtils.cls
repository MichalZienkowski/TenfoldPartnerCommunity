public without sharing class PC_UserUtils {
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
        if(getCurrentUser().PC_TenfoldOrganizationId__c == null || getCurrentUser().PC_TenfoldOrganizationId__c == ''){
            getCurrentUser().PC_TenfoldOrganizationId__c = getUserInfoFromTenfold().user.organizationId;
        }
        system.debug('organization id --->'+ getCurrentUser().PC_TenfoldOrganizationId__c);
        return getCurrentUser().PC_TenfoldOrganizationId__c;
    }

    public static TenfoldUserWrapper getUserInfoFromTenfold(){
        Map<String,String> headers = new Map<String,String>();
        String tenfoldUserJSON = PC_RESTutils.callAPITenfold(
                PC_Utils.getCustomSettingValue('GetUserInfoEndpoint'),
                PC_RESTutils.GET_METHOD,
                headers
        );
        system.debug('getUserInfoFromTenfold organization id --->'+ (TenfoldUserWrapper)System.JSON.deserialize(tenfoldUserJSON, TenfoldUserWrapper.class) );
        return (TenfoldUserWrapper)System.JSON.deserialize(tenfoldUserJSON, TenfoldUserWrapper.class);
    }

    public class TenfoldUserWrapper
    {
        public TenfoldUser user { get; set; }
    }

    public class Analytics
    {
        public Boolean visible { get; set; }
    }

    public class LocalPresence
    {
    }

    public class LaunchMeeting
    {
    }

    public class KeepOpenAfterSave
    {
    }

    public class NlpFollowup
    {
    }

    public class Notes
    {
    }

    public class Notification
    {
    }

    public class EmailIntegration
    {
    }

    public class Next
    {
        public Notification notification { get; set; }
        public EmailIntegration emailIntegration { get; set; }
        public List<object> signatures { get; set; }
    }

    public class AgentStatus
    {
    }

    public class Features
    {
        public LocalPresence localPresence { get; set; }
        public LaunchMeeting launchMeeting { get; set; }
        public KeepOpenAfterSave keepOpenAfterSave { get; set; }
        public NlpFollowup nlpFollowup { get; set; }
        public Notes notes { get; set; }
        public Next next { get; set; }
        public AgentStatus agentStatus { get; set; }
    }

    public class TenfoldUser
    {
        public String username { get; set; }
        public String name { get; set; }
        public List<String> extensions { get; set; }
        public String crmId { get; set; }
        public Boolean inboundEnabled { get; set; }
        public Analytics analytics { get; set; }
        public Boolean deleted { get; set; }
        public DateTime invitedAt { get; set; }
        public Features features { get; set; }
        public Boolean disabled { get; set; }
        public String id { get; set; }
        public String organizationId { get; set; }
    }

}