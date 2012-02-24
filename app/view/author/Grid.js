/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.author.Grid' ,{
	extend: 'Ext.grid.Panel',
	alias : 'widget.authorgrid',
	
	
	initComponent: function() {
		Ext.apply(this, {
			store: Ext.data.StoreManager.lookup('Authors'),
		    columns: [
		        { header: 'Name',  dataIndex: 'name', field: 'textfield' },
		        { header: 'Email', dataIndex: 'email', field: 'textfield' },
		        { header: 'Link', dataIndex: 'link', field: 'textfield' },
		        { header: 'Organisation', dataIndex: 'organisation', field: 'textfield' }
		    ],
		    selType: 'rowmodel',
		    plugins: [
		        Ext.create('Ext.grid.plugin.RowEditing', {
		            clicksToEdit: 1
		        })
		    ],
		    height: 200,
		    width: 400,
		    fieldLabel: 'Authors',
			labelAlign: 'top'
		});
		this.callParent(arguments);
	}
});