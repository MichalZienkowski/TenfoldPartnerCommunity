({

    getURLforTenfoldSSO: function(component) {
        var action = component.get('c.getURLforTenfoldSSO');

        action.setCallback(this, function(response){
            if(component.isValid() && response !== null && response.getState() == 'SUCCESS'){
                component.set('v.urlToTenfoldSSO', response.getReturnValue());
                console.log('response-->'+response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    }
})