/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.Export' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.widgetexport',

    initComponent: function() {
		Ext.apply(this, {
			bodyStyle:'padding:5px 5px 0',
			border: false,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left'
			},
			defaultType: 'textfield',
			items: [{
				xtype: 'panel',
				border: false,
				html: '<h1>Your Widget</h1><br />' //tooltip here
			}, {
				xtype: 'panel',
				border: false,
				bodyStyle: 'text-align: center',
				html: '<a href="http://arc.tees.ac.uk/WIDEST/Widget/Output/'+WIDGaT.activeWidget.get('id')+'/">http://arc.tees.ac.uk/WIDEST/Widget/Output/'+WIDGaT.activeWidget.get('id')+'/</a><br /><br />'
			}, {
				xtype: 'panel',
				border: false,
				bodyStyle: 'text-align: center',
				defaults: {
					margin: '0 5'
				},
				items:[{
						xtype: 'button',
						text: 'Editor link',
						enableToggle: true,
						toggleGroup: 'widgetLinkShare',
						toggleHandler: function(btn, state) {
							console.log('Editor lnk');
							if(state)
								this.up('window').down('#editorLinkPanel').show();
							else
								this.up('window').down('#editorLinkPanel').hide();
						}
					}, {
						xtype: 'button',
						text: 'Embed code',
						enableToggle: true,
						toggleGroup: 'widgetLinkShare',
						toggleHandler: function(btn, state) {
							console.log('Embed code');
							if(state)
								this.up('window').down('#embedCodePanel').show();
							else
								this.up('window').down('#embedCodePanel').hide();
						}
				}]
			}, {
				xtype: 'panel',
				id: 'editorLinkPanel',
				border: false,
				hideCollapseTool: true,
				preventHeader: true,
				bodyStyle: 'text-align: center',
				hidden: true,
				padding: '10 0',
				html: '<a href="http://arc.tees.ac.uk/WIDGaT/Tool/?w='+WIDGaT.activeWidget.get('id')+'">http://arc.tees.ac.uk/WIDGaT/Tool/?w='+WIDGaT.activeWidget.get('id')+'</a><br />'
			}, {
				xtype: 'panel',
				id: 'embedCodePanel',
				border: false,
				hideCollapseTool: true,
				preventHeader: true,
				bodyStyle: 'text-align: center',
				hidden: true,
				layout: 'fit',
				items: [{
					xtype: 'textareafield',
					name: 'embedCode',
					hideLabel: true,
					readOnly: true,
					selectOnFocus: true,
					rows: 3,
					padding: '10 10 10 0',
					value: '<iframe width="560" height="315" src="http://arc.tees.ac.uk/WIDEST/Widget/Output/'+WIDGaT.activeWidget.get('id')+'/" frameborder="0"></iframe>',
					
				}]
			}, {
				xtype: 'panel',
				border: false,
				html: '<h1>Export</h1><br />'
			}, {
				xtype: 'container',
				anchor: '100%',
				layout:'column',
				style: {
					textAlign: 'center'
				},
				defaults: {
					columnWidth: 1/5
				},
				items:[{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href=""><img src="resources/images/blogger.gif" alt="Blogger" /></a><br />Blogger'
					/*html: '<div class="button button-tile" networkcode="code">'
						+ '<div title="Get Embed Code" class="button-tile-overlay"></div>'
						+ '<img src="resources/images/blogger.gif" alt="Blogger">'
						+ '</div>'*/
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href=""><img src="resources/images/google.gif" alt="iGoogle" /></a><br />iGoogle'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href=""><img src="resources/images/wordpress.gif" alt="Wordpress" /></a><br />Wordpress'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href=""><img src="resources/images/linkedin.gif" alt="linkedin" /></a><br />linkedin'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href=""><img src="resources/images/netvibes.png" alt="netvibes" /></a><br />Netvibes'
				}]
			}, {
				xtype: 'panel',
				border: false,
				html: '<br /><h1>Share</h1><br />'
			}, {
				xtype: 'container',
				anchor: '100%',
				layout:'column',
				style: {
					textAlign: 'center'
				},
				defaults: {
					columnWidth: .20
				},
				items:[{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href="http://www.jorum.ac.uk/"><img src="resources/images/logo_jorum.jpg" alt="Jorum" /></a>'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href="http://www.role-project.eu"><img src="resources/images/logo_role.png" alt="Role Project" /></a>'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href="http://www.realisepotential.org/"><img src="resources/images/logo_realise.png" alt="Realise" /></a>'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href="http://twitter.com/"><img src="resources/images/logo_twitter.png" alt="Twitter" /></a>'
				},{
					xtype: 'container',
					layout: 'anchor',
					html: '<a href="http://www.facebook.com/"><img src="resources/images/logo_facebook.gif" alt="Facebook" /></a>'
				}]
			}]
		});
        this.callParent(arguments);
    }
});