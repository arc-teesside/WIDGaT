/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Compos', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Action', 'Attribute', 'Author', 'Dependency', 'Guidance', 'Theme', 'Choice'],
    stores: ['Compos', 'Actions', 'Attributes', 'Authors', 'Dependencies', 'Guidances', 'Themes', 'Choices'],
	
	views: [
        'compo.List'
    ],
	
    refs: [
        {ref: 'attributeList', selector: 'attrlist'},
		{ref: 'attrEditForm', selector: 'attreditform'},
        {ref: 'guidanceList', selector: 'guidancelist'},
        {ref: 'compoDataView', selector: 'compoDataView'},
        {ref: 'compoList', selector: 'compolist'},
        {ref: 'widgetView', selector: 'widgetview'},
        {ref: 'actionComboBox', selector: 'actioncombobox'},
        {ref: 'themeComboBox', selector: 'themecombobox'},
		{ref: 'guidancePanel', selector: '#guidancePanel'},
        {ref: 'guidanceList', selector: 'guidancelist'},
		{ref: 'outputTree', selector: '#outputTree'},
		{ref: 'includedCompoGrid', selector: '#included-compo-grid'}
    ],

    init: function() {
    	var me = this;
		
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
					if(WIDGaT.debug) console.log(me.getAttributeList().getStore());
				}
			},
			'guidancelist': {
                itemclick: me.onGuidanceClick
			},
			'themecombobox': {
                select: me.onThemeSelect,
				beforerender: me.onThemeBeforeRender
			},
			'outputfield': {
                focus: function(cmp) { cmp.setRawValue(cmp.value); }
			},
			'actionpicker': {
                focus: function(cmp) { cmp.setRawValue(cmp.value);}
			},
			'#included-compo-grid': {
                itemclick: me.onIncludedCompoGridItemClick
			}
        });
        
		me.getComposStore().on({
			scope: me,
			load : me.onComposStoreLoad
		});
		me.getAttributesStore().on({
			update: function(store, record) {
				if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onAttributesStoreUpdate()');
				if(WIDGaT.debug) console.log('Updated record, store:', record, store);
				
				var updatedCompo = WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id'));
				
				if(record.get('type').toLowerCase() == 'action' && !record.get('input')) {
					if(WIDGaT.debug) console.log("outputtree", me.getOutputTree());
					/*if(me.getOutputTree()) {
						if(WIDGaT.debug) console.log("hasSelection()", me.getOutputTree().getSelectionModel().hasSelection());
						if(WIDGaT.debug) console.log("getLastSelected", me.getOutputTree().getSelectionModel().getLastSelected());
					}*/
					var recordAction = record.get('widgat.model.compo_id') + '.' + record.get('shortName');
					var valueAction = record.get('value');
					
					var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', recordAction)
					
					if(relatedPipe) {
						relatedPipe.set('to', valueAction);
					} else {
						relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', recordAction)
						if(relatedPipe) {
							relatedPipe.set('from', valueAction);
						}
					}
					
					if(relatedPipe) {
						var jsVal = new Object();
						jsVal.root = 'pipes['+ WIDGaT.activeWidget.pipes().indexOf(relatedPipe) +']';
						jsVal.from = relatedPipe.get('from');
						jsVal.to = relatedPipe.get('to');
						
						Ext.data.JsonP.request({
							url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
							params: {
								'verb': 'modify',
								'name': WIDGaT.activeWidget.get('id'),
								'value': Ext.JSON.encode(jsVal),
								'key': 'WIDGaT-918273645-911'
							},
							success: function(response) {
								if(WIDGaT.debug) console.log(response);
								//me.getActionWindow().close();
								me.getWidgetView().setSrc();
								
								//NEED TO RECREATE STORE FOR GUIDANCE LIST BECAUSE THE ONBEFORERENDER DELETES RECORD
								//me.getGuidanceList().onBeforeRender();
								me.createGuidancePanel();
								
							},
							failure: function(response) {
								console.error(response);	
							}
						});
					} else {
						relatedPipe = Ext.create('WIDGaT.model.Pipe');
						if(record.get('type').toLowerCase() == 'action') {
							relatedPipe.set('to', valueAction);
							relatedPipe.set('from', recordAction);
						} else {
							relatedPipe.set('to', recordAction);
							relatedPipe.set('from', valueAction);
						}
						Ext.data.JsonP.request({
							url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
							params: {
								'verb': 'append-pipe',
								'name': WIDGaT.activeWidget.get('id'),
								'value': Ext.JSON.encode(relatedPipe.json4Serv()),
								'key': 'WIDGaT-918273645-911'
							},
							success: function(response) {
								if(WIDGaT.debug) console.log(response);
								WIDGaT.activeWidget.pipes().add(relatedPipe);
								//me.getActionWindow().close();
								me.getWidgetView().setSrc();
								if(WIDGaT.debug) console.log("success me.getGuidanceList()", me.getGuidanceList());
								//me.getGuidanceList().onBeforeRender();
								me.createGuidancePanel();
								
							},
							failure: function(response) {
								console.error(response);	
							}
						});
					}
				}
				else if(record.get('type').toLowerCase() != 'action' && record.get('input')) {
										
					var recordAction = record.get('widgat.model.compo_id') + '.' + record.get('shortName');
					var valueAction = record.get('value');
					
					console.log('recordAction', recordAction);
					console.log('valueAction', valueAction);
					
					var verifOutput = /^[a-zA-Z0-9]*\.[a-zA-Z0-9]*$/.test(valueAction);
					var verifNumber = /^\d*$/.test(valueAction);
					
					console.log('VALUE ACTION, NB', valueAction, valueAction.length);
					console.log('VERIF OUTPUT', verifOutput);
					
					var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', recordAction)
					
					if(relatedPipe) {
						if(verifOutput || verifNumber) {
							relatedPipe.set('to', valueAction);
						}
						else {
							relatedPipe.set('to', '['+valueAction+']');
						}
					} else {
						relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', recordAction)
						if(relatedPipe) {
							if(verifOutput || verifNumber) {
								relatedPipe.set('from', valueAction);
							}
							else {
								relatedPipe.set('from', '['+valueAction+']');
							}
						}
					}
					
					if(relatedPipe) {
						var jsVal = new Object();
						jsVal.root = 'pipes['+ WIDGaT.activeWidget.pipes().indexOf(relatedPipe) +']';
						jsVal.from = relatedPipe.get('from');
						jsVal.to = relatedPipe.get('to');
						
						Ext.data.JsonP.request({
							url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
							params: {
								'verb': 'modify',
								'name': WIDGaT.activeWidget.get('id'),
								'value': Ext.JSON.encode(jsVal),
								'key': 'WIDGaT-918273645-911'
							},
							success: function(response) {
								if(WIDGaT.debug) console.log(response);
								//me.getActionWindow().close();
								me.getWidgetView().setSrc();
								
								//NEED TO RECREATE STORE FOR GUIDANCE LIST BECAUSE THE ONBEFORERENDER DELETES RECORD
								//me.getGuidanceList().onBeforeRender();
								me.createGuidancePanel();
								
							},
							failure: function(response) {
								console.error(response);	
							}
						});
					} else {
						relatedPipe = Ext.create('WIDGaT.model.Pipe');
						if(record.get('type').toLowerCase() == 'action') {
							relatedPipe.set('to', valueAction);
							relatedPipe.set('from', recordAction);
						} else {
							if(verifOutput || verifNumber) {
								relatedPipe.set('from', valueAction);
							}
							else {
								relatedPipe.set('from', '['+valueAction+']');
							}
							relatedPipe.set('to', recordAction);
							//relatedPipe.set('from', valueAction);
						}
						Ext.data.JsonP.request({
							url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
							params: {
								'verb': 'append-pipe',
								'name': WIDGaT.activeWidget.get('id'),
								'value': Ext.JSON.encode(relatedPipe.json4Serv()),
								'key': 'WIDGaT-918273645-911'
							},
							success: function(response) {
								if(WIDGaT.debug) console.log(response);
								WIDGaT.activeWidget.pipes().add(relatedPipe);
								//me.getActionWindow().close();
								me.getWidgetView().setSrc();
								if(WIDGaT.debug) console.log("success me.getGuidanceList()", me.getGuidanceList());
								//me.getGuidanceList().onBeforeRender();
								me.createGuidancePanel();
								
							},
							failure: function(response) {
								console.error(response);	
							}
						});
					}
					
				}
				else {
				
					var indexOfParentComp = WIDGaT.activeWidget.components().indexOfId(record.get('widgat.model.compo_id'));
										
					var root = "components["+indexOfParentComp+"].attributes['"+record.get('shortName')+"']";

					var tmpO = record.json4Serv();
					tmpO.root = root;
										
					Ext.data.JsonP.request({
						url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
						params: {
							'verb': 'modify',
							'name': WIDGaT.activeWidget.get('id'),
							'value': Ext.JSON.encode(tmpO),
							'key': 'WIDGaT-918273645-911'
						},
						success: function(response) {
							me.getWidgetView().setSrc();
							//me.getGuidanceList().onBeforeRender();
							me.createGuidancePanel();
						},
						failure: function(response) {
							console.error(response);	
						}
					});
				
				}
			},
			datachanged: function(store, records) {
				if(WIDGaT.debug) console.log('attrStore.datachanged');
				store.suspendEvents();
				
				var attrWithChoices = new Array();
				
				
				
				var customEdits = new Array();
				
				store.each(function(attr) {
					if(WIDGaT.debug) console.log('each attr',attr);
					
					if(attr.get('type').toLowerCase() == 'action') {
						if(WIDGaT.debug) console.log('registering customEditor for actions');
						if(WIDGaT.debug) console.log(me.getAttributeList().getDockedComponent('attributeToolbar'));
						
						
						
						var existingP = null;
						if( existingP = WIDGaT.activeWidget.pipes().findRecord('from', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('to'));  //don't set value here but when creating pipe so it doesn't trigger the update event on the store
						} else if( existingP = existingP = WIDGaT.activeWidget.pipes().findRecord('to', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('from'));
						}
						/*eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.action.ActionPicker")'
							+'}'
						+'});');*/
						customEdits.push('"' + attr.get('name') + '": Ext.create("WIDGaT.view.action.ActionPicker")');
					}
					
					if(attr.get('type').toLowerCase() == 'image' || attr.get('type').toLowerCase() == 'sound' || attr.get('name').toLowerCase() == 'url') {
						if(WIDGaT.debug) console.log('registering customEditor for medias');
						//if(WIDGaT.debug) console.log(me.getAttributeList().getDockedComponent('attributeToolbar'));
						
						
						
						/*var existingP = null;
						if( existingP = WIDGaT.activeWidget.pipes().findRecord('from', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('to'));  //don't set value here but when creating pipe so it doesn't trigger the update event on the store
						} else if( existingP = existingP = WIDGaT.activeWidget.pipes().findRecord('to', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('from'));
						}*/
						/*eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.action.ActionPicker")'
							+'}'
						+'});');*/
						
						var mediaType;
						
						if(attr.get('type').toLowerCase() != 'image' && attr.get('type').toLowerCase() != 'sound' && attr.get('name').toLowerCase() == 'url')
							mediaType = 'Image';
						else
							mediaType = attr.get('type');
							
						customEdits.push('"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.MediaCombo", { mediaType: "'+mediaType+'" })');
					}
						
					if(attr.get('input')) {
						
						var existingP = null;
						if( existingP = WIDGaT.activeWidget.pipes().findRecord('from', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('to'));
						} else if( existingP = existingP = WIDGaT.activeWidget.pipes().findRecord('to', attr.get('widgat.model.compo_id') + '.' + attr.get('shortName'))) {
							attr.set('value', existingP.get('from'));
						}
						
						if(WIDGaT.debug) console.log('registering customEditor for inputs');
						
						/*eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.OutputField")'
							+'}'
						+'});');*/
						customEdits.push('"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.OutputField")');
					}
					
					if(attr.choices().getCount() > 0) {
						
						
						if(WIDGaT.debug) console.log('registering customEditor for choices');
						/*var tmpObj = new Object();
						tmpObj.name = attr.get('name');
						tmpObj.store = attr.choices();
						attrWithChoices.push(tmpObj);*/
						
						attrWithChoices.push(attr.choices());
						
						/*eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.ChoicesComboBox", { store: attr.choices()})'
							+'}'
						+'});');*/
						
						indexAttr = attrWithChoices.length-1;
						customEdits.push('"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.ChoicesComboBox", { store: attrWithChoices['+indexAttr+'] })');
					}
				});
				//console.log('custonEdits', customEdits);
				if(customEdits.length > 0) {
					
					var customEditStr = ""
				
					for(var i=0;i<customEdits.length;i++) {
						
						customEditStr += customEdits[i];
						if(i<(customEdits.length-1)){
							customEditStr += ',';
						}
						
					}
					console.log(customEditStr);
					eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+ customEditStr
							+'}'
						+'});');
				}
				
				/*eval('Ext.apply(me.getAttributeList(), {'
							+'customEditors: {'
							+'	"' + attr.get('name') + '": Ext.create("WIDGaT.view.attribute.ChoicesComboBox", { store: attr.choices()})'
							+'}'
						+'});');*/
						
				store.resumeEvents();
			}
		});
    },
	
	onCompoSelected: function(cmp) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onCompoSelected()');
		if(WIDGaT.debug) console.log('selected comp from controller', cmp);
		//the following will throw errors if WIDGaT.activeWidget==WIDGaT.newWidget   otherwise  as if you click on useacaseButton while in debug mode
		if(WIDGaT.debug) console.log('Selected comp\'s attributes', WIDGaT.activeWidget.components().getById(cmp.id).attributes());
		WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(cmp.id);
		//this.getAttributeList().bind(WIDGaT.activeWidget.components().getById(cmp.id), this.getAttributesStore());
		//this.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
		//this.getAttributeList().down('#toolBin').setDisabled(false);
		
		var me = this;
		
		WIDGaT.selectedCompo.attributes().each(function(record) {
			if(WIDGaT.debug) console.log('selected compo attr record', record);
			
			switch(record.get('type')) {
				case 'String':
					me.getAttrEditForm().add({
						xtype: 'textfield',
						id: record.get('shortName'),
						fieldLabel: record.get('name'),
						name: record.get('shortName'),
						anchor: '100%',
						value: record.get('value'),
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
					});
					break;
				case 'Image':
					me.getAttrEditForm().add(Ext.create("WIDGaT.view.attribute.MediaCombo", { mediaType: 'Image', id: record.get('shortName'), fieldLabel: record.get('name'), name: record.get('shortName'), anchor: '100%'}));
					break;
				default:
					break;
			}
			
		});
		
		me.getAttrEditForm().loadRecord(WIDGaT.selectedCompo.attributes());
		
		this.getThemeComboBox().bindStore(WIDGaT.activeWidget.components().getById(cmp.id).themes());
		this.getThemeComboBox().setValue(WIDGaT.selectedCompo.get('stylesheet'));
	},
	
	onCompoDeselected: function() {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onCompoDeselected()');
		
		WIDGaT.selectedCompo = null;
		this.getAttributesStore().removeAll();
		this.getAttributeList().setTitle('Edit ');
		this.getAttributeList().down('#toolBin').setDisabled(true);
		this.getThemeComboBox().clearValue();
	},
	
	onGuidanceClick: function (view, record) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onGuidanceClick()');
		//the following will throw errors if WIDGaT.activeWidget==WIDGaT.newWidget   otherwise  as if you click on useacaseButton while in debug mode	
		if(WIDGaT.debug) console.log("guidance select", record);
		var cmpId;
		if(record.get('depth') == 1)
			cmpId = record.get('text');
		else
			cmpId = record.parentNode.get('text');
		
		WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(cmpId);
		this.getAttributeList().bind(WIDGaT.activeWidget.components().getById(cmpId), this.getAttributesStore());
		this.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
		this.getAttributeList().down('#toolBin').setDisabled(false);
		
		this.getWidgetView().frameElement.getDoc().dom.setSelected(cmpId);
		
		view.deselect(record);
	},
	
	onIncludedCompoGridItemClick: function(view, record) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onIncludedCompoGridItemClick()');
		
		var cmpId = record.get('id');
		
		WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(cmpId);
		this.getAttributeList().bind(WIDGaT.activeWidget.components().getById(cmpId), this.getAttributesStore());
		this.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
		this.getAttributeList().down('#toolBin').setDisabled(false);
		
		this.getWidgetView().frameElement.getDoc().dom.setSelected(cmpId);
	
	},
	
	onThemeSelect: function(cmb, records) {
		
		var me = this;
		WIDGaT.activeWidget.components().getById(records[0].get('widgat.model.compo_id')).set('stylesheet', records[0].get('file'));
		
		var tmpO = new Object();
		tmpO.root = 'components['+ WIDGaT.activeWidget.components().indexOfId(records[0].get('widgat.model.compo_id')) +']';
		tmpO.stylesheet = records[0].get('file');
		
		if(WIDGaT.debug) console.log('tmpO: ', tmpO);
		//will be modified to modify-component with id
		Ext.data.JsonP.request({
			url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
			params: {
				'verb': 'modify',
				'name': WIDGaT.activeWidget.get('id'),
				'value': Ext.JSON.encode(tmpO),
					'key': 'WIDGaT-918273645-911'
			},
			success: function(response) {
				if(WIDGaT.debug) console.log(response);	
				me.getWidgetView().setSrc();
			},
			failure: function(response) {
				console.error(response);	
			}
		});
	},
	
	onThemeBeforeRender: function(cmb) {
		if(WIDGaT.debug) console.log('onThemeBeforeRender');
		//cmb.setValue(WIDGaT.selectedCompo.get('stylesheet'));
	},
    
	onComposStoreLoad: function(store, records, success, operation, eOpts) {
       if(WIDGaT.debug) console.log("WIDGaT.controller.Compos.onComposStoreLoad()");
	   //if(WIDGaT.debug) console.log("id=2: ", store.getById(2));
	   
		var tblItems = new Array();
		
		Ext.each(store.getGroups(), function(group) {
		
			var mStore = Ext.create('WIDGaT.store.Compos');
			mStore.loadRecords(group.children);
			
			var mDataView = Ext.create('WIDGaT.view.compo.DataView', { });
			mDataView.bindStore(mStore);
			mDataView.on('render', function(view) {
				view.tip = Ext.create('Ext.tip.ToolTip', {
					target: view.el,
					delegate: view.itemSelector,
					trackMouse: true,
					renderTo: Ext.getBody(),
					listeners: {
						beforeshow: function updateTipBody(tip) {
							var tmpRecord = view.getRecord(tip.triggerElement);
							var descHtml = "<b>" + tmpRecord.get('name') + "</b><br />"
												 + tmpRecord.get('description') + "<br />";
							if(tmpRecord.attributes().getCount() > 0) {
								descHtml += "<b>Attributes</b><br />";
								descHtml += '<ul class="tooltip-list">';
								tmpRecord.attributes().each(function(r) {
									descHtml += "<li>" + r.get('name') + "</li>";
								});
								descHtml += '</ul>';
							}
							if(tmpRecord.actions().getCount() > 0) {
								descHtml += "<b>Actions</b><br />";
								descHtml += '<ul class="tooltip-list">';
								tmpRecord.actions().each(function(r) {
									descHtml += "<li>" + r.get('name') + "</li>";
								});
								descHtml += '</ul>';
							}
							if(tmpRecord.themes().getCount() > 0) {
								descHtml += "<b>Themes</b><br />";
								tmpRecord.themes().each(function(r) {
									descHtml += r.get('name') + ", ";
								});
							}
							tip.update(descHtml);
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
		if(WIDGaT.debug) console.log("this.getCompoList()", this.getCompoList());
		this.getCompoList().items.items[1].expand();
		/*Ext.each(this.getCompoList().items.items, function(i) {
				i.expand();
		});*/
	},
	
	onAfterCompoListRender: function(list) {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Compos.onAfterCompoListRender()");
    	this.getComposStore().load();
	},
    
    onCompoItemClick: function (view, record, item, index) {
        /*if(WIDGaT.debug) console.log('WIDGaT.controller.Compos.onCompoItemClick()');
    	this.getAttributeList().bind(record, this.getAttributesStore());
		this.getGuidanceList().bind(record, this.getGuidancesStore());*/
    	this.getCompoDataView().deselect(index, true);
		
		var vt = this.getCompoList();
		if(WIDGaT.debug) console.log("vt", vt);
		Ext.each(vt.items.items, function(i) {
				if(WIDGaT.debug) console.log("i",i);
				i.down('compoDataView').getSelectionModel().deselectAll();
		});
    },
    
    onCompoItemMouseUp: function (view, record, item, index) {
    	//this.getCompoDataView().deselect(index, true);
    },
    
    onCompoSelectionChange: function(view, records) {
		if(WIDGaT.debug) console.log("WIDGaT.controller.Compos.onCompoSelectionChange()");
        if (records.length) {
        	
            this.getAttributeList().bind(records[0], this.getAttributesStore());
        }
    },
	
	createGuidancePanel: function() {
		var gStore = Ext.create('WIDGaT.store.Guidances');
		var arGuid = new Array();
		WIDGaT.activeWidget.components().each(function(cmp) {
			cmp.guidances().each(function(guid) { arGuid.push(guid); });										 
		});
		gStore.loadRecords(arGuid);
		
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
		this.getGuidancePanel().removeAll();
		this.getGuidancePanel().add(gdL);
	}
})