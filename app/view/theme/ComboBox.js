Ext.define('WIDGaT.view.theme.ComboBox', {
	extend: 'Ext.form.ComboBox',
	alias: 'widget.themecombobox',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, { 
			id: 'cb_theme',
			name: 'cbTheme',
			fieldLabel: 'Theme',
			allowBlank: true,
			forceSelection: false,
			blankText: 'Select a theme',
			emptyText:'Select a theme',
			editable: false,
			queryMode: 'local',
			displayField: 'name',
			valueField: 'file',
			anchor: '100%'
		});
		this.callParent(arguments);
	}
});