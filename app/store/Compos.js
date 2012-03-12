/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Compos', {
	extend: 'Ext.data.Store',
	model: 'WIDGaT.model.Compo',
	
	proxy: {
		type: 'jsonp',
		url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
		extraParams: {
			verb: 'components'	
		}
	},
	/*
	proxy: {
		type: 'ajax',
		url: 'data/compos.json'
	},
	
	/*sorters: [
		{
		    property: 'category',
		    direction: 'ASC'
		}
	],*/
	
	groupers: [
		{
		    property: 'category',
		    direction: 'ASC'
		}
	],
	
	getByClassName: function(className) {
        return (this.snapshot || this.data).findBy(function(record) {
			//return record.getId() === id;
			return record.get('className') === className;
        });
    }
})