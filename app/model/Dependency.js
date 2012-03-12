/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Dependency', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'name', type: 'string' }
    ],
    
    belongsTo: 'WIDGaT.model.Compo',
	
	json4Serv: function() {
		var tmpDe = new Object()
			
		tmpDe.name = this.get('name');
			
		return tmpDe;
	}
});