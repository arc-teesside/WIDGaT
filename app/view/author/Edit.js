/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.author.Edit' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.authoredit',
    
    initComponent: function() {
		Ext.apply(this, {
			bodyStyle:'padding:5px 5px 0',
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			defaultType: 'textfield',
			border:false,
			items: [{
				xtype: 'panel',
				border: false,
				html: '<h1>Author</h1><br />'
			}, {
				id: 'name',
				fieldLabel: 'Name',
				name: 'name',
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
							html: '<b>Name</b> <i>optional</i><br />Your name will only be used as part of the widget\'s information. This is according to the standard for W3C widgets'
						});	
					}
				}
			}, {
				id: 'email',
				fieldLabel: 'Email',
				name: 'email',
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
							html: '<b>Email</b> <i>optional</i><br />Your email will only be used as part of the widget\'s information. This is according to the standard for W3C widgets'
						});	
					}
				}
			}, {
				id: 'link',
				fieldLabel: 'Link',
				name: 'link',
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
							html: '<b>Link</b> <i>optional</i><br />The link is basically whatever website you would like to add as part of your information. It can be a blog, personal website, etc... This is according to the standard for W3C widgets'
						});	
					}
				}
			}, {
				id: 'organisation',
				fieldLabel: 'Organisation',
				name: 'organisation',
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
							html: '<b>Organisation</b> <i>optional</i><br />You may share your affiliation. This is according to the standard for W3C widgets'
						});	
					}
				}
			}]
		});
        this.callParent(arguments);
    }
});