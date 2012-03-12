/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.template.List' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.templatelist',

    title : 'templates',
    
	initComponent: function() {

		Ext.apply(this, {
			id: 'template-list',
			layout: { 
				type: 'accordion',
				multi: true
			}
		});
		
		this.callParent(arguments);
	}
});