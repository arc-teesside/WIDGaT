/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.template.Select' ,{
	extend: 'Ext.panel.Panel',
	alias : 'widget.selecttplpanel',
	
	
	initComponent: function() {
		Ext.apply(this, {
			border: false,
			autoScroll:true,
			id: 'template-list',
			items: [{
				xtype: 'panel',
				border: false,
				bodyStyle:'padding:5px 0 0 5px',
				html: '<h1>Select template</h1><br />'
			}]
		});
		this.callParent(arguments);
	}
});