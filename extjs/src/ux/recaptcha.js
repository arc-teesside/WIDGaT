
Ext.define('WIDGaT.util.ReCaptcha', { 
	extend : 'Ext.Component',
	alias : 'widget.recaptcha',

	onRender : function(ct, position){
		var me = this;
		me.callParent(arguments);

		me.recaptcha = me.el.createChild({
			tag : "div",
			id : me.recaptchaId
		});

		Recaptcha.create(me.publickey, me.recaptcha.id, {
			theme: me.theme,
			lang: me.lang,
			callback: Recaptcha.focus_response_field
		});

		//me.recaptcha.setWidth(me.el.getWidth(true));

	},

	getChallenge: function(){
		return Recaptcha.get_challenge();
	}, 

	getResponse: function(){
		return Recaptcha.get_response();
	}

});