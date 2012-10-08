/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.feedback.FeedbackWindow' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.feedbackwindow',

    title : 'Feedback & Support',
    
    initComponent: function() {
		Ext.apply(this, {
			height: 344,
			width: 336,
			border: false,
			layout:'fit',
			items: Ext.create('WIDGaT.view.feedback.FeedbackForm'),
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'feedbackSend',
					text: 'Send'
				},
				{
					id: 'feedbackCancel',
					text: 'Cancel',
					handler: function(btn) {
						btn.up('feedbackwindow').close();	
					}
				}
			]
		});
        this.callParent(arguments);
    }
	
	
});