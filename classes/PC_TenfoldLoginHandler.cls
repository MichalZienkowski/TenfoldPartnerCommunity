global class PC_TenfoldLoginHandler implements Auth.RegistrationHandler {

/**
 * @param data Parsed XML data from Google
 * @return Boolean Can user move forward in register / login flow
*/
    global boolean canUserBeAssigned(Auth.UserData data) {
        system.debug('data--->' + data);
        return true;
    }

/**
 * @param data Parsed XML data from Google
 * @return User sObject with User data for specified
*/
    global User createUser(Id portalId, Auth.UserData data) {
        system.debug('createUser--->');


//if Google username contains Britenet mail org(specified in BTN_ConstantRepo) method will return existing user
// with criteria. Auth.UserData is data returned from Google with specified scope in Auth Provider.
// Google User Email being checked for allegiance with Generic User for example RM.
        system.debug('data--->' + data);
        system.debug('data.email--->' + data.email);
        system.debug('portalId--->' + portalId);
        List<User> users = [select id, username from user where Email = :data.email];
        system.debug('users --->' + (users.isEmpty() ? null : users.get(0)));
        return users.isEmpty() ? null : users.get(0);

    }

/**
 * @description Method overriding Salesforce User Data with Google data. Remember
 *     some data can be inaccessible or null according to Auth. Provider scope.
 * @param userId Assigned User Id
 * @param portalId Id of portal
 * @param data Parsed XML data from Google
 * @return void
*/
    global void updateUser(Id userId, Id portalId, Auth.UserData data) {
        system.debug('data--->' + data);
        system.debug('data.user_id--->' + data.identifier);
        system.debug('userId--->' + userId);
        system.debug('portalId--->' + portalId);
        User currentUser = new User(id=userId);
        //currentUser.username = data.username + '@salesforce.com';
        currentUser.email = data.email;
        //currentUser.lastName = data.lastName;
        //currentUser.firstName = data.firstName;
        //String alias = data.username;
        //if(alias.length() > 8) {
        //    alias = alias.substring(0, 8);
        //}
        //currentUser.alias = alias;
        //currentUser.languagelocalekey = data.attributeMap.get('language');
        currentUser.PC_TenfoldId__c = data.identifier;
        update(currentUser);
    }

}