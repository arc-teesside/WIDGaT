/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.library.LibraryGrid' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.librarygrid',

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
					ptype: 'gridviewdragdrop'/*,
					ddGroup: 'depGridDD',
					dragText: 'Drag and drop to reorganize'*/
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
							var recName = rec.get('name');
							
							var recExt = recName.substr(recName.lastIndexOf('.')+1);
							recExt.toLowerCase();
							
							
								if(recExt == "png" || recExt == "jpeg" || recExt == "jpg" || recExt == "gif") {
									console.log('add img cmp');
									
									
								} else if(recExt == "wav" || recExt == "mp3") {
									console.log('add sound cmp');
									
									
								}
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
    },
	
	loadMedia: function() {
		var me = this;
		
		//Load library
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'media',
				'name': WIDGaT.activeWidget.get('id'),
				'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				var arLibrary = new Array();
				Ext.each(response.files, function(file, index) {
					var tmpOL = new Object();
					tmpOL.name = file;
					
					var fileExt = file.substr(file.lastIndexOf('.')+1).toLowerCase();
					if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif")
						tmpOL.type = "Image";
					else if(fileExt == "wav" || fileExt == "mp3")
						tmpOL.type = "Sound";
					else
						tmpOL.type = "Other";
					arLibrary.push(tmpOL);
				});
				me.getStore().loadData(arLibrary);
			}
		});
	}
});