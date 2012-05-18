/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.WelcomeWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.welcomewindow',
    
    initComponent: function() {
		Ext.apply(this, {
			id: 'welcomeWindow',
			width: 600,
			height: 375,
			autoShow: true,
			preventHeader: true,
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
				flex: 1,
				minHeight: 90,
				border: false,
				bodyStyle: 'background:url(resources/images/WIDGaT_Logo_bg.png); text-align: center; padding-top:10px;'
			}, {
				xtype: 'panel',
				border: false,
				bodyStyle: 'padding: 15 15 0 15;text-align:justify;line-height:1.7em;',
				html: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>W</b>idget <b>D</b>esign <b>A</b>uthoring <b>T</b>oolkit <b>(WIDGaT)</b> is a JISC-funded Learning and Teaching Innovation project led by the Accessibility Research Centre at Teesside University.'
					+ 'The WIDGaT toolkit supports the design, development and sharing of widgets, by enabling teachers and students to easily create bespoke widgets.',
					//+ 'By engaging pedagogical and technical experts with our intended end users the objective is to produce a WIDGaT authoring tool that enables teachers or students to develop and share bespoke widgets.',
				flex: 1
			}, {
				xtype: 'panel',
				border: false,
				layout: 'fit',
				bodyStyle: 'padding: 5 100 20 100;',
				items: {
					id: 'startButton',
					xtype: 'button',
					text: '<b>Click here to Start</b>'
				}
			}, {
				xtype: 'panel',
				border: false,
				style: {
					textAlign: 'center'
				},
				bodyStyle: 'padding: 0 100 0 100;',
				items: {
					xtype: 'button',
					text: 'First timer ?',
					handler: function(btn, eOtps) {
						Ext.create('WIDGaT.view.VideoGuideWindow');
					}
				}
			}, {
				xtype: 'panel',
				border: false,
				flex: 1,
				html: '<hr style="width:490px; height:1px;margin:auto;margin-bottom:10px;margin-top: 20px;" />'
					+ '<div id="welcome_logo">'
                    + '  <div style="float:right;margin-left:10px;"><img src="resources/images/arc_logo.png" alt="ARC Lab"></div>'
                    + '  <div style="float:right;"><a href="http://arc.tees.ac.uk/" target="_blank">Accessibility Research Centre</a><br>Teesside University,<br>Middlesbrough, Tees Valley, TS1 3BA, UK</div>'
                    + '</div>'
			}]
		});
        this.callParent(arguments);
    }
	
	
});