/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.MenuBar', {
	extend: 'Ext.toolbar.Toolbar',
	alias: 'widget.topmenubar',
	
	
	initComponent: function() {
        var me = this;
        
        Ext.apply(me, {
        	region: 'north',
			style: {
				borderLeft: 0,
				borderTop: 0,
				borderRight: 0
			},
            items: [{
					text: 'File',
					menu: {
						items: [{
								id: 'newButton',
								text: 'New'/*,
							    handler: function() {
							        newWindow.show();
							    }*/
							}, '-', {
								id: 'previewButton',
								text: 'Preview',
								disabled: true
							}, '-',	{
								id: 'openButton',
								text: 'Open',
								disabled: true
							}, {
								id: 'saveButton',
								text: 'Save',
								disabled: true/*,
							    handler: function() {
							        saveWindow.show();
							    }*/
							}, {
								id: 'exportButton',
								text: 'Export &amp; Share',
								disabled: true
							}, '-', {
								id: 'closeButton',
								text: 'Close',
								disabled: true
						}]
					}
				}, {
					text : 'Edit',
					menu: [{
							id: 'undoButton',
							text: 'Undo',
							disabled: true	
						}, {
							id: 'redoButton',
							text: 'Redo',
							disabled: true
						}, '-', {
							text: 'Copy'	
						}, {
							text: 'Cut'	
						}, {
							text: 'Paste',
							disabled: true	
						}, '-', {
							text: 'Preferences'	
					}]
				}, {
					text: 'View',
					menu: [
						{
							id: 'widgetDetailsButton',
							text: 'Widget Details',
							disabled: true/*,
							handler: function() {
								usecaseWindow.show();
							}*/
						}, {
							id: 'usecaseButton',
							text: 'Usecase',
							disabled: true/*,
							handler: function() {
								usecaseWindow.show();
							}*/
						}, '-', {
							id: 'includedButton',
							text: 'Included Components',
							disabled: true/*,
							handler: function() {
								usecaseWindow.show();
							}*/
						}
					]
				}, {
					text: 'Help',
					menu: [
						{
							text: 'Help',
							//iconAlign: "right",
							icon: "resources/images/ExternalLink.gif",
							handler: function() {
								window.open("http://arc.tees.ac.uk/WIDGaT/?p=guides", "_blank");
							}/*,
							listeners: {
								mouseover: function() {
									this.setIcon("resources/images/ExternalLink.gif");
								},
								mouseout: function() {
									this.setIcon("");
								}
							}*/
						}, {
							text: 'FaQ'	
						}, '-',
						{
							text: 'About'	
						}
					]
				}, {
					text: 'Feedback & Support',
					id: 'feedbackButton'
				},
				' ',
				{
					xtype: 'tbtext',
					html: '<img src="resources/images/WIDGaT_LogoTB.png" style="height:22px;" />',
					flex:12,
					style: {
						textAlign: 'center'
					}
				},
				'->', {
					id: 'urlDisplay',
					xtype: 'tbtext'
				}
			]
        });
                
        me.callParent(arguments);
    }
});