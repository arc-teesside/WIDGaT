/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Guidances', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Attribute', 'Guidance'],
    stores: ['Compos', 'Attributes', 'Guidances'],
	
	views: [
        'guidance.List'
    ],
	
    refs: [
        {ref: 'attributeList', selector: 'attrlist'},
    ],

    init: function() {
    	var me = this;
        /*me.control({
            'guidancelist': {
                itemclick: function (view, record) {
                	//window.record = records[0];
                	if(WIDGaT.debug) console.log('guidance clicked', record);
					
					WIDGaT.selectedCompo
					if(WIDGaT.debug) console.log('Selected comp\'s attributes', WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id')).attributes());
					WIDGaT.selectedCompo = WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id'));
					me.getAttributeList().bind(WIDGaT.activeWidget.components().getById(record.get('widgat.model.compo_id')), this.getAttributesStore());
					me.getAttributeList().setTitle('Edit '+WIDGaT.selectedCompo.get('id'));
					me.getAttributeList().down('#toolBin').setDisabled(false);
                }
            }
        });*/
    }
})