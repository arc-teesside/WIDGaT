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
		
		var tmpStore = Ext.create('Ext.data.Store', {
			fields: ['url', 'name', 'type']
		});
		console.log('WIDGaT.mediaStore.getGroups(me.mediaType)',WIDGaT.mediaStore.getGroups(me.mediaType));
		if(typeof WIDGaT.mediaStore.getGroups(me.mediaType) !== 'undefined')
			tmpStore.loadRecords(WIDGaT.mediaStore.getGroups(me.mediaType).children);
		
		Ext.apply(me, {  
			allowBlank: true,
			emptyText: 'No sound available',
			blankText: 'Select file',
			editable: true,
			queryMode: 'local',
			store: tmpStore,
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