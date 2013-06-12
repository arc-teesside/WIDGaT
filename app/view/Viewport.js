/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.Viewport', {
    extend: 'Ext.Viewport',
	alias: 'widget.widgatviewport',
    layout: 'border',
    
    initComponent: function() {
        var me = this;
        
        Ext.apply(me, {
            items: [ 
				Ext.create('WIDGaT.view.widget.ViewWindow'),
                Ext.create('WIDGaT.view.MenuBar'),
				{	
					id: 'eastPanel',
					xtype: 'panel',
					border: false,
					region: 'east',
					margins:'5 5 5 0',
					split: true,
					width: 300,
					layout: 'border',
					disabled: true,
					collapsible: true,
					title: 'Edit',
					preventHeader: true,
					items: [
						Ext.create('WIDGaT.view.style.Edit'),
						Ext.create('WIDGaT.view.attribute.EditForm'),
						Ext.create('WIDGaT.view.library.LibraryGrid')
					]
				},
                Ext.create('WIDGaT.view.compo.List'),
                Ext.create('Ext.Panel', {
					id:'centerPanel',
                	region: 'center',
                	margins:'5 0 5 0',
					layout: 'border',
					disabled: true,
					border: false,
					items: [ 
						{
							xtype: 'panel',
							ui: 'blue-panel',
							title: 'Tasks',
							id: 'guidancePanel',
							region: 'north',
							split: true,
							layout: 'fit',
							collapsible: true,
							height: 120
						},
						{
							xtype: 'panel',
							region: 'center',
							id: 'centerGreyFill',
							bodyStyle: {
								background: "lightgrey"
							}
						}]
                }),
				Ext.create('WIDGaT.view.WelcomeWindow')
            ]
        });
                
        me.callParent(arguments);
    }
});