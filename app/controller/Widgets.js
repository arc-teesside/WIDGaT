/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Widgets', {
	extend: 'Ext.app.Controller',
	
    models: ['Widget', 'Usecase', 'Pipe', 'Compo', 'Action', 'Attribute', 'Author', 'Dependency', 'Guidance', 'Choice'],
    stores: ['Widgets', 'Usecases', 'Pipes', 'Compos', 'Actions', 'Attributes', 'Authors', 'Dependencies', 'Guidances', 'Choices'],
	
	views: [
        'widget.MetaWindow'
    ],
	
    refs: [
        {ref: 'attributeList', selector: 'attrlist'},
        {ref: 'metaWindow', selector: 'metawindow'},
        {ref: 'newWindow', selector: 'newwindow'},
        {ref: 'includedWindow', selector: 'includedwindow'},
        {ref: 'saveWindow', selector: 'savewindow'},
        {ref: 'detailsWindow', selector: 'detailswindow'},
        {ref: 'exportWindow', selector: 'exportwindow'},
        {ref: 'guidanceList', selector: 'guidancelist'},
        {ref: 'widgetView', selector: 'widgetview'},
		{ref: 'widgetViewport', selector: 'widgatviewport'},
		{ref: 'viewWindow', selector: 'viewwindow'},
		{ref: 'selectTplPanel', selector: 'selecttplpanel'},
		{ref: 'guidancePanel', selector: '#guidancePanel'},
		{ref: 'includedCompoGrid', selector: '#included-compo-grid'}
    ],

    init: function() {
    	var me = this;
        me.control({
			'templateDataView': {
				itemclick: me.onTemplateItemClick,
				containerclick: me.onTemplateContainerClick
			},
            '#usecaseButton': {
                click: me.onUsecaseButtonClick
            },
            '#includedButton': {
                click: me.onIncludedButtonClick
            },
            '#widgetDetailsButton': {
                click: me.onWidgetDetailsButtonClick
            },
            '#details-save': {
    			click: me.onDetailsSaveButtonClick
    		},
            '#meta-save': {
    			click: me.onUsecaseSaveButtonClick
    		},
            '#newButton': {
    			click: me.onNewButtonClick
    		},
            '#startButton': {
    			click: me.onNewButtonClick
    		},
            '#previewButton': {
    			click: me.onPreviewButtonClick
    		},
            '#toolPreview': {
    			click: me.onPreviewButtonClick
    		},
            '#saveButton': {
    			click: me.onSaveButtonClick
    		},
            '#exportButton': {
    			click: me.onExportButtonClick
    		},
            '#closeButton': {
    			click: me.onCloseButtonClick
    		},
            '#undoButton': {
    			click: me.onUndoButtonClick
    		},
            '#save-save': {
    			click: me.onSaveWidgetClick
    		},
            '#btnBookmark': {
    			click: me.onBookmarkButtonClick
    		},
    		'#move-finish': {
    			click: me.onFinishButtonClick
    		},
			'#toolRefresh': {
				click: me.onToolRefreshClick
			},
			'#toolBin': {
				click: me.onToolBinClick	
			},
			'compolist': {
				dropped: me.onCompoDropped,
				moved: me.onCompoMoved
			},
			'widgatviewport': {
				afterrender: me.onViewportAfterRender
			},
			'savewindow': {
				beforeclose: function() {
					if(WIDGaT.debug) console.log('savewindow.beforeclose');
					me.getWidgetView().setSrc();	
				}
			}
        });
        /*this.getWidgetsStore().load();
        if(WIDGaT.debug) console.log(this.getWidgetsStore());*/
		this.getWidgetsStore().on({
			 load: me.onWidgetStoreLoad,
			 scope: me
		});
    },
    
	onViewportAfterRender: function() {
		var reqStr = Ext.urlDecode(window.location.search.substring(1));
		
		var me = this;
		if(reqStr.w) {
			if(WIDGaT.debug) console.log('Loading widget id:', reqStr.w);
			Ext.data.JsonP.request({
				url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
				params: {
					'verb': 'refresh',
					'name': reqStr.w,
					'key': 'WIDGaT-918273645-911'
				},
				success: function(response) {
					if(window.location.hostname != "localhost")
						me.getWidgetView().setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + response.id + '/');
						
					var tmpStore = Ext.create('WIDGaT.store.Widgets');
					tmpStore.loadRawData(response);
					WIDGaT.activeWidget = tmpStore.first();
					me.getWidgetsStore().loadRawData(response);
					//WIDGaT.activeWidget = me.getWidgetsStore().first();
					if(WIDGaT.debug) console.log("Widget successfuly loaded with id:", WIDGaT.activeWidget.internalId);
					if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
					Ext.getCmp('urlDisplay').setText('<a data-qtip="This link allows you to directly open your widget in WIDGaT. It is strongly recommended to save it somewhere sure" href="http://arc.tees.ac.uk/WIDGaT/Tool/?w=' + response.id + '/" target="_blank" >http://arc.tees.ac.uk/WIDGaT/Tool/?w=' + response.id + '/</a>');
					Ext.getCmp('welcomeWindow').close();
					
					//populating ActionStore
					WIDGaT.actionStore = Ext.create('WIDGaT.store.Actions');
					WIDGaT.outputStore = Ext.create('WIDGaT.store.Attributes');
					
					WIDGaT.activeWidget.components().each(function(record) {
						record.actions().each(function(action) { 
							WIDGaT.actionStore.add(action);
						});
						
						record.attributes().each(function(attr) {
							if(attr.get('output'))
								WIDGaT.outputStore.add(attr);
						});
					});
					
					if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
					//Ext.ComponentManager.get('cbActions').bindStore(WIDGaT.actionStore);
					me.getViewWindow().setTitle(WIDGaT.activeWidget.get('name'));
					me.activeTool();
				},
				failure: function(response) {
					if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
				}
			});
		}
	},
	
    onNewButtonClick: function() {
    	if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onNewButtonClick()");
		
		var me = this;
		
		if(WIDGaT.activeWidget) {
			Ext.MessageBox.confirm('Confirm',
			'You are currently editing a widget. Are you sure you want to create a new one ?',
			function(btn) {
				if(btn=='yes') {
					WIDGaT.activeWidget = null;
					WIDGaT.selectedCompo = null;
					me.disableTool();
					Ext.create('WIDGaT.view.widget.NewWindow').show();
				}
			});
		} else {
			Ext.create('WIDGaT.view.widget.NewWindow').show();
		}
    	
    },
	
	//File Menu preview button
    onPreviewButtonClick: function() {
    	if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onPreviewButtonClick()");
		window.open('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + WIDGaT.activeWidget.get('id') + '/','_blank','',true); //(url, target, options, history.replace)
    },
	
	//File Menu close button
    onCloseButtonClick: function() {
    	if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onCloseButtonClick()");
		var me = this;
		if(WIDGaT.activeWidget) {
			Ext.MessageBox.confirm('Confirm',
			'You are currently editing a widget. Make sure you keep the widget\'s URL. Close ?',
			function(btn) {
				if(btn=='yes') {
					WIDGaT.activeWidget = null;
					WIDGaT.newWidget = null;
					me.disableTool();
					Ext.create('WIDGaT.view.WelcomeWindow').show();
				}
			});
		}
    },
	
    //Widget Save Window
    onSaveButtonClick: function() {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onSaveButtonClick()");
		if(this.getSaveWindow())
			this.getSaveWindow().focus();
		else {
			var winS = Ext.create('WIDGaT.view.widget.SaveWindow');
			
			winS.down('#saveWindow-title').setValue(WIDGaT.activeWidget.get('name'));
			winS.down('#saveWindow-description').setValue(WIDGaT.activeWidget.get('description'));
			
			winS.show();
		}
    },
	
    //Widget Save Window
    onExportButtonClick: function() {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onExportButtonClick()");
		if(this.getExportWindow())
			this.getExportWindow().focus();
		else {
			Ext.create('WIDGaT.view.widget.ExportWindow').show();
		}
    },
	
    onSaveWidgetClick: function(btn) {
    	//Save details
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onSaveWidgetClick()");
		
		var me = this;
		var _btn = btn;
		var saveFrm = btn.up('window').down('form').getForm();
		
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
			
			if(frmVals.completed){
				Ext.MessageBox.confirm('Confirm',
				'You chose to update the design status of your widget as \'Completed\'. This mean that your widget will no longer be editable. However, you can share this link and allow other users to start from a copy of your widget and adapt it as they see fit. Do you wish to continue ?',
				function(btn) {
					if(btn=='yes') {
						//send completed to server
						
						if(WIDGaT.activeWidget.usecases().first()) {
							var useC = WIDGaT.activeWidget.usecases().first()
							if(useC.get('persona') == '' || useC.get('scenario') == '' || useC.get('keywords') == '') {
								Ext.MessageBox.confirm('Confirm',
								'Warning! You can\'t complete your widget without usecase. Do you wish to fill it now ?',
								function(btn) {
									if(btn=='yes') {
										Ext.getCmp('usecaseButton').fireEvent('click');
										//Ext.create('WIDGaT.view.widget.MetaWindow').show();
									}
								});
							} else {
								Ext.MessageBox.confirm('Confirm',
								'Congratulations! You have completed your widget. You are now able to export and share it to several different website. Do you wish to do so ?',
								function(btn) {
									if(btn=='yes') {
										//send completed to server
										Ext.getCmp('exportButton').fireEvent('click');
										_btn.up('window').close();
										//Ext.create('WIDGaT.view.widget.ExportWindow').show();
									}
								});
							}
						}
					}
				});
			} else { _btn.up('window').close(); }
		}
		if(WIDGaT.debug) console.log('After save widget, activeWidget:', WIDGaT.activeWidget);
    },
	
	onBookmarkButtonClick: function() {
		alert("Use ctrl+D");
    },
	
	//Widget Description Window
	onWidgetDetailsButtonClick: function (btn) {
		console.log("WIDGaT.controller.Widget.onWidgetDetailsButtonClick()");
		if(this.getDetailsWindow())
			this.getDetailsWindow().focus();
		else {
			var winD = Ext.create('WIDGaT.view.widget.DetailsWindow');
			winD.down('widgetedit').setTitle('');
			winD.down('#title').setValue(WIDGaT.activeWidget.get('name'));
			winD.down('#description').setValue(WIDGaT.activeWidget.get('description'));
			if(WIDGaT.activeWidget.authors().getCount() > 0) {
				winD.down('#name').setValue(WIDGaT.activeWidget.authors().first().get('name'));
				winD.down('#email').setValue(WIDGaT.activeWidget.authors().first().get('email'));
				winD.down('#authorLink').setValue(WIDGaT.activeWidget.authors().first().get('link'));
				winD.down('#organisation').setValue(WIDGaT.activeWidget.authors().first().get('organisation'));
			}
			winD.show();
		}
    },
    
    onDetailsSaveButtonClick: function(btn) {
    	//Save details
		console.log("WIDGaT.controller.Widget.onDetailsSaveButtonClick()");
		
		var me = this;
		
		WIDGaT.activeWidget.set('name', btn.up('window').down('#title').getValue());
		WIDGaT.activeWidget.set('description', btn.up('window').down('#description').getValue());
		
		WIDGaT.activeWidget.authors().first().set('name', btn.up('window').down('#name').getValue());
		WIDGaT.activeWidget.authors().first().set('email', btn.up('window').down('#email').getValue());
		WIDGaT.activeWidget.authors().first().set('link', btn.up('window').down('#authorLink').getValue());
		WIDGaT.activeWidget.authors().first().set('organisation', btn.up('window').down('#organisation').getValue());
		
		console.log('After save details, activeWidget:', WIDGaT.activeWidget);
		console.log('                    activeWidget.authors:', WIDGaT.activeWidget.authors().first());
		
		//Send modif to server
		var tmpO = new Object();
		tmpO.name = WIDGaT.activeWidget.get('name');
		tmpO.description = WIDGaT.activeWidget.get('description');
		tmpO.authors = new Array(WIDGaT.activeWidget.authors().first().json4Serv());
		
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'modify',
				'name': WIDGaT.activeWidget.get('id'),
				'value': Ext.JSON.encode(tmpO),
				'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				console.log('Widget details saved successfully. response:', response);
				me.getViewWindow().setTitle(WIDGaT.activeWidget.get('name'));
				me.getWidgetView().setSrc();
				/*var MIF = Ext.ComponentQuery.query('#stageFrame > miframe')[0];
				MIF.setSrc();*/
			},
			failure: function(response) {
				console.log('An error occured while saving widget details. response:', response);	
			}
		});
		
		btn.up('window').close();
    },
    
	//Usecase Window
    onUsecaseButtonClick: function () {
		console.log("WIDGaT.controller.Widget.onUsecaseButtonClick()");
		
		if(this.getMetaWindow())
			this.getMetaWindow().focus();
		else {
			var win = Ext.create('WIDGaT.view.widget.MetaWindow');
			if(WIDGaT.activeWidget.usecases().getCount() > 0)
				win.down('usecaseedit').loadRecord(WIDGaT.activeWidget.usecases().first());
			win.down('usecaseedit').setTitle('');
			win.show();
		}
    },
    
	//Usecase Window
    onIncludedButtonClick: function () {
		console.log("WIDGaT.controller.Widget.onIncludedButtonClick()");
		
		if(this.getIncludedWindow())
			this.getIncludedWindow().focus();
		else {
			var win = Ext.create('WIDGaT.view.compo.IncludedWindow');
			/*if(WIDGaT.activeWidget.usecases().getCount() > 0)
				win.down('usecaseedit').loadRecord(WIDGaT.activeWidget.usecases().first());
			win.down('usecaseedit').setTitle('');*/
			win.show();
		}
    },
	
	onUsecaseSaveButtonClick: function(btn) {
    	//Save metadata
		console.log("WIDGaT.controller.Widget.onUsecaseSaveButtonClick()");
		
		if(WIDGaT.activeWidget.usecases().getCount() == 0) {
			var uC = Ext.create('WIDGaT.model.Usecase');
			uC.set('keywords', Ext.getCmp('txt_keywords').getValue());
			uC.set('persona', Ext.getCmp('persona').getValue());
			uC.set('scenario', Ext.getCmp('scenario').getValue());
			
			WIDGaT.activeWidget.usecases().add(uC);	
		} else {
			WIDGaT.activeWidget.usecases().first().set('keywords', Ext.getCmp('txt_keywords').getValue());
			WIDGaT.activeWidget.usecases().first().set('persona', Ext.getCmp('persona').getValue());
			WIDGaT.activeWidget.usecases().first().set('scenario', Ext.getCmp('scenario').getValue());
		}
		
		console.log('After save meta, activeWidget:', WIDGaT.activeWidget);
		console.log('        activeWidget.usecases:', WIDGaT.activeWidget.usecases().first());
		
		var tmpObj = new Object();
		tmpObj.usecases = new Array(WIDGaT.activeWidget.usecases().first().json4Serv());
		
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'modify',
				'name': WIDGaT.activeWidget.get('id'),
				'value': Ext.JSON.encode(tmpObj),
				'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				console.log('Usecase saved successfully. response:', response);
			},
			failure: function(response) {
				console.log('An error occured while saving usecase. response:', response);	
			}
		});
		
		btn.up('window').close();
    },
	
	//New Widget Window
	onTemplateItemClick: function (view, record, htmlItem, index) {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onTemplateItemClick()");
		var vt = this.getNewWindow().down('selecttplpanel');
		Ext.each(vt.items.items, function(i) {
			if(i.down('templateDataView'))
				i.down('templateDataView').getSelectionModel().deselectAll();
		});
		view.select(index);
		WIDGaT.selectedTemplate = record;
		Ext.getCmp('move-next').setDisabled(false);
		Ext.getCmp('move-finish').setDisabled(false);
	},
	
	onTemplateContainerClick: function (view, e) {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onTemplateContainerClick()");
		var vt = this.getNewWindow().down('selecttplpanel');
		Ext.each(vt.items.items, function(i) {
			if(i.down('templateDataView'))
				i.down('templateDataView').getSelectionModel().deselectAll();
		});
		WIDGaT.selectedTemplate = null;
		Ext.getCmp('move-next').setDisabled(true);
		Ext.getCmp('move-finish').setDisabled(true);
	},
    
    onFinishButtonClick: function(btn) {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onFinishButtonClick(btn)", btn);
		
		var layout = btn.up('window').getLayout();
		
		var vals = layout.getLayoutItems()[1].getForm().getFieldValues();
		if(vals.title.length)
			WIDGaT.newWidget.set('name', vals.title);
		if(vals.description.length)
			WIDGaT.newWidget.set('description', vals.description);
		
		if(vals.name.length || vals.email.length || vals.link.length || vals.organisation.length) {
			var aut = Ext.create('WIDGaT.model.Author');
			if(vals.name.length)
				aut.set('name', vals.name);
			if(vals.email.length)
				aut.set('email', vals.email);
			if(vals.link.length)
				aut.set('authorLink', vals.link);
			if(vals.organisation.length)
				aut.set('organisation', vals.organisation);
			WIDGaT.newWidget.authors().add(aut);
		}
		
		var me = this;
		
		var uC = Ext.create('WIDGaT.model.Usecase');
		
		if(Ext.isEmpty(Ext.getCmp('txt_keywords').getValue()))
			uC.set('keywords', WIDGaT.selectedTemplate.get('keywords'));
		else
			uC.set('keywords', Ext.getCmp('txt_keywords').getValue());
		
		uC.set('persona', Ext.getCmp('persona').getValue());
		uC.set('scenario', Ext.getCmp('scenario').getValue());
		
		console.log('WIDGaT.selectedTemplate', WIDGaT.selectedTemplate);
		console.log("keywords: ", Ext.getCmp('txt_keywords').getValue(), uC.get('keywords'));
		
		WIDGaT.newWidget.usecases().add(uC);
		
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'create',
				'name': WIDGaT.selectedTemplate.get('name'),
				'value': Ext.JSON.encode(WIDGaT.newWidget.json4Serv()),
				'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				var tmpStore = Ext.create('WIDGaT.store.Widgets');
				tmpStore.loadRawData(response);
				WIDGaT.activeWidget = tmpStore.first();
				me.getWidgetsStore().loadRawData(response);
				//WIDGaT.activeWidget = me.getWidgetsStore().first();
				if(WIDGaT.debug) console.log("Widget successfuly created with id:", WIDGaT.activeWidget.internalId);
				if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
				Ext.getCmp('urlDisplay').setText('<a data-qtip="This link allows you to directly open your widget in WIDGaT. It is strongly recommended to save it somewhere sure" href="http://arc.tees.ac.uk/WIDGaT/Tool/?w=' + response.id + '/" target="_blank" >http://arc.tees.ac.uk/WIDGaT/Tool/?w=' + response.id + '/</a>');
				if(Ext.getCmp('welcomeWindow'))
					Ext.getCmp('welcomeWindow').close();
					
				if(window.history.pushState) {
					if(window.location.hostname == "localhost")
						window.history.pushState({}, "", 'http://localhost/WIDGaT/?w=' + response.id);
					else
						window.history.pushState({}, "", 'http://arc.tees.ac.uk/WIDGaT/Tool/?w=' + response.id);
				}
				//populating ActionStore
				/*WIDGaT.actionStore = Ext.create('WIDGaT.store.Actions');
				WIDGaT.outputStore = Ext.create('WIDGaT.store.Attributes');
				
				WIDGaT.activeWidget.components().each(function(record) {
					record.actions().each(function(action) { 
						WIDGaT.actionStore.add(action);
					});
					
					record.attributes().each(function(attr) {
						if(attr.get('output'))
							WIDGaT.outputStore.add(attr);
					});
				});*/
				me.updateGlobalStores();
				me.getViewWindow().setWidth(WIDGaT.activeWidget.get('width') + 100);
				me.getViewWindow().setHeight(WIDGaT.activeWidget.get('height') + 40);
				me.getViewWindow().setTitle(WIDGaT.activeWidget.get('name'));
				if(window.location.hostname != "localhost")
					me.getWidgetView().setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + WIDGaT.activeWidget.get('id') + '/');
				if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
				//Ext.ComponentManager.get('cbActions').bindStore(WIDGaT.actionStore);
				me.activeTool();
			},
			failure: function(response) {
				if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
			}
		});
		
		btn.up('window').close();
    },
	
	onToolRefreshClick: function() {
		var me = this;
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'refresh',
				'name': WIDGaT.activeWidget.get('id'),
					'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				var tmpStore = Ext.create('WIDGaT.store.Widgets');
				tmpStore.loadRawData(response);
				WIDGaT.activeWidget = tmpStore.first();
				me.getWidgetsStore().loadRawData(response);
				me.updateGlobalStores();
			},
			failure: function(response) {
				if(WIDGaT.debug) console.log('An error occured while refreshing the widget. response:', response);		
			}
		});
		me.getWidgetView().setSrc();
	},
	
	onToolBinClick: function() {
		var me = this;
		if(WIDGaT.debug) console.log('onToolBinClick');
		
		if(WIDGaT.selectedCompo) {
			
			var tmpO = new Object();
			tmpO.root = 'components[' + WIDGaT.activeWidget.components().indexOfId(WIDGaT.selectedCompo.get('id')) + ']';
			Ext.data.JsonP.request({
				url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
				params: {
					'verb': 'delete',
					'name': WIDGaT.activeWidget.get('id'),
					'value': Ext.JSON.encode(tmpO),
					'key': 'WIDGaT-918273645-911'
					/*'verb': 'remove',
					'name': WIDGaT.activeWidget.get('id'),
					'value': Ext.JSON.encode(new Array(WIDGaT.selectedCompo.get('id')))*/
				},
				success: function(response) {
					if(WIDGaT.debug) console.log('Component successfully deleted. response:', response);
					WIDGaT.selectedCompo = null;
					me.getAttributeList().getStore().removeAll();
					me.getAttributeList().setTitle('Edit ');
					me.getAttributeList().down('#toolBin').setDisabled(true);
					Ext.data.JsonP.request({
						url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
						params: {
							'verb': 'refresh',
							'name': WIDGaT.activeWidget.get('id'),
					'key': 'WIDGaT-918273645-911'
						},
						success: function(response) {
							//me.getWidgetView().setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + response.id + '/');
							var tmpStore = Ext.create('WIDGaT.store.Widgets');
							tmpStore.loadRawData(response);
							WIDGaT.activeWidget = tmpStore.first();
							me.getWidgetsStore().loadRawData(response);
							//WIDGaT.activeWidget = me.getWidgetsStore().first();
							if(WIDGaT.debug) console.log("Widget successfuly refreshed with id:", WIDGaT.activeWidget.internalId);
							if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
							
							//populating ActionStore
							/*WIDGaT.actionStore.removeAll();
							WIDGaT.outputStore.removeAll();
							
							WIDGaT.activeWidget.components().each(function(record) {
								record.actions().each(function(action) { 
									WIDGaT.actionStore.add(action);
								});
								
								record.attributes().each(function(attr) {
									if(attr.get('output'))
										WIDGaT.outputStore.add(attr);
								});
							});*/
							me.updateGlobalStores();
							
							if (me.getIncludedCompoGrid()) {
								me.getIncludedCompoGrid().getView().bindStore(WIDGaT.activeWidget.components());
							}
						
							if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
						},
						failure: function(response) {
							if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
						}
					});
					
					var MIF = Ext.ComponentQuery.query('#stageFrame > miframe')[0];
					MIF.setSrc();
				},
				failure: function(response) {
					if(WIDGaT.debug) console.log('An error occured while saving widget details. response:', response);	
				}
			});
		}
	},
	
    //Widget Save Window
    onUndoButtonClick: function() {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onUndoButtonClick()");
		var me = this;
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'undo',
				'name': WIDGaT.activeWidget.get('id'),
					'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				var tmpStore = Ext.create('WIDGaT.store.Widgets');
				tmpStore.loadRawData(response);
				WIDGaT.activeWidget = tmpStore.first();
				me.getWidgetsStore().loadRawData(response);
				//WIDGaT.activeWidget = me.getWidgetsStore().first();

				//populating ActionStore
				/*WIDGaT.actionStore = Ext.create('WIDGaT.store.Actions');
				WIDGaT.outputStore = Ext.create('WIDGaT.store.Attributes');
				
				WIDGaT.activeWidget.components().each(function(record) {
					record.actions().each(function(action) { 
						WIDGaT.actionStore.add(action);
					});
					
					record.attributes().each(function(attr) {
						if(attr.get('output'))
							WIDGaT.outputStore.add(attr);
					});
				});*/
				me.updateGlobalStores();
				
				if (me.getIncludedCompoGrid()) {
					me.getIncludedCompoGrid().getView().bindStore(WIDGaT.activeWidget.components());
				}
				//me.getViewWindow().setWidth(WIDGaT.activeWidget.get('width') + 100);
				//me.getViewWindow().setHeight(WIDGaT.activeWidget.get('height') + 40);
				me.getViewWindow().setTitle(WIDGaT.activeWidget.get('name'));
				
				me.getWidgetView().setSrc();
				if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
				//Ext.ComponentManager.get('cbActions').bindStore(WIDGaT.actionStore);
			},
			failure: function(response) {
				if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
			}
		});
    },
	
	onCompoMoved: function(eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Widgets.onCompoMoved(eOpts)', eOpts);
		var me= this;
		
		var tmpO = new Object();
		
		tmpO.root = "components['"+ eOpts.rootId +"']";
		tmpO.placeHolder = eOpts.targetPh;
		
		if(eOpts.after) {
			tmpO.after = "components['"+ eOpts.after +"']";
		} else {
			tmpO.before = "components['"+ eOpts.before +"']";
		}
		
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'move',
				'name': WIDGaT.activeWidget.get('id'),
				'value': Ext.JSON.encode(tmpO),
					'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				//me.getWidgetView().setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + response.id + '/');
				if(!Ext.isDefined(response.ERROR)) {
					var tmpStore = Ext.create('WIDGaT.store.Widgets');
					tmpStore.loadRawData(response);
					WIDGaT.activeWidget = tmpStore.first();
					me.getWidgetsStore().loadRawData(response);
					//WIDGaT.activeWidget = me.getWidgetsStore().first();
					if(WIDGaT.debug) console.log("Widget successfuly refreshed with id:", WIDGaT.activeWidget.internalId);
					if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
					
					//populating ActionStore
					me.updateGlobalStores();
					
					if (me.getIncludedCompoGrid()) {
						me.getIncludedCompoGrid().getView().bindStore(WIDGaT.activeWidget.components());
					}
					
					if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
					if(WIDGaT.debug) console.log('WIDGaT.outputStore', WIDGaT.outputStore);
				}
			},
			failure: function(response) {
				if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
			}
		});
		me.getWidgetView().setSrc();
	},
	
	onCompoDropped: function(cmp, placeHolder) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Widgets.onCompoDropped()');
		
		var me = this;
		var tpEl = Ext.create('Ext.Element', cmp);		
		
		var selectedCmp = this.getComposStore().getByClassName(tpEl.dom[0].id);
		
		var cmpObj = selectedCmp.json4Serv()
		var newCmp = Ext.create('WIDGaT.model.Compo', selectedCmp.json4Serv());
		
		newCmp.set('placeHolder', placeHolder.id);

		var newID = 1;
		WIDGaT.activeWidget.components().each(function(record) {
			if(record.get('className') == newCmp.get('className'))
				newID++;
		});
		newCmp.set('id', newCmp.get('className') + newID.toString());
		
		Ext.each(cmpObj.authors, function(author) {
			var newAut = Ext.create('WIDGaT.model.Author', author);
			newCmp.authors().add(newAut);
		});
		
		Ext.each(cmpObj.themes, function(theme) {
			var newThe = Ext.create('WIDGaT.model.Theme', theme);
			newCmp.themes().add(newThe);
		});
		
		Ext.each(cmpObj.attributes, function(attribute) {
			var newAtt = Ext.create('WIDGaT.model.Attribute', attribute);
			
			Ext.each(attribute.choices, function(choice) {
				var newCho = Ext.create('WIDGaT.model.Choice', choice);
				newAtt.choices().add(newCho);
			});
			
			newCmp.attributes().add(newAtt);
		});
		
		Ext.each(cmpObj.actions, function(action) {
			var newAct = Ext.create('WIDGaT.model.Action', action);
			newCmp.actions().add(newAct);
		});
		
		Ext.each(cmpObj.guidances, function(guidance) {
			var newGui = Ext.create('WIDGaT.model.Guidance', guidance);
			newCmp.guidances().add(newGui);
		});
		
		Ext.each(cmpObj.dependencies, function(dependency) {
			var newDep = Ext.create('WIDGaT.model.Dependency', dependency);
			newCmp.dependencies().add(newDep);
		});
		
		
		
		if(WIDGaT.debug) console.log('top.window, component dropped:', newCmp);
		if(WIDGaT.debug) console.log('top.window, placeHolder dropped in:', placeHolder);
		if(WIDGaT.debug) console.log('top.window, new component to append: ', newCmp.actions());
		
		var tmpOR = new Object();
		
		tmpOR.verb = 'append-component';
		tmpOR.name = WIDGaT.activeWidget.get('id');
		tmpOR.verbose = true;
		tmpOR.value = Ext.JSON.encode(newCmp.json4Serv());
		tmpOR.key = 'WIDGaT-918273645-911';
		
		Ext.Ajax.request({
		//Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: tmpOR,
			success: function(response, opts) {
				if(WIDGaT.debug) console.log('Compo added successfully. response:',response);
				Ext.data.JsonP.request({
					url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
					params: {
						'verb': 'refresh',
						'name': WIDGaT.activeWidget.get('id'),
						'key': 'WIDGaT-918273645-911'
					},
					success: function(response) {
						//me.getWidgetView().setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + response.id + '/');
						var tmpStore = Ext.create('WIDGaT.store.Widgets');
						tmpStore.loadRawData(response);
						WIDGaT.activeWidget = tmpStore.first();
						me.getWidgetsStore().loadRawData(response);
						//WIDGaT.activeWidget = me.getWidgetsStore().first();
						if(WIDGaT.debug) console.log("Widget successfuly refreshed with id:", WIDGaT.activeWidget.internalId);
						if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
						
						//populating ActionStore
						me.updateGlobalStores();
						
						if (me.getIncludedCompoGrid()) {
							me.getIncludedCompoGrid().getView().bindStore(WIDGaT.activeWidget.components());
						}
						
						if(WIDGaT.debug) console.log('WIDGaT.actionStore', WIDGaT.actionStore);
						if(WIDGaT.debug) console.log('WIDGaT.outputStore', WIDGaT.outputStore);
					},
					failure: function(response) {
						if(WIDGaT.debug) console.log('An error occured while creating widget. response:', response);		
					}
				});
				me.getWidgetView().setSrc();
				if(WIDGaT.debug) console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);
			},
			failure: function(response, opts) {
				if(WIDGaT.debug) console.log('server-side failure with status code ' + response.status);
			}
		});
	},
	
	//inserting guidance need further work to display only the relevant guidances
	onWidgetStoreLoad: function(store, records){
		if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.onWidgetStoreLoad(store, records)", store, records);
		var gStore = Ext.create('WIDGaT.store.Guidances');
		var arGuid = new Array();
		store.first().components().each(function(cmp) {
			cmp.guidances().each(function(guid) { arGuid.push(guid); });										 
		});
		gStore.loadRecords(arGuid);
		var me =this;
		
		gStore.group('widgat.model.compo_id');
		//if(WIDGaT.debug) console.log(WIDGaT.outputStore.getGroups());
		
		var obRoot = new Object();
		obRoot.expanded = true;
		obRoot.children = new Array();
		
		
		Ext.each(gStore.getGroups(), function(group) {
				var obGrp = new Object();
				obGrp.text = group.name;
				obGrp.leaf = false;
				obGrp.expanded = true;
				obGrp.children = new Array();
				Ext.each(group.children, function(child) {
					var obChild = new Object();
					obChild.leaf = true;
					obChild.text = child.get('text');
					obChild.priority = child.get('priority');
					obChild.shortName = child.get('shortName');
					obGrp.children.push(obChild);
				});
				obRoot.children.push(obGrp);
		});
		
		var tStore = Ext.create('Ext.data.TreeStore', {
			model: 'WIDGaT.model.Guidance',
			root: obRoot
		});
		var gdL = Ext.create('WIDGaT.view.guidance.List', {
			store: tStore
		});
		if(WIDGaT.debug) console.log('gStore', gStore);
		if(WIDGaT.debug) console.log('tStore', tStore);
		
		this.getGuidancePanel().add(gdL);
	},
	
	updateGlobalStores: function() {
		if(!WIDGaT.actionStore && !WIDGaT.outputStore) {
			WIDGaT.actionStore = Ext.create('WIDGaT.store.Actions');
			WIDGaT.outputStore = Ext.create('WIDGaT.store.Attributes');
		} else {
			WIDGaT.actionStore.removeAll();
			WIDGaT.outputStore.removeAll();
		}
		
		WIDGaT.activeWidget.components().each(function(record) {
			record.actions().each(function(action) { 
				WIDGaT.actionStore.add(action);
			});
			
			record.attributes().each(function(attr) {
				if(attr.get('output'))
					WIDGaT.outputStore.add(attr);
			});
		});
	},
	
	//Complete tool activation
	activeTool: function() {
			if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.activeTool()");
			Ext.getCmp('widgetDetailsButton').setDisabled(false);
			Ext.getCmp('saveButton').setDisabled(false);
			Ext.getCmp('exportButton').setDisabled(false);
			Ext.getCmp('previewButton').setDisabled(false);
			Ext.getCmp('closeButton').setDisabled(false);
			Ext.getCmp('undoButton').setDisabled(false);
			Ext.getCmp('redoButton').setDisabled(false);
			Ext.getCmp('usecaseButton').setDisabled(false);
			Ext.getCmp('includedButton').setDisabled(false);
			Ext.getCmp('stageFrame').setDisabled(false);
			Ext.getCmp('eastPanel').setDisabled(false);
			Ext.getCmp('compo-list').setDisabled(false);
			Ext.getCmp('centerPanel').setDisabled(false);
	},
	
	//Complete tool deactivation
	disableTool: function() {
			if(WIDGaT.debug) console.log("WIDGaT.controller.Widget.disableTool()");
			Ext.getCmp('widgetDetailsButton').setDisabled(true);
			Ext.getCmp('saveButton').setDisabled(true);
			Ext.getCmp('exportButton').setDisabled(true);
			Ext.getCmp('previewButton').setDisabled(true);
			Ext.getCmp('closeButton').setDisabled(true);
			Ext.getCmp('undoButton').setDisabled(true);
			Ext.getCmp('redoButton').setDisabled(true);
			Ext.getCmp('usecaseButton').setDisabled(true);
			Ext.getCmp('includedButton').setDisabled(true);
			Ext.getCmp('stageFrame').setDisabled(true);
			Ext.getCmp('eastPanel').setDisabled(true);
			Ext.getCmp('compo-list').setDisabled(true);
			Ext.getCmp('centerPanel').setDisabled(true);
	}
})