/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.ViewWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.viewwindow',

    title : 'Widget',
    
    initComponent: function() {
		Ext.apply(this, {
					id: 'stageFrame',
					disabled: true,
					autoShow: true,
					closable: false,
					width: 400,
					height: 500,
					layout: 'fit',
					y: 170,
					x: 210,
					style: {
						margin: 'auto'
					},
					bodyStyle: {
						background: "white"
					},
					tools:[{
							type:'preview',
							id: 'toolPreview',
							tooltip: 'Preview widget'
						}, {
							type:'refresh',
							id: 'toolRefresh',
							tooltip: 'Refresh widget view'
					}],
					/*{
						type:'prev',
						tooltip: 'Delete component',
						handler: function(event, toolEl, panel){
							if(WIDGaT.selectedCompo) {
								Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'remove',
										'name': WIDGaT.activeWidget.get('id'),
										'value': Ext.JSON.encode(new Array(WIDGaT.selectedCompo.get('id')))
									},
									success: function(response) {
										if(WIDGaT.debug) console.log('Widget details saved successfully. response:', response);
										WIDGaT.activeWidget.components().remove(WIDGaT.selectedCompo);
										var MIF = Ext.ComponentQuery.query('#stageFrame > miframe')[0];
										MIF.setSrc();
									},
									failure: function(response) {
										if(WIDGaT.debug) console.log('An error occured while saving widget details. response:', response);	
									}
								});
							}
						}
					}],*/
					items: Ext.create('WIDGaT.view.widget.View')
		});
        this.callParent(arguments);
    }
	
	
});