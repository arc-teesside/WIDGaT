/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Personas', {
    extend: 'Ext.data.Store',
    fields: ['short','name'],
    autoLoad:true,
	
	proxy: {
		type: 'ajax',
		url: 'data/personas.json'
	}
});