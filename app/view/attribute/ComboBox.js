/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.ComboBox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.outputcombobox',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, {  
			allowBlank: true,
			blankText: 'Select output',
			editable: true,
			store: WIDGaT.outputStore,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'shortName',
			listeners: {
				select: {
					fn: function(combo, records) {
						if(WIDGaT.debug) console.log('selected item combobox:', records);
					}
				}
			}
		});
		this.callParent(arguments);
	}
});