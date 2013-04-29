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
	},

	onTemplatesStoreLoad: function(store, records) {
	   
		var tblItems = new Array();
		WIDGaT.newWidget = Ext.create('WIDGaT.model.Widget');
		
		var mDataView = Ext.create('WIDGaT.view.template.DataView')
		mDataView.bindStore(store);
		
		this.getNewWindow().down('#template-list').add(mDataView);
	},

	onAfterWindowShow: function() {
	   this.getTemplatesStore().load();
	}
})