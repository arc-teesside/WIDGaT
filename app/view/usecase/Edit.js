/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.usecase.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.usecaseedit',
    
    title : 'Usecase',
    
    initComponent: function() {
    	var me = this;
		Ext.apply(me, {
			id: 'usecase-form',
			bodyStyle:'padding:5px 5px 0',
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			defaultType: 'textfield',
			border:false,
			items: [{
				id: 'txt_keywords',
				fieldLabel: 'Keywords',
				name: 'keywords',
				anchor: '80%',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Keywords</b><br />The keywords are automatically selected from your widget\'s content. You are free to edit them'		
						});	
					}
				}
			}, {
				xtype: 'combo',
				id: 'cb_persona',
				fieldLabel: 'Persona',
				name: 'cbPersona',
				store: Ext.create('WIDGaT.store.Personas'),
			    queryMode: 'local',
			    displayField: 'short',
			    valueField: 'name',
			    forceSelection: false,
			    emptyText:'Select a persona',
				anchor: '100%',
				editable: false,
				listeners: {
			         scope: this,
			         'select': me.onPersonaSelect,
					 'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Persona</b><br />This is a list of available Personas. You can choose, edit or create your own in the "Persona details" textbox'
						});	
					}
			    }
			},{
				xtype: 'textareafield',
				id: 'persona',
				fieldLabel: 'Persona Details',
				name: 'persona',
				allowBlank: false,
				anchor: '100%',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Persona Details</b><br />You can edit or create your persona here'
						});	
					}
				}
			}, /*{
				xtype: 'combo',
				fieldLabel: 'Scenario',
				name: 'cbScenario',
				store: Ext.create('WIDGaT.store.Scenarios'),
			    queryMode: 'local',
			    displayField: 'short',
			    valueField: 'name',
			    forceSelection: false,
			    emptyText:'Select a scenario',
				anchor: '100%',
				editable: false,
				listeners: {
			         scope: this,
			         'select': me.onScenarioSelect
			    }
			},*/{
				xtype: 'textareafield',
				id: 'scenario',
				fieldLabel: 'Scenario Details',
				name: 'scenario',
				anchor: '100%',
				listeners: {
					scope: this,
					'render': function(cmp) {
						cmp.tip = Ext.create('Ext.tip.ToolTip', {
							target: cmp.el,
							showDelay: 0,
							trackMouse: true,
							dismissDelay: 0,
							hideDelay: 0,
							html: '<b>Enter a scenario</b><br />Here is an example: George is due on his first placement in January 2011. He would like a widget that would let help him to remember where to go, who to meet and set an alarm to remind him of the time he has to arrive. It needs to be highly visual and easy to use.'
							
						});	
					}
				}
			}]
		});
		
        this.callParent(arguments);
    },
    
    onPersonaSelect: function(combo, records) {
    	this.down('#persona').setValue(combo.getValue());
    },
    
    onScenarioSelect: function(combo, records) {
    	this.down('#scenario').setValue(combo.getValue());
    }
});