/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Attributes', {
    extend: 'Ext.data.Store',
    model: 'WIDGaT.model.Attribute',
    sorters: [
    	{
		    property: 'name',
		    direction: 'ASC'
		}, {
		    property: 'name',
		    direction: 'DESC'
		}, {
		    property: 'value',
		    direction: 'ASC'
		}, {
		    property: 'value',
		    direction: 'DESC'
		}
    ]
});