/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.ViewWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.viewwindow',

    title : 'Widget',
	ui: 'blue-window',
    
    initComponent: function() {
		Ext.apply(this, {
					id: 'stageFrame',
					disabled: true,
					autoShow: true,
					closable: false,
					width: 400,
					height: 500,
					layout: 'fit',
					maximizable: true,
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
					items: Ext.create('WIDGaT.view.widget.View'),
					maximize: function() {
						var me = this;

						if (!me.maximized) {
							me.expand(false);
							if (!me.hasSavedRestore) {
								me.restoreSize = me.getSize();
								me.restorePos = me.getPosition(true);
							}
							if (me.maximizable) {
								me.tools.maximize.hide();
								me.tools.restore.show();
							}
							me.maximized = true;
							me.el.disableShadow();

							if (me.dd) {
								me.dd.disable();
							}
							if (me.collapseTool) {
								me.collapseTool.hide();
							}
							me.el.addCls(Ext.baseCSSPrefix + 'window-maximized');
							me.container.addCls(Ext.baseCSSPrefix + 'window-maximized-ct');

							me.syncMonitorWindowResize();
							/*me.setPosition(0, 0);
							me.fitContainer();*/
							var cmpPos = Ext.getCmp('centerGreyFill').getPosition();
							
							me.setPosition(cmpPos[0], cmpPos[1]);
							me.fitContainer();
							//me.setWidth(Ext.getCmp('centerGreyFill').getWidth());
							//me.setHeight(Ext.getCmp('centerGreyFill').getHeight());
							//console.log('Position', Ext.getCmp('centerGreyFill').getWidth(), Ext.getCmp('centerGreyFill').getHeight());
							me.fireEvent('maximize', me);
						}
						return me;
					},
					fitContainer: function() {
						/*var parent = this.floatParent,
							container = parent ? parent.getTargetEl() : this.container,
							size = container.getViewSize(false);*/

						this.setSize(Ext.getCmp('centerGreyFill').getSize());
					}
		});
        this.callParent(arguments);
    }
	
	
});