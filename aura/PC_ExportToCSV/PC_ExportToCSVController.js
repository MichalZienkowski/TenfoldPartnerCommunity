({

    sendRequestForData : function(component,event,helper){
        var eventToFire = $A.get("e.c:PC_Table2GetAllRecordsRequestEvent");
        eventToFire.fire();
    },

    createCSV : function(component,event,helper){
        // get the Records [contact] list from 'ListOfContact' attribute
        var stockData = JSON.parse(event.getParam("allRecords"));

        // call the helper function which "return" the CSV data as a String
        var csv = helper.convertArrayOfObjectsToCSV(component,stockData);
        if (csv == null){return;}

        // ####--code for create a temp. <a> html tag [link tag] for download the CSV file--####
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self'; //
        hiddenElement.download = component.get("v.FileName")+'.csv';  // CSV file Name* you can change it.[only name not .csv]
        document.body.appendChild(hiddenElement); // Required for FireFox browser
        hiddenElement.click(); // using click() js function to download csv file
    },
})