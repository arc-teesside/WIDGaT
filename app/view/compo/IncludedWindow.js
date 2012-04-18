/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.compo.IncludedWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.includedwindow',

    title : 'Included Components',
    
    initComponent: function() {
		
		Ext.apply(this, {
			id: 'included-compo',
			height: 300,
			width: 200,
			border: false,
			layout:'fit',
			items: [
				{
					xtype: 'grid',
					id: 'included-compo-grid',
					store: WIDGaT.activeWidget.components(),
					columns: [
						{ header: 'Name', dataIndex: 'id', flex: 1 }
					]
				}
			]
		});
		
		this.callParent(arguments);
  }
  
  

});