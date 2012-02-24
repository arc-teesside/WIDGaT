/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Compos', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Action', 'Attribute', 'Author', 'Dependency', 'Guidance', 'Theme'],
    stores: ['Compos', 'Actions', 'Attributes', 'Authors', 'Dependencies', 'Guidances', 'Themes'],
	
	views: [
        'compo.List'
    ],
	
    refs: [
        {ref: 'attributeList', selector: 'attrlist'},
        {ref: 'guidanceList', selector: 'guidancelist'},
        {ref: 'compoDataView', selector: 'compoDataView'},
        {ref: 'compoList', selector: 'compolist'},
        {ref: 'widgetView', selector: 'widgetview'},
        {ref: 'actionComboBox', selector: 'actioncombobox'},
        {ref: 'themeComboBox', selector: 'themecombobox'}
    ],

    init: function() {
    	var me = this;
		Ext.apply(this, {
			flex: 1,
			border: false,
			source: {}
			
				/*,
			columns: [{
						header: 'Name',
						dataIndex: 'name',
						flex: 1
					}, {
						header: 'Value',
						dataIndex: 'value',
						flex: 1
					}]*/
			//plugins: [Ext.create('Ext.grid.plugin.CellEditing', { clicksToEdit: 1 })]
		});
		
        me.control({
            /*'compolist': {
            	render: me.onCompoListRender,
                selectionchange: me.onCompoSelectionChange
            },*/
            'compoDataView': {
            	itemclick: me.onCompoItemClick,
				itemmouseup: me.onCompoItemMouseUp,
				dragend: function(e) { alert(e); }
            },
			'compolist': {
				afterrender: me.onAfterCompoListRender,
				selected: me.onCompoSelected,
				deselected: me.onCompoDeselected
			},
			'#openButton': {
				click: function() {
					console.log(me.getAttributeList().getStore());
				}
			},
			'guidancelist': {
                itemclick: me.onGuidanceClick
			},
			'themecombobox': {
                select: me.onThemeSelect,
				beforerender: me.onThemeBeforeRender
			}
        });
        
		me.getComposStore().on({
			scope: me,
			load : me.onComposStoreLoad
		});
		me.getAttributesStore().on({
			update: function(store, record) {
				console.log('WIDGaT.controller.Compos.onAttributesStoreUpdate()');
				console.log('Updated record:', record);
				console.log('Combobox:', me.getActionComboBox());
				var updatedCompo = WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id'));
				
				if(record.get('type') == 'Action' || record.get('type') == 'action' || record.get('input')) {
					//update pipes for input and actions and set value to id.action or id.attribute
					
				}
				else {
					//change value in widget and inform server changed value
					var tmpO = new Object();
					
					var indexOfParentComp = WIDGaT.activeWidget.components().indexOfId(record.get('widgat.model.compo_id'));
					
					console.log('indexOfParentComp:', indexOfParentComp);
					
					var tmpAr = new Array();
					for(var i=0; i < indexOfParentComp; i++ ) {
						tmpAr.push(new Object());	
					}
					tmpAr.push(WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id')).json4Serv());
	
					tmpO.id = WIDGaT.activeWidget.get('id');
					tmpO.components = tmpAr;
					
					console.log('tmpO: ', tmpO);
					//will be modified to modify-component with id
					Ext.data.JsonP.request({
						url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
						params: {
							'verb': 'modify',
							'name': WIDGaT.activeWidget.get('id'),
							'value': Ext.JSON.encode(tmpO)
						},
						success: function(response) {
							console.log(response);
							
							me.getWidgetView().setSrc();
							
							/*var MIF = Ext.ComponentQuery.query('#stageFrame > miframe')[0];
							MIF.setSrc('http://arc.tees.ac.uk/WIDEST/Widget/Output/' + response.id + '/');
							
							me.getWidgetsStore().loadRawData(response);
							WIDGaT.activeWidget = me.getWidgetsStore().first();
							console.log("Widget successfuly composed with id:", WIDGaT.activeWidget.internalId);
							console.log('WIDGaT.activeWidget: ', WIDGaT.activeWidget);*/
							//console.log(Ext.JSON.encode(WIDGaT.activeWidget.json4Serv()));
						},
						failure: function(response) {
							console.error(response);	
						}
					});
				
				}
			},
			datachanged: function(store, records) {
				console.log('attrStore.datachanged');
				store.each(function(attr) {
					console.log('each attr',attr);
					
					if(attr.get('type') == 'action' || attr.get('type') == 'Action') {
						console.log('registering customEditor for actions');
						
						var existingP = null;
						if( existingP = WIDGaT.activeWidget.pipes().findRecord('from', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('to'));
						} else if( existingP = existingP = WIDGaT.activeWidget.pipes().findRecord('to', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('from'));
						}
						eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.action.ComboBox")'
							+'}'
						+'});');
					}
						
					if(attr.get('input')) {
						
						var existingP = null;
						if( existingP = WIDGaT.activeWidget.pipes().findRecord('from', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('to'));
						} else if( existingP = existingP = WIDGaT.activeWidget.pipes().findRecord('to', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('from'));
						}
						
						console.log('registering customEditor for inputs');
						
						eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.ComboBox")'
							+'}'
						+'});');
					}
					
				});
			}
		});
    },
	
	onCompoSelected: function(cmp) {
		console.log('WIDGaT.controller.Compos.onCompoSelected()');
		console.log('selected comp from controller', cmp);
		//the following will throw errors if WIDGaT.activeWidget==WIDGaT.newWidget   otherwise  as if you click on useacaseButton while in debug mode
		console.log('Selected comp\'s attributes', WIDGaT.activeWidget.components().getById(cmp.id).attributes());
		WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(cmp.id);
		this.getAttributeList().bind(WIDGaT.activeWidget.components().getById(cmp.id), this.getAttributesStore());
		this.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
		this.getAttributeList().down('#toolBin').setDisabled(false);

		this.getThemeComboBox().bindStore(WIDGaT.activeWidget.components().getById(cmp.id).themes());
		this.getThemeComboBox().setValue(WIDGaT.selectedCompo.get('stylesheet'));
	},
	
	onCompoDeselected: function() {
		console.log('WIDGaT.controller.Compos.onCompoDeselected()');
		
		WIDGaT.selectedCompo = null;
		this.getAttributesStore().removeAll();
		this.getAttributeList().setTitle('Edit ');
		this.getAttributeList().down('#toolBin').setDisabled(true);
		this.getThemeComboBox().clearValue();
	},
	
	onGuidanceClick: function (view, record) {
		console.log('WIDGaT.controller.Compos.onGuidanceClick()');
		//the following will throw errors if WIDGaT.activeWidget==WIDGaT.newWidget   otherwise  as if you click on useacaseButton while in debug mode	
		console.log('Selected comp\'s attributes', WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id')).attributes());
		WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id'));
		this.getAttributeList().bind(WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id')), this.getAttributesStore());
		this.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
		this.getAttributeList().down('#toolBin').setDisabled(false);
		this.getWidgetView().setSrc();
	},
	
	onThemeSelect: function(cmb, records) {
		
		var me = this;
		WIDGaT.activeWidget.components().getById(records[0].get('widgat.model.compo_id')).set('stylesheet', records[0].get('file'));
		
		var tmpO = new Object();
		tmpO.root = 'components['+ WIDGaT.activeWidget.components().indexOfId(records[0].get('widgat.model.compo_id')) +']';
		tmpO.stylesheet = records[0].get('file');
		
		console.log('tmpO: ', tmpO);
		//will be modified to modify-component with id
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'modify',
				'name': WIDGaT.activeWidget.get('id'),
				'value': Ext.JSON.encode(tmpO)
			},
			success: function(response) {
				console.log(response);	
				me.getWidgetView().setSrc();
			},
			failure: function(response) {
				console.error(response);	
			}
		});
	},
	
	onThemeBeforeRender: function(cmb) {
		console.log('onThemeBeforeRender');
		//cmb.setValue(WIDGaT.selectedCompo.get('stylesheet'));
	},
    
	onComposStoreLoad: function(store, records, success, operation, eOpts) {
       console.log("WIDGaT.controller.Compos.onComposStoreLoad()");
	   //console.log("id=2: ", store.getById(2));
	   
		var tblItems = new Array();
		
		Ext.each(store.getGroups(), function(group) {
		
			var mStore = Ext.create('WIDGaT.store.Compos');
			mStore.loadRecords(group.children);
			
			var mDataView = Ext.create('WIDGaT.view.compo.DataView', { });
			mDataView.bindStore(mStore);
			mDataView.on('render', function(view) {
				view.tip = Ext.create('Ext.tip.ToolTip', {
					// The overall target element.
					target: view.el,
					// Each grid row causes its own seperate show and hide.
					delegate: view.itemSelector,
					// Moving within the row should not hide the tip.
					trackMouse: true,
					// Render immediately so that tip.body can be referenced prior to the first show.
					renderTo: Ext.getBody(),
					listeners: {
						// Change content dynamically depending on which element triggered the show.
						beforeshow: function updateTipBody(tip) {
							tip.update(view.getRecord(tip.triggerElement).get('description'));
						}
					}
				});
			});

			
			var mPanel = Ext.create('Ext.panel.Panel', {
				title: group.name,
				collapsed: false,
				flex:1,
				layout: 'fit',
				autoScroll: true,
				items: mDataView
			});
					
			tblItems.push(mPanel);
		});
		this.getCompoList().add(tblItems);
	},
	
	onAfterCompoListRender: function(list) {
		console.log("WIDGaT.controller.Compos.onAfterCompoListRender()");
    	this.getComposStore().load();
	},
    
    onCompoItemClick: function (view, record, item, index) {
        /*console.log('WIDGaT.controller.Compos.onCompoItemClick()');
    	this.getAttributeList().bind(record, this.getAttributesStore());
		this.getGuidanceList().bind(record, this.getGuidancesStore());*/
    	this.getCompoDataView().deselect(index, true);
    },
    
    onCompoItemMouseUp: function (view, record, item, index) {
    	//this.getCompoDataView().deselect(index, true);
    },
    
    onCompoSelectionChange: function(view, records) {
		console.log("WIDGaT.controller.Compos.onCompoSelectionChange()");
        if (records.length) {
        	
            this.getAttributeList().bind(records[0], this.getAttributesStore());
        }
    }
})