/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.Save' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.widgetsave',

    initComponent: function() {
		Ext.apply(this, {
			bodyStyle:'padding:5px 5px 0',
			border: false,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				border: false,
				html: '<h1>Widget details</h1><span style="color:rgb(255, 0, 0);font-size:0.9em;">* mark required fields</span>'
			}, {
				id: 'saveWindow-title',
				name: 'title',
				fieldLabel: 'Title',
				labelSeparator: ': <span style="color:rgb(255, 0, 0);">*</span>',
	            allowBlank:false,
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Title</b><br />The title will also be the name of your widget. It will also be used in the template'
						});	
					}
				}
			}, {
				id: 'saveWindow-description',
				xtype: 'textareafield',
				fieldLabel: 'Description',
				name: 'description',
				anchor: '100%',
				margin: '5 0 0 0',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Description</b><br />A simple description of your widget'
						});	
					}
				}
			}, {
				xtype: 'displayfield',
				submitValue: false,
				html: 'Use case: <a href="#" onclick="Ext.getCmp(\'usecaseButton\').fireEvent(\'click\');return false;">Fill in the Use case</a>',
				anchor: '100%',
				margin: '5 0 0 0'
			},{
				xtype: 'fieldcontainer',
				defaultType: 'radiofield',
				margin: '5 0 0 0',
				defaults: {
					flex: 1
				},
				layout: 'hbox',
				items: [{
							xtype: 'displayfield',
							fieldLabel: 'Design status',
							submitValue: false
						}, {
							boxLabel: 'Work in Progress',
							name: 'completed',
							inputValue: false,
							checked: true
						}, {
							boxLabel: 'Completed',
							name: 'completed',
							inputValue: true
						}],
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Design Status</b><br />The design status allow the system to know whether you are done editing your widget or not. When set to completed, the widget is no longer editable by anyone. However, this allows you to share the link so that other people can start from a copy of your widget and make it their own. You will be prompt with several pre-selected websites where you can share or use your widget.'
						});	
					}
				}
			}, {
				xtype: 'panel',
				border: false,
				margin: '5 0 0 0',
				html: '<h1 >WIDGaT link to your Widget <img data-qtip="This link is your only way to get to your widget for further edition. It is strongly recommended that you bookmark or copy this link. When you have set your design status to \'Completed\', you can share this link to allow other people to adapt your widget. This will create a copy of your widget, Your widget as it is is no longer editable" class="qtip-target" style="vertical-align:middle" src="resources/images/qTip.png" role="presentation" /></h1><br />'
				
			}, {
				xtype: 'panel',
				border: false,
				bodyStyle: 'text-align: center',
				html: '<a href="http://arc.tees.ac.uk/WIDGaT/Tool/?w='+WIDGaT.activeWidget.get('id')+'">http://arc.tees.ac.uk/WIDGaT/Tool/?w='+WIDGaT.activeWidget.get('id')+'</a><br /><br />',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: 'This link is your only way to get to your widget for further edition. It is strongly recommended that you bookmark or copy this link. When you have set your design status to \'Completed\', you can share this link to allow other people to adapt your widget. This will create a copy of your widget, Your widget as it is is no longer editable'
						});	
					}
				}
			}, {
				xtype: 'container',
				anchor: '100%',
				layout:'column',
				style: {
					textAlign: 'center'
				},
				defaults: {
					columnWidth: 1/3
				},
				items:[{
					xtype: 'container',
					layout: 'anchor',
					//html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download',
					items: {
						xtype: 'button',
						id: 'btnBookmark',
						text: 'Bookmark link'
					}
				}, {
					xtype: 'container',
					layout: 'anchor',
					//html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download',
					items: {
						xtype: 'button',
						id: 'btnEmailMe',
						html: '<b>Email me!</b>'
					}
				}, {
					xtype: 'container',
					layout: 'anchor',
					//html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download',
					items: {
						xtype: 'button',
						id: 'btnCpClipboard',
						text: 'Copy to Clipboard'
					}
				}]
			}, {
				xtype: 'panel',
				border: false,
				margin: '5 0 0 0',
				html: '<h1>Download</h1><br />'
			}, {
				xtype: 'container',
				anchor: '100%',
				layout:'column',
				style: {
					textAlign: 'center'
				},
				defaults: {
					columnWidth: 0.5
				},
				items:[{
					xtype: 'container',
					layout: 'anchor',
					//html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download',
					items: {
						xtype: 'button',
						id: 'btnDownloadZip',
						html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download (.zip)',
						listeners: {
							'click': function () {
							
								/*var saveFrm = this.up('window').down('form').getForm();
								
								if(!saveFrm.hasInvalidField()) {
									var frmVals = saveFrm.getFieldValues();
									console.log(frmVals.completed);
									WIDGaT.activeWidget.set('name', frmVals.title);
									WIDGaT.activeWidget.set('description', frmVals.description);
									
									var tmpOb = new Object();
									tmpOb.name = WIDGaT.activeWidget.get('name');
									tmpOb.description = WIDGaT.activeWidget.get('description');
									
									Ext.data.JsonP.request({
										url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
										params: {
											'verb': 'modify',
											'name': WIDGaT.activeWidget.get('id'),
											'value': Ext.JSON.encode(tmpOb),
											'key': 'WIDGaT-918273645-911'
										},
										success: function(response) {
											console.log('Widget details saved successfully. response:', response);
											me.getViewWindow().setTitle(WIDGaT.activeWidget.get('name'));
										},
										failure: function(response) {
											console.log('An error occured while saving widget details. response:', response);	
										}
									});
								}*/
							
								/*Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'package',
										'name': WIDGaT.activeWidget.get('id'),
										'key': 'WIDGaT-918273645-911'
									},
									success: function(response) {
										if(WIDGaT.debug) console.log('Widget packaged successfully. response:', response);
										window.open(response.URL+'.zip','_blank','height=100,width=100');
									},
									failure: function(response) {
										if(WIDGaT.debug) console.log('An error occured while publishing the widget. response:', response);	
									}
								});*/
							},
							'render': function(cmp) {
								cmp.tip = Ext.create('Ext.tip.ToolTip', {
									target: cmp.el,
									showDelay: 0,
									trackMouse: true,
									dismissDelay: 0,
									hideDelay: 0,
									html: 'Download your widget as a Zip archive'
								});	
							}
						}
					}
				}, {
					xtype: 'container',
					layout: 'anchor',
					//html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download',
					items: {
						xtype: 'button',
						id: 'btnDownloadWgt',
						html: '<img src="resources/images/arDl.png" alt="Download" /><br />Download (.wgt)',
						listeners: {
							'click': function () {
								/*Ext.data.JsonP.request({
									url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
									params: {
										'verb': 'package',
										'name': WIDGaT.activeWidget.get('id'),
										'key': 'WIDGaT-918273645-911'
									},
									success: function(response) {
										if(WIDGaT.debug) console.log('Widget packaged successfully. response:', response);
										window.open(response.URL+'.wgt','_blank','height=100,width=100');
									},
									failure: function(response) {
										if(WIDGaT.debug) console.log('An error occured while publishing the widget. response:', response);	
									}
								});*/
							},
							'render': function(cmp) {
								cmp.tip = Ext.create('Ext.tip.ToolTip', {
									target: cmp.el,
									showDelay: 0,
									trackMouse: true,
									dismissDelay: 0,
									hideDelay: 0,
									html: 'Download your widget as a WGT file. Standard widget extension to use your widget with Opera or websites that uses this type of widget.'
								});	
							}
						}
					}
				}]
			}]
		});
        this.callParent(arguments);
    }
});