/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.List' ,{
    extend: 'Ext.grid.property.Grid',
    alias : 'widget.attrlist',

    title : 'Edit',
    
    initComponent: function() {
		Ext.apply(this, {
			region: 'center',
			flex: 2,
			source: {},
			bodyCls: 'edit-panel',
			bodyStyle: {
				background: 'white url(resources/images/edit-bg.png) center bottom no-repeat'
			},
			listeners: {
				'beforeselect': function (rowModel, record, index) {
					if(WIDGaT.debug) console.log('beforeselect');
					return !(record.get('name') == 'ID');
				}
			},
			tools: [{
				type: 'bin',
				id: 'toolBin',
				disabled: true,
				tooltip: 'Delete component'
			}]
		});

        this.callParent(arguments);
    },
    bind: function(cmp, attrStore) {
		var me = this;
		
		attrStore.removeAll();
		
		attrStore.loadData(cmp.attributesStore.data.items, true);
		
		if(WIDGaT.debug) console.log('attrStore after loadData:', attrStore);
        
		attrStore.filter('output', false);
		
		if(WIDGaT.debug) console.log('attrStore after output filter:', attrStore);

        this.bindStore(attrStore);

    }
});