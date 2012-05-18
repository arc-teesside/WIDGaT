/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.ChoicesComboBox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.choicescombobox',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, {  
			allowBlank: true,
			editable: true,
			typeAhead: true,
			queryMode: 'local',
			selectOnFocus: true,
			displayField: 'str',
			valueField: 'str',
			listeners: {
				select: {
					fn: function(combo, records) {
						if(WIDGaT.debug) console.log('selected item combobox:', records);
					}
				},
				focus: {
					fn: function(cmp, eOpts) {
						cmp.expand();
					}
				}
			}
		});
		this.callParent(arguments);
	}
});