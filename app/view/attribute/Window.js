/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.Window' ,{
	extend: 'Ext.window.Window',
	alias : 'widget.outputwindow',
	
	title : 'Outputs',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			height: 330,
			width: 280,
			layout: 'fit',
			bbar: [
				'->',
				{
					id: 'attribute-select',
					text: 'Select',
					disabled: true
				},
				{
					id: 'attribute-cancel',
					text: 'Cancel',
					disabled: false,
					handler: function(btn) {
						btn.up('window').close();
					}
				}
			]
		});
		this.callParent(arguments);
	}
});