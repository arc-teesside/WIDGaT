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
        {ref: 'widgetView', selector: 'widgetview'}
    ],
	
    init: function() {
    	var me = this;
        me.control({
            'actioncombobox': {
                select: me.onActionComboBoxSelect,
				beforerender: me.onActionComboBoxBeforeRender
            }
        });
    },
	
	onActionComboBoxSelect: function(cBox, records) {
		console.log('WIDGaT.controller.Actions.onActionComboBoxSelect');
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
		
		
		//update pipes on select here or when attribute store is updated in widget controller
	},
	
	onActionComboBoxBeforeRender: function(cBox, eOpts) {
		console.log('WIDGaT.controller.Actions.onActionComboBoxBeforeRender');

		//check Pipes to select action if there
		
		Ext.apply(cBox, {
			tpl: '<tpl for="."><li role="option" class="x-boundlist-item">{[values["widgat.model.compo_id"]]}.{name}</li></tpl>'
			//tpl: '<tpl for="."><div class="x-combo-list-item" >'+ cBox.getStore().first().get('widgat.model.compo_id') +'.{name}</div></tpl>'
		});
		
		console.log('cbActions.onBeforeRender, cBox:', cBox);
	}
})