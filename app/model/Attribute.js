/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Attribute', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'shortName', type: 'string' },
    	{ name: 'name', type: 'string' },
    	{ name: 'type', type: 'string' },
    	{ name: 'input', type: 'boolean', defaultValue: false },
    	{ name: 'output', type: 'boolean', defaultValue: false },
    	{ name: 'required', type: 'boolean', defaultValue: false },
    	'value'
    ],
    
    belongsTo: 'Compo',
	
	json4Serv: function() {
		var tmpAt = new Object()
			
		tmpAt.shortName = this.get('shortName');
		tmpAt.name = this.get('name');
		tmpAt.type = this.get('type');
		tmpAt.input = this.get('input');
		tmpAt.output = this.get('output');
		tmpAt.required = this.get('required');
		tmpAt.value = this.get('value');
			
		return tmpAt;
	}
});