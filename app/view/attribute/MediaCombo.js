/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.MediaCombo', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.mediacombobox',
	
	initComponent: function(){
		var me = this;
		
		console.log('Media type', this.mediaType);
		
		Ext.apply(me, {  
			allowBlank: true,
			blankText: 'Select file',
			editable: true,
			store: WIDGaT.mediaStore.filter('type', me.mediaType),
			queryMode: 'local',
			displayField: 'name',
			valueField: 'url',
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