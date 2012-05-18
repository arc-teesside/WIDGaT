/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.VideoGuideWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.videoguidewindow',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'videoGuideWindow',
			width: 600,
			height: 675,
			autoShow: true,
			style: {
				margin: 'auto'
			},
			bodyStyle: {
				background: "url(resources/images/WIDGaT_Logo_bg.png)"
			},
			border: false,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype: 'panel',
				html: '<img src="resources/images/WIDGaT_Logo.png" style="height:73px;margin:auto;" />',
				minHeight: 50,
				border: false,
				bodyStyle: 'background:url(resources/images/WIDGaT_Logo_bg.png); text-align: center; padding-top:10px; padding-bottom:10px;'
			}, {
				xtype: 'panel',
				border: false,
				bodyStyle: 'padding: 10 10 0 10;text-align:center;font-size:2em;font-wieght:bold;',
				html: '<h2>Getting Started Guide</h2>',
					//+ 'By engaging pedagogical and technical experts with our intended end users the objective is to produce a WIDGaT authoring tool that enables teachers or students to develop and share bespoke widgets.',
				flex: 2
			}, {
				xtype: 'panel',
				border: false,
				style: {
					textAlign: 'center'
				},
				html : '<iframe width="585" height="460" src="http://www.youtube.com/embed/JzzVBrAy8Cw" frameborder="0" allowfullscreen></iframe>'
			},  {
				xtype: 'panel',
				border: false,
				layout: 'fit',
				bodyStyle: 'padding: 0 100 20 100;',
				items: {
					xtype: 'button',
					text: '<b>Close window</b>',
					style: {
						marginTop: '10px'
					},
					handler: function(cmp, eOpts) {
						cmp.up('window').close();
					}
				}
			}]
		});
        this.callParent(arguments);
    }
	
	
});