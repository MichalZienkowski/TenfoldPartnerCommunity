({

    convertArrayOfObjectsToCSV : function(component,objectRecords){
        // declare variables
        var csvStringResult, counter, keys, columnDivider, lineDivider;

        // check if "objectRecords" parameter is null, then return from function
        if (objectRecords == null || !objectRecords.length) {
            return null;
        }
        // store ,[comma] in columnDivider variabel for sparate CSV values and
        // for start next line use '\n' [new line] in lineDivider varaible
        columnDivider = ',';
        lineDivider =  '\r\n';

        // in the keys valirable store fields API Names as a key
        // this labels use in CSV file header
        var firstLine = component.get("v.FieldLabels");
        keys = component.get("v.FieldNames");

        csvStringResult = '';
        csvStringResult += firstLine.join(columnDivider);
        csvStringResult += lineDivider;

        for(var i=0; i < objectRecords.length; i++){
            counter = 0;

            for(var sTempkey in keys) {
                var skey = keys[sTempkey] ;

                // add , [comma] after every String value,. [except first]
                if(counter > 0){
                    csvStringResult += columnDivider;
                }

                if(objectRecords[i][skey] == undefined){
                    objectRecords[i][skey] = '';
                }
                csvStringResult += '"'+ objectRecords[i][skey]+'"';

                counter++;

            } // inner for loop close
            csvStringResult += lineDivider;
        }// outer main for loop close

        // return the CSV formate String
        return csvStringResult;
    },
})