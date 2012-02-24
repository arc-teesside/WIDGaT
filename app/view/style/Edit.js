/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.style.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.styleedit',

    title : 'Component Style',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'style-form',
			flex: 1,
			autoScroll: true,
			border: false,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			bodyStyle: 'margin: 10 5 0 5;border:none;',
			defaultType: 'textfield',
			items: [Ext.create("WIDGaT.view.theme.ComboBox")],
			listeners: {
				scope: this,
				'render': function(cmp) {
					cmp.tip = Ext.create('Ext.tip.ToolTip', {
						target: cmp.el,
						showDelay: 0,
						trackMouse: true,
						dismissDelay: 0,
						hideDelay: 0,
						html: '<b>Component Style</b><br />The component\'s style is not yet supported. This is only as an example.'
					});	
				}
			}
		});
        this.callParent(arguments);
    }
});