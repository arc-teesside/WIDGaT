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
			flex: 2,
			border: false,
			source: {},
			listeners: {
				'beforeselect': function (rowModel, record, index) {
					console.log('beforeselect');
					return !(record.get('name') == 'ID');
				}
			},
			tools: [{
				type: 'bin',
				id: 'toolBin',
				disabled: true,
				tooltip: 'Delete component'
			}]
			

			
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

        this.callParent(arguments);
    },
    bind: function(cmp, attrStore) {
		var me = this;
		attrStore.removeAll();
		console.log('docked items', me.getDockedItems());
		console.log('actionButton', me.getDockedComponent('actionButton'));
		if(me.getDockedComponent('actionButton')) {
			console.log('remove if exists');
			me.removeDocked(me.getDockedComponent('actionButton'));
			console.log('docked items after remove', me.getDockedItems());
		}
			
		//attrStore.add({'name': 'ID', 'value': cmp.get('id')});
        
		/*attrStore.on({
			load: function(store, records) {
				console.log('attrStore.onLoad');
				store.each(function(attr) {
					if(attr.get('type') == 'action' || attr.get('type') == 'Action') {
						//apply custom editor for attr.get('name') using Ext.create('WIDGaT.view.action.ComboBox')
						console.log('attr.get()',attr.get('type'));
						Ext.apply(me, {
							customEditors: {
								'Action': Ext.create('WIDGaT.view.action.ComboBox')
							}
						});
					}
						
					if(attr.get('input')) {
						//apply custom editor for attr.get('name') using Ext.create('WIDGaT.view.attribute.ComboBox')	
						Ext.apply(me, {
							customEditors: {
								'input': Ext.create('WIDGaT.view.attribute.ComboBox')
							}
						});
					}
					
				});
			}
		});*/
		console.log(cmp.attributesStore.data.items);
		attrStore.loadData(cmp.attributesStore.data.items, true);
        attrStore.filter('output', false);
		
		if(attrStore.find('type', 'action', 0, 0, 0) != -1) {
			me.addDocked(Ext.create("WIDGaT.view.action.Button"));
			/*console.log('FOUND');
			me.down('#actionButton').setVisible(true);*/
		} /*else {
			console.log('NOT FOUND');
			me.down('#actionButton').setVisible(false);
		}*/
		
		attrStore.filterBy(function(record, ID) {
			if(record.get("type").toLowerCase() == "action")
				return false;
			else
				return true;
		});
		/*attrStore.each(function(attr) {
			if(attr.get('type') == 'action' || attr.get('type') == 'Action') {
				//apply custom editor for attr.get('name') using Ext.create('WIDGaT.view.action.ComboBox')
				console.log('attr.get()',attr.get('type'));
				Ext.apply(me, {
					customEditors: {
						'Action': Ext.create('WIDGaT.view.action.ComboBox')
					}
				});
			}
				
			if(attr.get('input')) {
				//apply custom editor for attr.get('name') using Ext.create('WIDGaT.view.attribute.ComboBox')	
				Ext.apply(me, {
					customEditors: {
						'input': Ext.create('WIDGaT.view.attribute.ComboBox')
					}
				});
			}
			
		});*/
		//this.setSource(attrStore.data.items);
        this.bindStore(attrStore);
		
		/*this.getStore().on({
			datachanged: function(store) { console.log('after change', store);},
			update: function(store) { console.log('update change', store)}
		});*/
    }
});