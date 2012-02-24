/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.MetaWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.metawindow',

    title : 'Widget Usecase',
    
    initComponent: function() {
		Ext.apply(this, {
			height: 278,
			width: 500,
			border: false,
			layout:'fit',
			items: Ext.create('WIDGaT.view.usecase.Edit'),
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'meta-save',
					text: 'Save'
				},
				{
					id: 'meta-cancel',
					text: 'Cancel',
					handler: function(btn) {
						btn.up('metawindow').close();	
					}
				}
			]
		});
        this.callParent(arguments);
    }
	
	
});