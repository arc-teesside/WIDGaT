/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.Library' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.library',

    title : 'Library',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'library-panel',
			autoScroll: true,
			region: 'south',
			split: true,
			flex: 1,
			autoExpandColumn : 'name',
			viewConfig: {
				plugins: {
					ptype: 'gridviewdragdrop',
					ddGroup: 'depGridDD',
					dragText: 'Drag and drop to reorganize'
				}
			},
			columns: [
				{ header: 'Name',  dataIndex: 'name', flex: 1 },
				{ header: 'Type',  dataIndex: 'type' },
				{
					xtype:'actioncolumn',
					width:50,
					items: [{
						icon: 'resources/images/add.png',
						tooltip: 'Insert',
						handler: function(grid, rowIndex, colIndex) {
							var rec = grid.getStore().getAt(rowIndex);
							alert("Terminate " + rec.get('name'));
						}
					}, {
						icon: 'resources/images/delete.png',
						tooltip: 'Delete',
						handler: function(grid, rowIndex, colIndex) {
							var rec = grid.getStore().getAt(rowIndex);
							alert("Terminate " + rec.get('name'));
						}
					}]
				}
			],
			source: {},
			tools: [{
				type: 'plus',
				id: 'toolUpload',
				tooltip: 'Upload media'
			}],
			listeners: {
				scope: this,
				'render': function(cmp, eOpts) {
					//console.log('Library activated');
					
				}
			}
		});
        this.callParent(arguments);
    }
});