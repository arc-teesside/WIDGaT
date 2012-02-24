/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Attributes', {
	extend: 'Ext.app.Controller',
	
    models: ['Compo', 'Attribute'],
    stores: ['Compos', 'Attributes'],
	
	views: [
        'attribute.List',
		'attribute.ComboBox'
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
			}
        });
    },
	
	onOutputComboBoxSelect: function(cBox, records) {
		console.log('WIDGaT.controller.Actions.onOutputComboBoxSelect');
		//update pipes on select here or when attribute store is updated in widget controller
		console.log('records', records);
		var me = this;
		var relatedPipe = WIDGaT.activeWidget.pipes().findRecord('from', WIDGaT.selectedCompo.get('id') + '.' + WIDGaT.editedRecord.get('shortName'))
		console.log(records[0].get('widgat.model.compo_id') + '.' + records[0].get('shortName'));
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
					console.log(response);
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
					console.log(response);
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
		console.log('WIDGaT.controller.Actions.onActionComboBoxBeforeRender');
		/*console.log('cbActions.onBeforeRender, store:', cBox.getStore());
		console.log('cbActions.onBeforeRender, cBox:', cBox);
		console.log('cbActions.onBeforeRender, eOpts:', eOpts);*/
		
		//check Pipes to select output if there
		
		Ext.apply(cBox, {
			tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{[values["widgat.model.compo_id"]]}.{name}</li></tpl>'
		});
	},
	
	onPropertyChange: function(source, recordId, value, oldValue, eOpts) {
		console.log('WIDGaT.controller.Attributes.onPropertyChange()');
		console.log('source:', source);
		console.log('recordId:', recordId);
		console.log('value:', value);
		console.log('oldValue:', oldValue);
		console.log('eOpts:', eOpts);
	},
	
	onBeforeSelect: function(rowModel, record, index) {
		return !(index == 0);
	}
})