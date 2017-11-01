({
	show : function(component, event, helper, title) {
	    console.log('show->'+title);
		component.set("v.visible", true);
	},

	hide : function(component, event, helper) {
		component.set("v.visible", false);
		$A.get("e.force:closeQuickAction").fire();
	},

	closeModal : function(component, event, helper) {
	    console.log('closeModal');
		component.set("v.visible", false);
		$A.get("e.force:closeQuickAction").fire();
		var closeModalEvent = component.getEvent("PC_ModalWasClosedEvent");
		closeModalEvent.fire();
	}
})