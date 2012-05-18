/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Choice', {
    extend: 'Ext.data.Model',
	fields: ['str'],
	
    associations: [
        { type: 'belongsTo', model: 'WIDGaT.model.Attribute' }
    ],
	
	json4Serv: function() {
		var tmpCh = new Object()
			
		tmpCh.str = this.get('str');
			
		return tmpCh;
	}
});