/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.NewWindow' ,{
	extend: 'Ext.window.Window',
	alias : 'widget.newwindow',
	
	title : 'New Widget',
	
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			height: 326,
			width: 500,
			layout: 'card',
			items: [
				Ext.create('WIDGaT.view.template.Select'),
				Ext.create('WIDGaT.view.widget.Edit'),
				Ext.create('WIDGaT.view.usecase.Edit')
			],
			bbar: [
				'->',
				{
					id: 'move-prev',
					text: 'Back',
					handler: function(btn) {
						me.navigate("prev");
					},
					disabled: true
				},
				{
					id: 'move-next',
					text: 'Next',
					disabled: true,
					handler: function(btn) {
						me.navigate("next");
					}
				},
				{
					id: 'move-finish',
					text: 'Finish',
					disabled: true
				}
			]
		});
		this.callParent(arguments);
	},
	
	navigate:function(direction){
	    var layout = this.getLayout();
		
		if(layout.getActiveItem().id == 'template-list') {
			//first panel: select template
			var vt = this.down('selecttplpanel');
			var tplName = null;
			
			Ext.each(vt.items.items, function(i) {
				if(i.down('templateDataView')) {
					if(i.down('templateDataView').getSelectedNodes().length > 0) {
						tplName = i.down('templateDataView').getSelectedNodes()[0].id;
						WIDGaT.newWidget.objTpl = i.down('templateDataView').getRecord(i.down('templateDataView').getSelectedNodes()[0]);
					}
				}
			});
			
			WIDGaT.newWidget.set('template', tplName);
			
			layout[direction]();
			Ext.getCmp('move-prev').setDisabled(false);
			Ext.getCmp('move-finish').setDisabled(false);
		}
		else if (layout.getActiveItem().id == 'widget-form') {
			//second panel: widget details form
			
			
			
			layout.getNext().getForm().getFields().get('txt_keywords').setValue(WIDGaT.newWidget.objTpl.get('keywords'));
			
			layout[direction]();
			Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
			Ext.getCmp('move-next').setDisabled(!layout.getNext());
		}
		else if (layout.getActiveItem().id == 'usecase-form') {
			//third and last panel: usecase widget details
			
			layout[direction]();
			Ext.getCmp('move-prev').setDisabled(false);
			Ext.getCmp('move-next').setDisabled(false);
		}
	}
});