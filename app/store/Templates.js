/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Templates', {
	extend: 'Ext.data.Store',
	model: 'WIDGaT.model.Template',
	
	/*proxy: {
		type: 'ajax',
		url: 'data/templates.json'
	},*/
	
	proxy: {
		type: 'jsonp',
		url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
		extraParams: {
			verb: 'templates'	
		}
	},
	
	groupers: [
		{
			property: 'category',
			direction: 'ASC'
		}
	]
})