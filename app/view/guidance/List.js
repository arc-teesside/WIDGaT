/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.guidance.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.guidancelist',

    title : 'Tasks',
    
    initComponent: function() {
		Ext.apply(this, {
			border: true,
			id: 'gdList',
			region: 'north',
			split: true,
			height: 80,
			source: {},
			columns: [
				{ header: 'Details',  dataIndex: 'text', flex: 3 },
				{ header: 'Priority', dataIndex: 'priority', flex: 1 }
			],
			viewConfig: {
				getRowClass: function(record, index, rowParams, ds) {
					
					var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', record.get('widgat.model.compo_id') + '.' + record.get('shortName'), 0, false, false, true)
					if(WIDGaT.debug) console.log('relatedPipe1:', relatedPipe);
					if(!relatedPipe) {
						if(WIDGaT.debug) console.log(record.get('widgat.model.compo_id') + '.' + record.get('shortName'));
						relatedPipe = WIDGaT.activeWidget.pipes().findRecord('to', record.get('widgat.model.compo_id') + '.' + record.get('shortName'), 0, false, false, true)
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
						return "displayNone";	
					}
				}
			}
		});

        this.callParent(arguments);
    },
    bind: function(record, store) {
        store.loadData(record.data.guidances);
        this.bindStore(store);
    }
});