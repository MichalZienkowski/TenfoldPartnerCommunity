public without sharing class PC_RESTutils {
    public static String GET_METHOD = 'GET';
    public static String POST_METHOD = 'POST';
    public static String PUT_METHOD = 'PUT';
    public static String DELETE_METHOD = 'DELETE';

    public static String getRESTTenfoldAccessToken() {
        return 'Token'; //TO DO
    }
    public static String getTenfoldAccessToken() {
        return Auth.AuthToken.getAccessToken(PC_Utils.getCustomSettingValue('TenfoldAuthProviderID'), PC_Utils.getCustomSettingValue('TypeOfAuthProvider'));
    }

    public static void refreshTenfoldAccessToken() {
        Auth.AuthToken.refreshAccessToken(PC_Utils.getCustomSettingValue('TenfoldAuthProviderID'), PC_Utils.getCustomSettingValue('TypeOfAuthProvider'), PC_RESTutils.getTenfoldAccessToken());
    }

    public static String callAPITenfold(String endpoint, String method, Map<String, String> headers){
        return callAPITenfold(endpoint, method, headers, null);
    }

    public static String callAPITenfold(String endpoint, String method, Map<String, String> headers, String requestBody){
        try {
            if(isTokenExpired()){
                refreshTenfoldAccessToken();
            }
            HttpRequest req = new HttpRequest();
            req.setendpoint(endpoint);
            req.setmethod(method);
            if(requestBody != null){
                req.setHeader('Content-Type', 'application/json; charset=utf-8');
            }else{
                req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            req.setHeader('Authorization', 'Authorization: Bearer ' + PC_RESTutils.getTenfoldAccessToken());
            for(String headerKey : headers.keySet()){
                System.debug(headerKey +' header--->'+ headers.get(headerKey));
                req.setHeader(headerKey, headers.get(headerKey));
            }
            if(requestBody != null){
                System.debug(' body--->'+ requestBody);
                req.setBody(requestBody);
            }
            Http http = new Http();
            HTTPResponse response = http.send(req);
            if (response.getStatusCode() != 200 ) {
                System.debug(' endpoint--->'+ endpoint);
                System.debug(' response.getStatusCode()--->'+ response.getStatusCode());
                System.debug(' response.getbody()--->'+ response.getbody());
                PC_Exception data1 = new PC_Exception('Problem with Tenfold API',
                        'call to '+ endpoint + ' response ' + response.getbody(),
                        response.getStatusCode());
                throw new AuraHandledException(JSON.serialize(data1));
            } else {
                return response.getBody();
            }
        } catch( System.Exception e) {
            System.debug('ERROR: '+ e);
        }

        return '';
    }

    private static Boolean isTokenExpired(){
        try {
            HttpRequest req = new HttpRequest();
            req.setendpoint(PC_Utils.getCustomSettingValue('GetUserInfoEndpoint'));
            req.setHeader('Content-Type', 'application/xml; charset=utf-8');
            req.setmethod('GET');
            req.setHeader('Authorization','Authorization: Bearer ' + PC_RESTutils.getTenfoldAccessToken());
            Http http = new Http();
            HTTPResponse response = http.send(req);
            if (response.getStatusCode() == 401 ) {
                return true;
            } else if (response.getStatusCode() == 200){
                return false;
            } else {
                PC_Exception data1 = new PC_Exception('Problem with Tenfold API',
                        'call to '+ PC_Utils.getCustomSettingValue('GetUserInfoEndpoint') + ' response ' + response.getbody(),
                        response.getStatusCode());
                throw new AuraHandledException(JSON.serialize(data1));
            }
        } catch( System.Exception e) {
            System.debug('ERROR: '+ e);
            return false;
        }
        return false;
    }

}
