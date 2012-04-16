/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Templates', {
	extend: 'Ext.app.Controller',

	models: ['Template'],
	stores: ['Templates'],

	views: [
		'template.List',
		'template.DataView'
	],

	refs: [
		{ref: 'templateDataView', selector: 'templateDataView'},
		{ref: 'templateList', selector: 'templatelist'},
		{ref: 'newWindow', selector: 'newwindow'}
	],

	init: function() {
		var me = this;
		me.control({
			'newwindow': {
				show: me.onAfterWindowShow
			}
		});
		    
		me.getTemplatesStore().on({
			scope: me,
			load : me.onTemplatesStoreLoad
		});
			
		//me.getTemplatesStore().load();
	},

	onTemplatesStoreLoad: function(store, records) {
	   
		var tblItems = new Array();
		WIDGaT.newWidget = Ext.create('WIDGaT.model.Widget');
		
		Ext.each(store.getGroups(), function(group) {
			
			var mStore = Ext.create('WIDGaT.store.Templates')
			mStore.loadRecords(group.children);
			
			var mDataView = Ext.create('WIDGaT.view.template.DataView')
			mDataView.bindStore(mStore);
			
			var mPanel = Ext.create('Ext.panel.Panel', {
				title: group.name,
				items: mDataView
			});
				
			tblItems.push(mPanel);
		});
		
		this.getNewWindow().down('#template-list').add(tblItems);
	},

	onAfterWindowShow: function() {
	   this.getTemplatesStore().load();
	}
})