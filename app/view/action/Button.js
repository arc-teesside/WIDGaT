/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.action.Button' ,{
	extend: 'Ext.button.Button',
	alias : 'widget.actionbutton',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			id: 'actionButton',
			text : 'Select action...',
			dock: 'top'
		});
		this.callParent(arguments);
	},
	
	reset: function() {
		return true;
	},
	
	setValue: function(val) {
		this.value =  val;
		return true;
	},
	
	getValue: function() {
		return this.value;
	}
});