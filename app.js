/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
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
		'Actions',
		'Library'
    ],
    
    autoCreateViewport: true,
    
    launch: function() {
	
		WIDGaT.debug = true;
		window.myAppGlobal = this;
    	if(WIDGaT.debug) console.log("WIDGaT.launch()");
		
		Ext.QuickTips.init();
		
		Ext.apply(Ext.QuickTips.getQuickTip(), {
			dismissDelay: 0,
			showDelay: 100 ,
			trackMouse: true
		});
		
    }
});