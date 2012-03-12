/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.widget.View', {
	extend: 'Ext.ux.ManagedIframe.Component',
	alias: 'widget.widgetview',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, {
			frameName : 'MIFportal',
			eventsFollowFrameLinks : true,
			src : 'temp/TimerTemplate/index.htm',
			listeners : {          //These listeners clear themselves on destruction
				datasetchanged : {
					element : 'frameElement',
					fn : function(e){
						if(WIDGaT.debug) console.log('datasetchanged', this, e.frameResetting);
						//me.registerEditScript();
					}
				},
				dataavailable : {    //raised when the document DOM is ready (same-origin only)
					element : 'frameElement',  // MIFElement reference
					fn : function(e, target){
						if(WIDGaT.debug) console.log('WIDGaT.view.widget.View.dataavailable');
					}
				},
				load : {
					element : 'frameElement',
					fn : function(e, target){
					   if(WIDGaT.debug) console.log(this.id, ' is loaded,' , this.isReset);
					   me.registerEditScript();
					}
				},
				resize : {
					element : 'frameElement',
					fn : function(e, target){
						e.frameResetting || console.info(this.id, ' was resized,' ,this.isReset);

					}
				}
			}
		});
		this.callParent(arguments);
	},
	
	registerEditScript: function() {
		if(WIDGaT.debug) console.log('WIDGaT.view.widget.View.registerEditScript()');
		var doc = this.frameElement.getDoc();
		if(doc){
			var headID = doc.dom.getElementsByTagName("head")[0];         
			var newScript = doc.dom.createElement('script');
			newScript.type = 'text/javascript';
			newScript.src = 'http://arc.tees.ac.uk/widest/libraries/editorlib.js';
			
			var newScript2 = doc.dom.createElement('script');
			newScript2.type = 'text/javascript';
			newScript2.src = 'http://arc.tees.ac.uk/widest/libraries/ext-all-debug.js';
			
			headID.appendChild(newScript2);
			headID.appendChild(newScript);
			var newStyle = doc.dom.createElement('style');
			newStyle.type = 'text/css';
			
			var stl = '.placeholder {'
					+ '		display: block;'
					+ '		width: 100%;'
					+ '		min-height: 15px;'
					+ '}'
					+ '.placeholder:hover {'
					+ '		border: 1px dashed grey;'
					+ '}'
					+ '.component {'
					+ '		cursor: pointer;'
					+ '		border: none;'
					+ '}'
					+ '.component:hover {'
					+ '		border: 1px dashed grey;'
					+ '}'
					+ '.selected {'
					+ '		border: 1px dashed grey;'
					+ '}';
			
			var ts = document.createTextNode(stl);
			newStyle.appendChild(ts);
			
			headID.appendChild(newStyle);
		}
	}
});