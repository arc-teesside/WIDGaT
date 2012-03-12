/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Theme', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'name', type: 'string' },
    	{ name: 'file', type: 'string' }
    ],
    
    belongsTo: 'WIDGaT.model.Compo',
	
	json4Serv: function() {
		var tmpTh = new Object()
			
		tmpTh.name = this.get('name');
		tmpTh.file = this.get('file');
			
		return tmpTh;
	}
});