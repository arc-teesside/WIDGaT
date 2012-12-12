/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/

Ext.define('WIDGaT.view.feedback.FeedbackForm' ,{
    extend: 'Ext.form.Panel',
    alias : 'widget.feedbackform',

    initComponent: function() {
		Ext.apply(this, {
			id: 'widget-form',
			bodyStyle:'padding:5px 5px 0',
			autoScroll: true,
			border: false,
			fieldDefaults: {
				msgTarget: 'side',
				labelAlign: 'left',
				anchor: '100%'
			},
			defaultType: 'textfield',
			items: [{
				fieldLabel: 'Name',
				inputId: 'feedback-txt-name',
				afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
				name: 'name',
				allowBlank: false
			},{
				fieldLabel: 'Email',
				inputId: 'feedback-txt-email',
				afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
				name: 'email',
				allowBlank: false,
				vtype:'email'
			}, {
				fieldLabel: 'Comment',
				xtype: 'textareafield',
				afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>',
				name: 'comment',
				rows: 6,
				allowBlank: false
			},Ext.create('WIDGaT.util.ReCaptcha',{
				fieldLabel: 'Captcha',
				name: 'recaptcha',
				recaptchaId: 'recaptcha',
				publickey: '6LeQc9cSAAAAAIxDsVMQrY0iE6WZaJOJL5sGuR93',
				theme: 'white',
				lang: 'en'
			})]
		});
        this.callParent(arguments);
    }
});