/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.ExportWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.exportwindow',

    title : 'Export Widget',
    
    initComponent: function() {
		Ext.apply(this, {
			height: 270,
		 	width: 500,
			border: false,
			layout:'fit',
			closeAction: 'hide',
			items: Ext.create('WIDGaT.view.widget.Export'),
		});
        this.callParent(arguments);
    }
	
	
});