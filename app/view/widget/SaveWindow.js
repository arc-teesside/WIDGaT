/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.SaveWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.savewindow',

    title : 'Save Widget',
    
    initComponent: function() {
		Ext.apply(this, {
			height: 425,
		 	width: 500,
			border: false,
			layout:'fit',
			items: Ext.create('WIDGaT.view.widget.Save'),
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'save-save',
					text: 'Save'
				},
				{
					id: 'save-cancel',
					text: 'Cancel',
					handler: function(btn) {
						btn.up('savewindow').close();	
					}
				}
			]
		});
        this.callParent(arguments);
    }
	
	
});