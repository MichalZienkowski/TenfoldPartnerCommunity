({

    initializeComponent : function(component, event, helper) {
        console.log('table2 initializeComponent');
        console.log('table2 match'+component.get('v.MatchCriteria'));
        component.set('v.PrivateMatchCriteria', component.get('v.MatchCriteria'));
        component.set('v.SelectedRecordsMap', new Map());
                console.log('1');
        helper.initializePageSizeSelectList(component);
                console.log('2');
        helper.initializeColumnMetaData(component);
                console.log('3');
    },

    refreshComponent : function(component, event, helper) {
        console.log('table2 refreshComponent');
        helper.retrieveRecords(component, true);
        console.log('table2 refreshComponent FINISH');
    },
    updateMatchCriteria : function(component, event, helper) {
        component.set('v.PrivateMatchCriteria', event.getParam('value'));
        helper.retrieveTotalRecords(component);
        helper.retrieveRecords(component, true);
    },

    selectRecord : function(component, event, helper){
        helper.switchRow(component, parseInt(event.srcElement.dataset.id), event.srcElement.checked);
    },

    selectAllRecords : function(component, event, helper){
        helper.switchAllRows(component, event.srcElement.checked);
    },

    getAllRecords : function(component, event, helper){
        console.log('odpalil event1');
        var eventToFire = $A.get("e.c:PC_Table2GetAllRecordsResponseEvent");
        console.log('odpalil event2');
        eventToFire.setParams({"allRecords": JSON.stringify(component.get("v.AllRecords"))})
        console.log('odpalil event3');
        eventToFire.fire();
        console.log('odpalil event4');
    },
    changeSort : function(component, event, helper){
        let clicked_element = event.srcElement;
        let sort_field = clicked_element.dataset.id;
        let current_sort_field = component.get('v.SortByField');
        let sort_order = component.get('v.SortOrder');
        if(sort_field === current_sort_field){
            if(sort_order === 'ASC'){
                sort_order = 'DESC';
            } else {
                sort_order = 'ASC';
            }
        } else {
            current_sort_field = sort_field;
            sort_order = 'DESC';
        }
        component.set('v.PageNumber', 1);
        component.set('v.SortByField', current_sort_field);
        component.set('v.SortOrder', sort_order);
        helper.retrieveRecords(component, false);
    },

    firstPage : function(component, event, helper) {
        let has_previous = component.get('v.HasPrevious');
        if(has_previous){
            component.set('v.PageNumber', 1);
            helper.updateTableRows(component);
        }
    },

    previousPage : function(component, event, helper) {
        let has_previous = component.get('v.HasPrevious');
        if(has_previous){
            let page_number = component.get('v.PageNumber');
            page_number = page_number - 1;
            component.set('v.PageNumber', page_number);
            helper.updateTableRows(component);
        }
    },

    nextPage : function(component, event, helper) {
        let has_next = component.get('v.HasNext');
        if(has_next){
            let page_number = component.get('v.PageNumber');
            page_number = page_number + 1;
            component.set('v.PageNumber', page_number);
            helper.updateTableRows(component);
        }
    },

    lastPage : function(component, event, helper) {
        let has_next = component.get('v.HasNext');
        if(has_next){
            let page_number = component.get('v.PageTotal');
            component.set('v.PageNumber', page_number);
            helper.updateTableRows(component);
        }
    },

    changePageSize : function(component, event, helper) {
        component.set('v.PageNumber', 1);
        component.set('v.PageSize', component.find('pageSizeInput').get('v.value'));
        helper.updateTableRows(component);
    },

    navigateToSObject : function (component, event, helper) {
        let record_id = event.currentTarget.id;
        let navigate = $A.get('e.force:navigateToSObject');
        navigate.setParams({
            'recordId': record_id,
            'slideDevName': 'detail'
        });
        navigate.fire();
    },

    lineAction: function(component, event, helper) {
        var menuValue = event.detail.menuItem.get("v.value");
        var indexInList = event.detail.menuItem.get("v.tabindex");
        console.log('index of table->'+indexInList);
        var indexInAllrows = JSON.parse(JSON.stringify(component.get("v.TableRows")[indexInList][0].index_in_AllRecords));
        console.log('indexInAllrows->'+indexInAllrows);
        var currentRecord = JSON.parse(JSON.stringify(component.get("v.AllRecords")[indexInAllrows]));
        console.log('currentRecord->'+JSON.stringify(currentRecord));
        //component.set("v.currentAccount", currentAccount);

        switch(menuValue) {
            case "Edit":
                var eventToFire = $A.get("e.c:PC_Table2EditRequestEvent");
                eventToFire.setParams({"recordData": JSON.stringify(currentRecord)});
                eventToFire.fire();
                break;//open modal
            case "Login as customer's admin":
                var eventToFire = $A.get("e.c:PC_Table2LoginAsCustomerEvent");
                eventToFire.setParams({"recordData": JSON.stringify(currentRecord)});
                eventToFire.fire();
                break;
            case "Re-invite":
                var eventToFire = $A.get("e.c:PC_Table2CustomerUserReinviteEvent");
                eventToFire.setParams({"recordData": JSON.stringify(currentRecord)});
                eventToFire.fire();
            break;
            case "Set as admin":
                console.log('Set as admin');
                var eventToFire = $A.get("e.c:PC_Table2CustomerUserSetAsAdminEvent");
                eventToFire.setParams({"recordData": JSON.stringify(currentRecord)});
                eventToFire.fire();
            break;
            case "Change password":
                console.log('Change password');
                var eventToFire = $A.get("e.c:PC_Table2CustomerUserChangePasswordEvent");
                eventToFire.setParams({"recordData": JSON.stringify(currentRecord)});
                eventToFire.fire();
            break;
            case "Remove":
                console.log('--->'+component.find('customerModal'));
            break;
        }
    },

})