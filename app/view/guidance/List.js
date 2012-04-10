/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.guidance.List' ,{
    extend: 'Ext.tree.Panel',
    alias : 'widget.guidancelist',

    
    initComponent: function() {
		Ext.apply(this, {
			border: true,
			id: 'gdList',
			//store: Ext.create('Ext.data.TreeStore'),
			rootVisible: false,
			multiSelect: false,
			border: false,
			columns: [
				{ xtype: 'treecolumn', header: 'Details',  dataIndex: 'text', flex: 3 },
				{ header: 'Priority', dataIndex: 'priority', flex: 1 }
			],
			viewConfig: {
				getRowClass: function(record, index, rowParams, ds) {
					if(WIDGaT.debug) console.log("getRowClass rcd, id, param, store", record, index, rowParams, ds);
					if(WIDGaT.debug) console.log("parent.child", record.parentNode.get('text') + '.' + record.get('shortName'));
					
					if(record.childNodes.length == 0 && record.parentNode.isRoot())
						return "displayNone";
					
					if(record.parentNode.parentNode != null) {
						var gdText = record.parentNode.get('text') + '.' + record.get('shortName');
						var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', gdText, 0, false, false, true)
						if(WIDGaT.debug) console.log('relatedPipe1:', relatedPipe);
						if(!relatedPipe) {
							relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', gdText, 0, false, false, true)
							if(WIDGaT.debug) console.log('relatedPipe2:', relatedPipe);
						} 
						if(!relatedPipe) {
							if(WIDGaT.debug) console.log('Guidance related pipe:', relatedPipe);
							if (record.get('priority') == 'high') {
								return "highPriority";
							}
							else if (record.get('priority') == 'medium') {
								return "mediumPriority";
							}
							else if (record.get('priority') == 'low') {
								return "lowPriority";
							}
						} else {
							//testing hiding parent element using Ext.get():HTMLElement
							//return false;	
						}
					}
				}
			}
		});
		this.on({ beforerender: this.onBeforeRender});
		
        this.callParent(arguments);
    },
    bind: function(record, store) {
        if(WIDGaT.debug) console.log("guidqnce store", store);
		store.loadData(record.data.guidances);
        this.bindStore(store);
    },
	onBeforeRender: function(cmp) {
		if(WIDGaT.debug) console.log("onBeforeRender cmp", cmp, this);
		//cmp.getRootNode().cascadeBy(function(record) { // descends into child nodes
		Ext.each(this.getRootNode().childNodes, function(parentRecord) {
			Ext.each(parentRecord.childNodes, function(record) {
				if(WIDGaT.debug) console.log("record", record);
				if(record == null) return true;
				if(record.parentNode == null) return true;
				if(record.parentNode.parentNode != null) {
					var gdText = record.parentNode.get('text') + '.' + record.get('shortName');
					var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', gdText, 0, false, false, true)
					if(WIDGaT.debug) console.log('relatedPipe1:', relatedPipe);
					if(!relatedPipe) {
						relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', gdText, 0, false, false, true)
						if(WIDGaT.debug) console.log('relatedPipe2:', relatedPipe);
					} 
					if(!relatedPipe) {
						
						//no related pipes, check for attribute value
						console.log(record.parentNode.get('text'), record.get('shortName'));
						
						if(WIDGaT.debug) console.log('WIDGaT.activeWidget.components().getById():', WIDGaT.activeWidget.components().getById(record.parentNode.get('text')).attributes().findRecord('shortName', record.get('shortName')).get('value'));
						//WIDGaT.activeWidget.components().getById(record.parentNode.get('text'));
						
						
						if (record.get('priority') == 'high') {
							// Ext.apply or record.updateinfo
							//return "highPriority";
						}
						else if (record.get('priority') == 'medium') {
							//return "mediumPriority";
						}
						else if (record.get('priority') == 'low') {
							//return "lowPriority";
						}
						var attrValue = WIDGaT.activeWidget.components().getById(record.parentNode.get('text')).attributes().findRecord('shortName', record.get('shortName')).get('value');
						console.log('attrValue:', attrValue);
						if(!Ext.isEmpty(attrValue)) {
							if(record.parentNode.get('text') != "template")
								record.remove();
						}
					} else {
						if(WIDGaT.debug) console.log('Guidance related pipe:', relatedPipe);
						//testing hiding parent element using Ext.get():HTMLElement
						//var parentNod = record.parentNode;
						if(record.parentNode.get('text') != "template")
						record.remove();
						//if(WIDGaT.debug) console.log("parentNod", parentNod.isRoot());
						
						/*Ext.each(record.parentNode.childNodes, function(childNode) {
							if(WIDGaT.debug) console.log("childNode", childNode.isVisible());
						});*/
						//return false;	
					}
				}
			});
			
			
			/*if(this.attributes['status'] == 100) { // test this node
				this.getUI().hide() // hide this node
			}*/
		});
	}
});