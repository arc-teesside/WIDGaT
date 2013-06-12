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
			height: 295,
			width: 336,
			border: false,
			ui: 'blue-window',
			layout:'fit',
			items: Ext.create('WIDGaT.view.feedback.FeedbackForm'),
			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'feedbackSend',
					text: 'Send',
					handler: function() {
						var form = this.up('window').down('form').getForm();
						var win = this.up('window');
						if(form.isValid()) {
							fieldValues = form.getFieldValues()
							fieldValues.widgetID = WIDGaT.activeWidget.get('id');
							//fieldValues.recaptcha_response_field = this.up('window').down('recaptcha').getResponse();
							//fieldValues.recaptcha_challenge_field = this.up('window').down('recaptcha').getChallenge();
							console.log(fieldValues);
							
							form.submit({
								clientValidation: true,
								url: 'fdbck.php',
								params: fieldValues,
								success: function(form, action) {
									Ext.Msg.alert('Thank you!', 'Thank you, your message has been successfuly sent. We will get back to you as soon as possible.');
									win.close();
								},
								failure: function(form, action) {
									switch (action.failureType) {
										case Ext.form.action.Action.CLIENT_INVALID:
											Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
											break;
										case Ext.form.action.Action.CONNECT_FAILURE:
											Ext.Msg.alert('Failure', 'Ajax communication failed');
											break;
										case Ext.form.action.Action.SERVER_INVALID:
										   Ext.Msg.alert('Failure', action.result.msg);
								   }
								   if(response.responseText == 101) {
										Ext.Msg.alert('Error', 'Incorrect Captcha, please try again.');
									}
								}
							});
							
							/*Ext.Ajax.request({
								url: 'fdbck.php',
								params: fieldValues,
								success: function(response){
									console.log(response);
									//var text = response.responseText;
									// process server response here
									Ext.Msg.alert('Thank you!', 'Thank you, your message has been successfuly sent. We will get back to you as soon as possible.');
									win.close();
								},
								failure: function(response){
									console.log(response);
									if(response.responseText == 101) {
										Ext.Msg.alert('Error', 'Incorrect Captcha, please try again.');
									}
								}
							});*/
						}
					}
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