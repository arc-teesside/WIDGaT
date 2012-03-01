/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/

*/

Ext.define("WIDGaT.view.attribute.OutputField", {
    extend: 'Ext.form.FieldContainer',
    alias : 'widget.outputfield',

	
	initComponent: function() {
		Ext.apply(this, {
			layout: 'hbox',
			items: [{
				xtype: 'textfield',
				id: 'outputTextField',
				flex: 1
			}, {
				xtype: 'button',
				id: 'outputButton',
				text: '...',
				handler: function() {
					// Show a menu or selection dialog, then set the user's
					// selected value with:
					//alert('clicked');
					//Ext.create('WIDGaT.view.action.Window');
				}
			}]
		});
		
		this.addEvents(
            'blur'
        );

        this.callParent(arguments);
    },
	
	onRender: function() {
		console.log('outputfield rendered', this);
		this.callParent(arguments);  
	},
	setValue: function(val) {
		//alert(val);
		this.down('textfield').setValue(val);
	},

   getValue: function() {
        // If the user has not changed the raw field value since a value was selected from the list,
        // then return the structured value from the selection. If the raw field value is different
        // than what would be displayed due to selection, return that raw value.
        /*var me = this,
            picker = me.picker,
            rawValue = me.getRawValue(), //current value of text field
            value = me.value; //stored value from last selection or setValue() call

        if (me.getDisplayValue() !== rawValue) {
            value = rawValue;
            me.value = me.displayTplData = me.valueModels = null;
            if (picker) {
                me.ignoreSelection++;
                picker.getSelectionModel().deselectAll();
                me.ignoreSelection--;
            }
        }*/
		
        return this.down('textfield').getValue();
    },
	
	onBlur: function() {
		console.log('blurrr');
		this.down('textfield').blur();
	},
	
	reset: function() {
	
	},
    
    onDestroy: function(){
		console.log('destroying outputfield');
        this.callParent();    
    },
	
	isValid: function() {
		return true;
	}
});
