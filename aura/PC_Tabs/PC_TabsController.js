({
    handleActive: function (cmp, event, helper) {
        helper.lazyLoadTabs(cmp, event);
    },

    doInit: function (component, event, helper) {
        console.log('PC_TabsController.doInit');
        helper.init(component);
    },

})