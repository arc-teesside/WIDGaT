/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Usecase', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'persona', type: 'string' },
    	{ name: 'scenario', type: 'string' },
    	{ name: 'keywords', type: 'string' }
    ],
    
    belongsTo: 'WIDGaT.model.Widget',
	
	json4Serv: function() {
		var tmpUc = new Object()
			
		tmpUc.keywords = this.get('keywords');
		tmpUc.persona = this.get('persona');
		tmpUc.scenario = this.get('scenario');
			
		return tmpUc;
	}
});