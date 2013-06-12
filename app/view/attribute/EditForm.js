/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.attribute.EditForm' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.attreditform',

    title : 'Edit',
    
    initComponent: function() {
		Ext.apply(this, {
			region: 'center',
			flex: 2,
			ui: 'blue-panel',
			bodyCls: 'edit-panel',
			bodyStyle: {
				background: 'white url(resources/images/edit-bg.png) center bottom no-repeat',
				padding: '0 5 0 5'
			},
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left',
				margin: '5 0 0 0'
			},
			tools: [{
				type: 'bin',
				id: 'toolBin',
				disabled: true,
				tooltip: 'Delete component'
			}],
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'attr-apply',
					text: 'Apply',
					ui: 'blue-button'
				},
				{
					id: 'meta-cancel',
					text: 'Cancel',
					handler: function(btn) {
						this.up('form').getForm().reset();
					}
				}
			]
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