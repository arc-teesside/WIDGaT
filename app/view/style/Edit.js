/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.style.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.styleedit',

    title : 'Component Style',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'style-form',
			autoScroll: true,
			region: 'north',
			split: true,
			flex: 1,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			bodyStyle: 'padding: 10 5 0 5;',
			defaultType: 'textfield',
			items: [
				Ext.create("WIDGaT.view.theme.ComboBox"), 
				{
					xtype: 'container',
					anchor: '100%',
					layout:'column',
					style: {
						textAlign: 'center',
						marginTop: '20px'
					},
					defaults: {
						columnWidth: 1/3
					},
					items:[{
						xtype: 'container',
						layout: 'anchor',
						items: {
							xtype: 'button',
							itemId : 'justifyleft',
							cls : Ext.baseCSSPrefix + 'btn-icon',
							iconCls: Ext.baseCSSPrefix + 'edit-justifyleft',
							enableToggle: false
						}
					}, {
						xtype: 'container',
						layout: 'anchor',
						items: {
							xtype: 'button',
							itemId : 'justifycenter',
							cls : Ext.baseCSSPrefix + 'btn-icon',
							iconCls: Ext.baseCSSPrefix + 'edit-justifycenter',
							enableToggle: false
						}
					}, {
						xtype: 'container',
						layout: 'anchor',
						items: {
							xtype: 'button',
							itemId : 'justifyright',
							cls : Ext.baseCSSPrefix + 'btn-icon',
							iconCls: Ext.baseCSSPrefix + 'edit-justifyright',
							enableToggle: false
						}
					}]
				}, {
					xtype: 'container',
					anchor: '100%',
					layout:'column',
					style: {
						textAlign: 'center',
						marginTop: '20px'
					},
					defaults: {
						columnWidth: 0.25
					},
					items:[{
						xtype: 'container',
						layout: 'anchor',
						style: {
							lineHeight: '22px',
							textAlign: 'left',
							verticalAlign: 'bottom'
						},
						html: 'Text:'
					}, {
						xtype: 'container',
						layout: 'anchor',
						style: {
							textAlign: 'left'
						},
						items: {
							xtype: 'splitbutton',
							text: '<div style="width: 14px; height: 14px; background-color: black; border: 1px solid black" id="text-color-picker"></div>',
							menu: new Ext.menu.Menu({
								items: [
									Ext.create('Ext.picker.Color', {
										value: '000000',
										listeners: {
											select: function(picker, selColor) {
												Ext.fly('text-color-picker').setStyle('background-color', selColor);
												Ext.menu.Manager.hideAll();
											}
										}
									})
								]
							})
						}
					}, {
						xtype: 'container',
						layout: 'anchor',
						style: {
							lineHeight: '22px',
							textAlign: 'left',
							verticalAlign: 'bottom'
						},
						html: 'Background:'
					}, {
						xtype: 'container',
						layout: 'anchor',
						items: {
							xtype: 'splitbutton',
							text: '<div style="width: 14px; height: 14px; background-color: white; border: 1px solid black" id="bg-color-picker"></div>',
							menu: new Ext.menu.Menu({
								items: [
									Ext.create('Ext.picker.Color', {
										value: '000000',
										listeners: {
											select: function(picker, selColor) {
												Ext.fly('bg-color-picker').setStyle('background-color', selColor);
												Ext.menu.Manager.hideAll();
											}
										}
									})
								]
							})
						}
					}]
				}, {
					xtype: 'combobox',
					fieldLabel: 'Display',
					queryMode: 'local',
					displayField: 'text',
					valueField: 'value',
					width: '100px',
					editable: false,
					style: {
						marginTop: '20px'
					},
					store: Ext.create('Ext.data.Store', {
						fields: ['value', 'text'],
						data : [
							{"value":"block", "text":"Block"},
							{"value":"inline", "text":"Inline"}
						]
					})
				}
			],
			listeners: {
				scope: this,
				'render': function(cmp) {
					/*cmp.tip = Ext.create('Ext.tip.ToolTip', {
						target: cmp.el,
						showDelay: 0,
						trackMouse: true,
						dismissDelay: 0,
						hideDelay: 0,
						html: '<b>Component Style</b><br />The component\'s style is not yet supported. This is only as an example.'
					});*/
				}
			}
		});
        this.callParent(arguments);
    }
});