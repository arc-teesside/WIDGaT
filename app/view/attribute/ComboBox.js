// JavaScript Document

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
						console.log('selected item combobox:', records);
					}
				}
			}
		});
		this.callParent(arguments);
	}
});