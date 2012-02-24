/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Compo', {
    extend: 'Ext.data.Model',
    fields: [
    	{ name: 'id' },
    	{ name: 'className', type: 'string' },
    	{ name: 'name', type: 'string' },
    	{ name: 'description', type: 'string' },
    	{ name: 'category', type: 'string', defaultValue: 'other' },
    	{ name: 'icon', type: 'string' },
    	{ name: 'placeHolder', type: 'string' },
    	{ name: 'html', type: 'string' },
    	{ name: 'javascript', type: 'string' },
    	{ name: 'stylesheet', type: 'string' }
    ],

    hasMany: [
        {model: 'WIDGaT.model.Author', name: 'authors'},
        {model: 'WIDGaT.model.Theme', name: 'themes'},
        {model: 'WIDGaT.model.Attribute', name: 'attributes'},
        {model: 'WIDGaT.model.Action', name: 'actions'},
        {model: 'WIDGaT.model.Guidance', name: 'guidances'},
        {model: 'WIDGaT.model.Dependency', name: 'dependencies'}
    ],
    
    belongsTo: ['WIDGaT.model.Widget'],
	
	json4Serv: function() {
		var tmpCp = new Object()
			
		tmpCp.id = this.get('id');
		tmpCp.className = this.get('className');
		tmpCp.name = this.get('name');
		tmpCp.description = this.get('description');
		tmpCp.category = this.get('category');
		tmpCp.icon = this.get('icon');
		tmpCp.placeHolder = this.get('placeHolder');
		tmpCp.html = this.get('html');
		tmpCp.javascript = this.get('javascript');
		tmpCp.stylesheet = this.get('stylesheet');
		
		//Authors
		if(this.authors().getCount() > 0) {
			tmpCp.authors = new Array();
			this.authors().each(function(r) {
				tmpCp.authors.push(r.json4Serv());							 
			});
		}
		
		//Themes
		if(this.themes().getCount() > 0) {
			tmpCp.themes = new Array();
			this.themes().each(function(r) {
				tmpCp.themes.push(r.json4Serv());							 
			});
		}
		
		//Attributes
		if(this.attributes().getCount() > 0) {
			tmpCp.attributes = new Array();
			this.attributes().each(function(r) {
				tmpCp.attributes.push(r.json4Serv());							 
			});
		}
		
		//Actions
		if(this.actions().getCount() > 0) {
			tmpCp.actions = new Array();
			this.actions().each(function(r) {
				tmpCp.actions.push(r.json4Serv());							 
			});
		}
		
		//Guidances
		if(this.guidances().getCount() > 0) {
			tmpCp.guidances = new Array();
			this.guidances().each(function(r) {
				tmpCp.guidances.push(r.json4Serv());							 
			});
		}
		
		//Dependencies
		if(this.dependencies().getCount() > 0) {
			tmpCp.dependencies = new Array();
			this.dependencies().each(function(r) {
				tmpCp.dependencies.push(r.json4Serv());							 
			});
		}
		
		return tmpCp;
	}
});