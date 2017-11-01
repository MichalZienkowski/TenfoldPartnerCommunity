public class PC_Exception extends Exception {
    @AuraEnabled
    public String name;
    @AuraEnabled
    public String message;
    @AuraEnabled
    public Integer code;

    public PC_Exception(String name, String message, Integer code) {
        this.name = name;
        this.message = message;
        this.code = code;
    }

    public void throwException(){
        throw new AuraHandledException(JSON.serialize(this));
    }

}