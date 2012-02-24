Ext.Loader.setConfig({
				enabled:true,
				paths:{
					'Ext.ux': 'extjs/src/ux'
				}
			});
Ext.application({
    name: 'WIDGaT',

    appFolder: 'app',
	
	controllers: [
		'Widgets',
        'Compos',
        'Attributes',
        'Templates',
		'Guidances',
		'Actions'
    ],
    
    autoCreateViewport: true,
    
    launch: function() {
    	console.log("WIDGaT.launch()sdf");

		Ext.QuickTips.init();
		Ext.apply(Ext.QuickTips.getQuickTip(), {
			dismissDelay: 0,
			showDelay: 100 ,
			trackMouse: true
		});
    }
});