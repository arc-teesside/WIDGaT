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
			src : 'temp/TimerTemplate/index.html',
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
			var bodyID = doc.dom.getElementsByTagName("body")[0]; 
			
			var editorScript = doc.dom.createElement('script');
			editorScript.type = 'text/javascript';
				
			if(window.location.hostname == "localhost")
				editorScript.src = 'http://localhost/WIDGaT/temp/TimerTemplate/scripts/editorlib.js';
			else
				editorScript.src = 'http://arc.tees.ac.uk/widest/libraries/editorlib.js';
			
			var extScript = doc.dom.createElement('script');
			extScript.type = 'text/javascript';
			extScript.src = 'http://arc.tees.ac.uk/widest/libraries/ext-all-debug.js';
			
			var extStyle = doc.dom.createElement('link');
			extStyle.rel = "stylesheet";
			extStyle.type = 'text/css';
			extStyle.href = "http://arc.tees.ac.uk/WIDEST/Libraries/resources/css/ext-all.css";
			
			headID.appendChild(extStyle);
			headID.appendChild(extScript);
			
			
			var newStyle = doc.dom.createElement('style');
			newStyle.type = 'text/css';
			
			var stl = '.placeholder {'
					+ '		display: block;'
					+ '		width: 100%;'
					+ '		min-height: 15px;'
					+ '		position:relative;'
					+ '		border: 1px dashed #2a7fff;'
					//+ '		background: url(http://arc.tees.ac.uk/WIDGaT/Tool/resources/images/placeholder_bg.png) no-repeat;'
					+ '}'
					/*+ '.placeholder:hover {'
					+ '		border: 1px dashed grey;'
					+ '}'*/
					+ '.box-title {'
					+ '		width: 66px;'
					+ '		height: 15px;'
					+ '		position: absolute;'
					+ '		top:-1px;'
					+ '		left:-1px;'
					+ '}'
					+ '.component {'
					+ '		cursor: pointer;'
					+ '		border: none;'
					+ '}'
					+ '.component:hover {'
					+ '		border: 1px dashed grey;'
					+ '}'
					+ '.selected {'
					+ '		border: 2px solid grey;'
					+ '}';
			
			var ts = document.createTextNode(stl);
			newStyle.appendChild(ts);
			
			headID.appendChild(newStyle);
			
			bodyID.appendChild(editorScript);
		}
	}
});