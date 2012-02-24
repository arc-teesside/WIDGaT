// JavaScript Document

Ext.define('WIDGaT.view.action.ComboBox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.actioncombobox',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, {
			//tpl: '<tpl for="."><div class="x-combo-list-item" >'+me.getView()+'.{name}</div></tpl>',
			//tpl: '<tpl for="."><li role="option" class="x-boundlist-item">.{name}</li></tpl>',
			allowBlank: true,
			blankText: 'Select Action',
			editable: false,
			store: WIDGaT.actionStore,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'shortName'
		});
		this.callParent(arguments);
	}
});