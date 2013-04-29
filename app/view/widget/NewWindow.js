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
				{ xtype: 'tbtext', text: 'Page ' },
				{ xtype: 'tbtext', id: 'pageNumber', text: '1 ' },
				{ xtype: 'tbtext', text: '/  3' },
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
						
			var tplName = null;
			
			if(this.down('templateDataView')) {
				var tplDV = this.down('templateDataView');
				if(tplDV.getSelectedNodes().length > 0) {
					tplName = tplDV.getSelectedNodes()[0].id;
					WIDGaT.newWidget.objTpl = tplDV.getRecord(tplDV.getSelectedNodes()[0]);
					console.log('WIDGaT.newWidget.objTpl', WIDGaT.newWidget.objTpl);
				}
			}
			
			WIDGaT.newWidget.set('template', tplName);
			
			layout[direction]();
			
			this.down('#pageNumber').setText('2');
			Ext.getCmp('move-prev').setDisabled(false);
			Ext.getCmp('move-finish').setDisabled(false);
		}
		else if (layout.getActiveItem().id == 'widget-form') {
			//second panel: widget details form
			
			layout.getNext().getForm().getFields().get('txt_keywords').setValue(WIDGaT.newWidget.objTpl.get('keywords'));
			
			layout[direction]();
			Ext.getCmp('move-prev').setDisabled(!layout.getPrev());
			Ext.getCmp('move-next').setDisabled(!layout.getNext());
			if(!layout.getPrev())
				this.down('#pageNumber').setText('1');
			
			if(!layout.getNext())
				this.down('#pageNumber').setText('3');
		}
		else if (layout.getActiveItem().id == 'usecase-form') {
			//third and last panel: usecase widget details
			layout[direction]();
			this.down('#pageNumber').setText('2');
			Ext.getCmp('move-prev').setDisabled(false);
			Ext.getCmp('move-next').setDisabled(false);
		}
	}
});