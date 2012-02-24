/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Pipe', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'from', type: 'string' },
    	{ name: 'to', type: 'string' }
    ],
    
    belongsTo: 'WIDGaT.model.Widget',
	
	json4Serv: function() {
		var tmpPi = new Object()
			
		tmpPi.from = this.get('from');
		tmpPi.to = this.get('to');
			
		return tmpPi;
	}
});