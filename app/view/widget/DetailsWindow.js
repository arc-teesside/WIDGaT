/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.DetailsWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.detailswindow',

    title : 'Widget Description',
    
    initComponent: function() {
		Ext.apply(this, {
			height: 324, //278
			width: 500,
			border: false,
			layout:'fit',
			items: Ext.create('WIDGaT.view.widget.Edit'),
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'details-save',
					text: 'Save'
				},
				{
					id: 'details-cancel',
					text: 'Cancel',
					handler: function(btn) {
						btn.up('detailswindow').close();	
					}
				}
			]
		});
        this.callParent(arguments);
    }
	
	
});