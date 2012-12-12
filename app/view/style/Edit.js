/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.style.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.styleedit',

    title : 'Component Style',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'style-form',
			autoScroll: true,
			region: 'north',
			split: true,
			flex: 1,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			bodyStyle: 'padding: 10 5 0 5;',
			defaultType: 'textfield',
			items: [
				Ext.create("WIDGaT.view.theme.ComboBox"),
				{
					xtype: 'container',
					style: {
						marginTop: '10px'
					},
					defaults: {
						margin: '0 8 0 0'
					},
					items:[{
						xtype: 'label',
						html: 'Text Align:'
					}, {
						xtype: 'button',
						id : 'justifyleft',
						tooltip: 'Align the text to the left',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-justifyleft',
						enableToggle: false,
						handler: function() {
							if(WIDGaT.selectedCompo) {
								var tmpO = {
									"root": "$['"+WIDGaT.selectedCompo.get('id')+"']",
									"text-align": "left"
								}
								
								Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'style',
										'name': WIDGaT.activeWidget.get('id'),
										'value': Ext.JSON.encode(tmpO),
										'key': 'WIDGaT-918273645-911'
									},
									success: function(response) {
										Ext.getCmp('iFrameWidgetView').setSrc();
									},
									failure: function(response) {
										console.error(response);	
									}
								});
							}
						}
					}, {
						xtype: 'button',
						itemId : 'justifycenter',
						tooltip: 'Align the text in center',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-justifycenter',
						enableToggle: false,
						handler: function() {
							if(WIDGaT.selectedCompo) {
								var tmpO = {
									"root": "$['"+WIDGaT.selectedCompo.get('id')+"']",
									"text-align": "center"
								}
								
								Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'style',
										'name': WIDGaT.activeWidget.get('id'),
										'value': Ext.JSON.encode(tmpO),
										'key': 'WIDGaT-918273645-911'
									},
									success: function(response) {
										Ext.getCmp('iFrameWidgetView').setSrc();
									},
									failure: function(response) {
										console.error(response);	
									}
								});
							}
						}
					}, {
						xtype: 'button',
						itemId : 'justifyright',
						tooltip: 'Align the text to the right',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-justifyright',
						enableToggle: false,
						handler: function() {
							if(WIDGaT.selectedCompo) {
								var tmpO = {
									"root": "$['"+WIDGaT.selectedCompo.get('id')+"']",
									"text-align": "right"
								}
								
								Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'style',
										'name': WIDGaT.activeWidget.get('id'),
										'value': Ext.JSON.encode(tmpO),
										'key': 'WIDGaT-918273645-911'
									},
									success: function(response) {
										Ext.getCmp('iFrameWidgetView').setSrc();
									},
									failure: function(response) {
										console.error(response);	
									}
								});
							}
						}
					}]
				}, {
					xtype: 'container',
					anchor: '100%',
					layout:'column',
					style: {
						textAlign: 'center',
						marginTop: '10px'
					},
					defaults: {
						columnWidth: 0.25
					},
					items:[{
						xtype: 'container',
						layout: 'anchor',
						style: {
							lineHeight: '22px',
							textAlign: 'left',
							verticalAlign: 'bottom'
						},
						html: 'Text:'
					}, {
						xtype: 'container',
						layout: 'anchor',
						style: {
							textAlign: 'left'
						},
						items: {
							xtype: 'splitbutton',
							text: '<div style="width: 14px; height: 14px; background-color: black; border: 1px solid black" id="text-color-picker"></div>',
							menu: new Ext.menu.Menu({
								items: [
									Ext.create('Ext.picker.Color', {
										value: '000000',
										listeners: {
											select: function(picker, selColor) {
												Ext.fly('text-color-picker').setStyle('background-color', selColor);
												if(WIDGaT.selectedCompo) {
													var tmpO = {
														"root": "$['"+WIDGaT.selectedCompo.get('id')+"']",
														"color": '#'+selColor
													}
													
													Ext.data.JsonP.request({
														url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
														params: {
															'verb': 'style',
															'name': WIDGaT.activeWidget.get('id'),
															'value': Ext.JSON.encode(tmpO),
															'key': 'WIDGaT-918273645-911'
														},
														success: function(response) {
															Ext.getCmp('iFrameWidgetView').setSrc();
														},
														failure: function(response) {
															console.error(response);	
														}
													});
												}
												Ext.menu.Manager.hideAll();
											}
										}
									})
								]
							})
						}
					}, {
						xtype: 'container',
						layout: 'anchor',
						style: {
							lineHeight: '22px',
							textAlign: 'left',
							verticalAlign: 'bottom'
						},
						html: 'Background:'
					}, {
						xtype: 'container',
						layout: 'anchor',
						items: {
							xtype: 'splitbutton',
							text: '<div style="width: 14px; height: 14px; background-color: white; border: 1px solid black" id="bg-color-picker"></div>',
							menu: new Ext.menu.Menu({
								items: [
									Ext.create('Ext.picker.Color', {
										value: '000000',
										listeners: {
											select: function(picker, selColor) {
												Ext.fly('bg-color-picker').setStyle('background-color', selColor);
												if(WIDGaT.selectedCompo) {
													var tmpO = {
														"root": "$['"+WIDGaT.selectedCompo.get('id')+"']",
														"background": '#'+selColor
													}
													
													Ext.data.JsonP.request({
														url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
														params: {
															'verb': 'style',
															'name': WIDGaT.activeWidget.get('id'),
															'value': Ext.JSON.encode(tmpO),
															'key': 'WIDGaT-918273645-911'
														},
														success: function(response) {
															Ext.getCmp('iFrameWidgetView').setSrc();
														},
														failure: function(response) {
															console.error(response);	
														}
													});
												}
												Ext.menu.Manager.hideAll();
											}
										}
									})
								]
							})
						}
					}]
				}, {
					xtype: 'combobox',
					fieldLabel: 'Display',
					queryMode: 'local',
					displayField: 'text',
					valueField: 'value',
					anchor: '100%',
					editable: false,
					style: {
						marginTop: '10px'
					},
					store: Ext.create('Ext.data.Store', {
						fields: ['value', 'text'],
						data : [
							{"value":"block", "text":"Block"},
							{"value":"inline", "text":"Inline"}
						]
					})
				}, {
					xtype: 'container',
					style: {
						marginTop: '10px'
					},
					defaults: {
						margin: '0 8 0 0'
					},
					items:[{
						xtype: 'label',
						html: 'Block Align:'
					}, {
						xtype: 'button',
						itemId : 'displayleft',
						tooltip: 'Align the component to the left',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-displayleft',
						enableToggle: false
					}, {
						xtype: 'button',
						itemId : 'displaycenter',
						tooltip: 'Align the component in center',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-displaycenter',
						enableToggle: false
					}, {
						xtype: 'button',
						itemId : 'displayright',
						tooltip: 'Align the component to the right',
						cls : Ext.baseCSSPrefix + 'btn-icon',
						iconCls: Ext.baseCSSPrefix + 'edit-displayright',
						enableToggle: false
					}]
				}
			],
			listeners: {
				scope: this,
				'render': function(cmp) {
					/*cmp.tip = Ext.create('Ext.tip.ToolTip', {
						target: cmp.el,
						showDelay: 0,
						trackMouse: true,
						dismissDelay: 0,
						hideDelay: 0,
						html: '<b>Component Style</b><br />The component\'s style is not yet supported. This is only as an example.'
					});*/
				}
			}
		});
        this.callParent(arguments);
    }
});