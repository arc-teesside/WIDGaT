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
			ui: 'blue-panel',
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
					width:20,
					items: [{
						icon: 'resources/images/delete.png',
						tooltip: 'Delete',
						handler: function(grid, rowIndex, colIndex) {
							var rec = grid.getStore().getAt(rowIndex);
							alert("Terminate " + rec.get('name'));

							Ext.Ajax.request({
								url: 'file-remove.php',
								params: {
									'widgetID': WIDGaT.activeWidget.get('id'),
									'fileName': rec.get('name')
								},
								success: function(response) {
									if(WIDGaT.debug) console.log(response);
									
									Ext.getCmp('library-panel').loadMedia();
								},
								failure: function(response) {
									console.error(response);	
								}
							});
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
					tmpOL.url = "http://arc.tees.ac.uk/WIDEST/Widget/Output/"+WIDGaT.activeWidget.get('id')+'/media/'+file;
					var fileExt = file.substr(file.lastIndexOf('.')+1).toLowerCase();
					if(fileExt == "png" || fileExt == "jpg" || fileExt == "jpeg" || fileExt == "gif")
						tmpOL.type = "Image";
					else if(fileExt == "wav" || fileExt == "mp3" || fileExt == "ogg")
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