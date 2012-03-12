/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Actions', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Action', 'Pipe'],
    stores: ['Compos', 'Actions', 'Pipes'],
	
	views: [
        'action.ComboBox'
    ],

	refs: [
        {ref: 'attributeList', selector: 'attrlist'},
        {ref: 'widgetView', selector: 'widgetview'},
        {ref: 'actionWindow', selector: 'actionwindow'},
        {ref: 'actionTreePanel', selector: 'actiontreepanel'}
    ],
	
    init: function() {
    	var me = this;
        me.control({
            'actioncombobox': {
                select: me.onActionComboBoxSelect,
				beforerender: me.onActionComboBoxBeforeRender
            },
			'#actionButton': {
				click: me.onActionButtonClick
			},
			'actiontreepanel': {
				beforeselect: me.onActionTreePanelBeforeSelect,
				select: me.onActionTreePanelSelect
			},
			'#action-select': {
				click: me.onActionSelectBtnClick
			}
        });
    },
	
	onActionComboBoxSelect: function(cBox, records) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Actions.onActionComboBoxSelect');
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
					me.getWidgetView().setSrc();
					
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		} else {
			relatedPipe = Ext.create('WIDGaT.model.Pipe');	
			relatedPipe.set('from', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'));
			relatedPipe.set('to', records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
			
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
		
		
		//update pipes on select here or when attribute store is updated in widget controller
	},
	
	onActionComboBoxBeforeRender: function(cBox, eOpts) {
		if(WIDGaT.debug) console.log('WIDGaT.controller.Actions.onActionComboBoxBeforeRender');

		//check Pipes to select action if there
		
		Ext.apply(cBox, {
			tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{[values["widgat.model.compo_id"]]}.{name}</li></tpl>'
			//tpl: '<tpl for="."><div class="x-combo-list-item" >'+ cBox.getStore().first().get('widgat.model.compo_id') +'.{name}</div></tpl>'
		});
		
		if(WIDGaT.debug) console.log('cbActions.onBeforeRender, cBox:', cBox);
	},
	
	onActionTreePanelSelect: function(row, record, index, eOpts) {
		//if(WIDGaT.debug) console.log('source:', row);
		//if(WIDGaT.debug) console.log('record:', record);
		this.getActionWindow().down('#action-select').setDisabled(false);
	},
	
	onActionTreePanelBeforeSelect: function(row, record, index, eOpts) {
		return (record.get('depth') != 1);
	},
	
	onActionButtonClick: function(btn) {
		var me = this;
		
		WIDGaT.actionStore.group('widgat.model.compo_id');
		if(WIDGaT.debug) console.log(WIDGaT.actionStore.getGroups());
		
		var obRoot = new Object();
		obRoot.expanded = true;
		obRoot.children = new Array();
		
		
		Ext.each(WIDGaT.actionStore.getGroups(), function(group) {
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
		Ext.create('WIDGaT.view.action.Window', {
			items: [
				Ext.create('WIDGaT.view.action.TreePanel', {
					store: treeStr
				})
			]
		}).show();
	},
	
	onActionSelectBtnClick: function(btn) {
		//if(WIDGaT.debug) console.log(this.getOutputTreePanel().getSelectionModel().getSelection());
		
		var me = this;
		
		var selectedNode = me.getActionTreePanel().getSelectionModel().getSelection()[0];
		var parentId = selectedNode.parentNode.get('text');
		
		var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', WIDGaT.selectedCompo.get('id') + '.action')
		if(WIDGaT.debug) console.log(parentId + '.' + selectedNode.raw.shortName);
		if(relatedPipe) {
			relatedPipe.set('to', parentId + '.' + selectedNode.raw.shortName);
		} else {
			relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', WIDGaT.selectedCompo.get('id') + '.action')
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
					me.getActionWindow().close();
					me.getWidgetView().setSrc();
					
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
					me.getActionWindow().close();
					me.getWidgetView().setSrc();
					
				},
				failure: function(response) {
					console.error(response);	
				}
			});
		}
	}
})