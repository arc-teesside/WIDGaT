/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Attributes', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Attribute', 'Choice'],
    stores: ['Compos', 'Attributes', 'Choices'],
	
	views: [
        'attribute.List',
		'attribute.ComboBox'
    ],

	refs: [
        {ref: 'attributeList', selector: 'attrlist'},
        {ref: 'widgetView', selector: 'widgetview'},
        {ref: 'outputTreePanel', selector: 'outputtreepanel'},
        {ref: 'outputWindow', selector: 'outputwindow'},
		{ref: 'outputField', selector: 'outputfield'}
    ],

    init: function() {
    	var me = this;
        me.control({
            'attrlist': {
                itemclick: function (view, record) {
                	//window.record = records[0];
					
                },
				beforeedit: function (e) {
                	//window.record = records[0];
					
					WIDGaT.editedRecord = e.record;
                },
				propertychange: me.onPropertyChange
            },
			'outputcombobox': {
				select: me.onOutputComboBoxSelect,
				beforerender: me.onOutputComboBoxBeforeRender
			},
			'#outputButton': {
				click: me.onOutputFieldBtnClick
			},
			'outputwindow': {
				afterrender: me.onOutputWindowBeforeRender
			},
			'outputtreepanel': {
				beforeselect: me.onOutputTreePanelBeforeSelect,
				select: me.onOutputTreePanelSelect
			},
			'#attribute-select': {
				click: me.onAttributeSelectBtnClick
			}
        });
    },
	
	onOutputFieldBtnClick: function(cBox, eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Attributes.onOutputFieldBtnClick');
		var me = this;
		
		WIDGaT.outputStore.group('widgat.model.compo_id');
		if(WIDGaT.debug) console.log(WIDGaT.outputStore.getGroups());
		
		var obRoot = new Object();
		obRoot.expanded = true;
		obRoot.children = new Array();
		
		
		Ext.each(WIDGaT.outputStore.getGroups(), function(group) {
				var obGrp = new Object();
				obGrp.text = group.name;
				obGrp.leaf = false;
				obGrp.expanded = true;
				obGrp.children = new Array();
				Ext.each(group.children, function(child) {
					var obChild = new Object();
					obChild.leaf = true;
					obChild.text = child.get('name');
					obChild.shortName = child.get('shortName');
					obGrp.children.push(obChild);
				});
				obRoot.children.push(obGrp);
		});
		
		var treeStr = Ext.create('Ext.data.TreeStore', {  
			root:  obRoot
		});
		Ext.create('WIDGaT.view.attribute.Window', {
			items: [
				Ext.create('WIDGaT.view.attribute.TreePanel', {
					store: treeStr
				})
			]
		}).show();
		//Ext.create('WIDGaT.view.attribute.Window').show();
	},
	
	onOutputComboBoxSelect: function(cBox, records) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Actions.onOutputComboBoxSelect');
		//update pipes on select here or when attribute store is updated in widget controller
		if(WIDGaT.debug) console.log('records', records);
		var me = this;
		var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'))
		if(WIDGaT.debug) console.log(records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
		if(relatedPipe) {
			relatedPipe.set('to', records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
		} else {
			relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'))
			if(relatedPipe) {
				relatedPipe.set('from', records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
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
					'value': Ext.JSON.encode(jsVal)
				},
				success: function(response) {
					if(WIDGaT.debug) console.log(response);
					//me.getWidgetView().setSrc();
					
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		} else {
			relatedPipe = Ext.create('WIDGaT.model.Pipe');	
			relatedPipe.set('to', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'));
			relatedPipe.set('from', records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
			
			Ext.data.JsonP.request({
				url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
				params: {
					'verb': 'append-pipe',
					'name': WIDGaT.activeWidget.get('id'),
					'value': Ext.JSON.encode(relatedPipe.json4Serv())
				},
				success: function(response) {
					if(WIDGaT.debug) console.log(response);
					WIDGaT.activeWidget.pipes().add(relatedPipe);
					Ext.getCmp('gdList').getView().refresh();
					//me.getWidgetView().setSrc();
					
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		}
		
	},
	
	onOutputComboBoxBeforeRender: function(cBox, eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.attribute.onOutputComboBoxBeforeRender');
		/*if(WIDGaT.debug) console.log('cbActions.onBeforeRender, store:', cBox.getStore());
		if(WIDGaT.debug) console.log('cbActions.onBeforeRender, cBox:', cBox);
		if(WIDGaT.debug) console.log('cbActions.onBeforeRender, eOpts:', eOpts);*/
		
		//check Pipes to select output if there
		
		Ext.apply(cBox, {
			tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{[values["widgat.model.compo_id"]]}.{name}</li></tpl>'
		});
	},
	
	onOutputWindowBeforeRender: function(cmp, eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.attribute.onOutputWindowBeforeRender');
	},
	
	onOutputTreePanelSelect: function(row, record, index, eOpts) {
		if(WIDGaT.debug) console.log('source:', row);
		if(WIDGaT.debug) console.log('record:', record);
		this.getOutputWindow().down('#attribute-select').setDisabled(false);
	},
	
	onOutputTreePanelBeforeSelect: function(row, record, index, eOpts) {
		return (record.get('depth') != 1);
	},
	
	onAttributeSelectBtnClick: function(btn) {
		if(WIDGaT.debug) console.log(this.getOutputTreePanel().getSelectionModel().getSelection());
		
		var me = this;
		
		var selectedNode = me.getOutputTreePanel().getSelectionModel().getSelection()[0];
		var parentId = selectedNode.parentNode.get('text');
		
		var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'))
		if(WIDGaT.debug) console.log(parentId + '.' + selectedNode.raw.shortName);
		if(relatedPipe) {
			relatedPipe.set('to', parentId + '.' + selectedNode.raw.shortName);
		} else {
			relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'))
			if(relatedPipe) {
				relatedPipe.set('from', parentId + '.' + selectedNode.raw.shortName);
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
					'value': Ext.JSON.encode(jsVal)
				},
				success: function(response) {
					if(WIDGaT.debug) console.log(response);
					//me.getWidgetView().setSrc();
					me.getOutputField().setValue(parentId + '.' + selectedNode.raw.shortName);
					me.getOutputWindow().close();
					me.getOutputField().fireEvent('validateedit', me.getOutputField());
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		} else {
			relatedPipe = Ext.create('WIDGaT.model.Pipe');	
			relatedPipe.set('to', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'));
			relatedPipe.set('from', parentId + '.' + selectedNode.raw.shortName);
			
			Ext.data.JsonP.request({
				url: 'http://arc.tees.ac.uk/widest/web/json.aspx',
				params: {
					'verb': 'append-pipe',
					'name': WIDGaT.activeWidget.get('id'),
					'value': Ext.JSON.encode(relatedPipe.json4Serv())
				},
				success: function(response) {
					if(WIDGaT.debug) console.log(response);
					WIDGaT.activeWidget.pipes().add(relatedPipe);
					Ext.getCmp('gdList').getView().refresh();
					me.getOutputField().setValue(parentId + '.' + selectedNode.raw.shortName);
					me.getOutputWindow().close();
					me.getOutputField().fireEvent('validateedit', me.getOutputField());
					//me.getWidgetView().setSrc();
					
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		}
	},
	
	onPropertyChange: function(source, recordId, value, oldValue, eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Attributes.onPropertyChange()');
		if(WIDGaT.debug) console.log('source:', source);
		if(WIDGaT.debug) console.log('recordId:', recordId);
		if(WIDGaT.debug) console.log('value:', value);
		if(WIDGaT.debug) console.log('oldValue:', oldValue);
		if(WIDGaT.debug) console.log('eOpts:', eOpts);
	},
	
	onBeforeSelect: function(rowModel, record, index) {
		return !(index == 0);
	}
})