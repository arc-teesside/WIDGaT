/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.widgetedit',

    title : 'Widget Description',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'widget-form',
			bodyStyle:'padding:5px 5px 0',
			autoScroll: true,
			border: false,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			defaultType: 'textfield',
			items: [{
				id: 'title',
				fieldLabel: 'Title',
				name: 'title',
				anchor: '80%',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Title</b><br />The title will also be the name of your widget. It will also be used in the template'
						});	
					}
				}
			},{
				id: 'description',
				xtype: 'textareafield',
				fieldLabel: 'Description',
				name: 'description',
				anchor: '100%',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Description</b><br />A simple description of your widget'
						});	
					}
				}
			}, Ext.create('WIDGaT.view.author.Edit')]
		});
        this.callParent(arguments);
    }
});