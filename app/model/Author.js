/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Author', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'name', type: 'string' },
    	{ name: 'email', type: 'string' },
    	{ name: 'link', type: 'string' },
    	{ name: 'organisation', type: 'string' }
    ],
    
    belongsTo: ['WIDGaT.model.Compo', 'WIDGaT.model.Widget'],
	
	json4Serv: function() {
		var tmpAut = new Object()
			
		tmpAut.name = this.get('name');
		tmpAut.email = this.get('email');
		tmpAut.link = this.get('link');
		tmpAut.organisation = this.get('organisation');	
		
		return tmpAut
	}
});