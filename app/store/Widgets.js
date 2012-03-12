/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Widgets', {
	extend: 'Ext.data.Store',
	model: 'WIDGaT.model.Widget',
	
	proxy: {
		type: 'ajax',
		url: 'data/widgets.json'
	}
})