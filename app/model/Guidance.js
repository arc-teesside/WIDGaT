/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Guidance', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'priority', type: 'string' },
    	{ name: 'text', type: 'string' },
    	{ name: 'shortName', type: 'string' }
    ],
    
    belongsTo: 'WIDGaT.model.Compo',
	
	json4Serv: function() {
		var tmpGu = new Object()
			
		tmpGu.priority = this.get('priority');
		tmpGu.text = this.get('text');
		tmpGu.shortName = this.get('shortName');
			
		return tmpGu;
	}
});