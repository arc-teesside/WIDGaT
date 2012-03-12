/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.model.Widget', {
    extend: 'Ext.data.Model',
    fields: [
    		'id',
    		'version',
			'width',
			'height',
			'name',
			'description',
			'icon',
			'licence',
			'template'
    ],
    
    hasMany: [
        {model: 'WIDGaT.model.Author', name: 'authors'},
        {model: 'WIDGaT.model.Usecase', name: 'usecases'},
        {model: 'WIDGaT.model.Pipe', name: 'pipes'},
        {model: 'WIDGaT.model.Compo', name: 'components'}
    ],
	
	json4Serv: function() {
		var tmpMod = new Object();
		
		tmpMod.id = this.get('id');
		tmpMod.version = this.get('version');
		tmpMod.width = this.get('width');
		tmpMod.height = this.get('height');
		tmpMod.name = this.get('name');
		tmpMod.description = this.get('description');
		tmpMod.icon = this.get('icon');
		tmpMod.licence = this.get('licence');
		tmpMod.template = this.get('template');
		
		//Authors
		if(this.authors().getCount() > 0) {
			tmpMod.authors = new Array();
			this.authors().each(function(r) {
				tmpMod.authors.push(r.json4Serv());							 
			});
		}
		
		//Usecases
		if(this.usecases().getCount() > 0) {
			tmpMod.usecases = new Array();
			this.usecases().each(function(r) {
				tmpMod.usecases.push(r.json4Serv());							 
			});
		}
		
		//Pipes
		if(this.pipes().getCount() > 0) {
			tmpMod.pipes = new Array();
			this.pipes().each(function(r) {
				tmpMod.pipes.push(r.json4Serv());							 
			});
		}
		
		//Components
		if(this.components().getCount() > 0) {
			tmpMod.components = new Array();
			this.components().each(function(r) {
				tmpMod.components.push(r.json4Serv());							 
			});
		}
		
		return tmpMod;	
	}
});