/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.Viewport', {
    extend: 'Ext.Viewport',
	alias: 'widget.widgatviewport',
    layout: 'border',
    
    initComponent: function() {
        var me = this;
        
        Ext.apply(me, {
            items: [ Ext.create('WIDGaT.view.widget.ViewWindow'),
					/*Ext.create('Ext.window.Window', {
					id: 'stageFrame',
					disabled: true,
					title: 'Widget',
					autoShow: true,
					width: 350,
					height: 408,
					style: {
						margin: 'auto'
					},
					bodyStyle: {
						background: "white"
					},
					tools:[{
						type:'refresh',
						tooltip: 'Refresh form Data',
						// hidden:true,
						handler: function(event, toolEl, panel){
							// refresh logic
						}
					},
					{
						type:'help',
						tooltip: 'Get Help',
						handler: function(event, toolEl, panel){
							// show help here
						}
					}],
					items: Ext.create(Ext.ux.ManagedIframe.Component , {
						frameName : 'MIFportal',
						eventsFollowFrameLinks : true,
						src : 'temp/TimerTemplate/index.htm'
						,listeners : {          //These listeners clear themselves on destruction
							datasetchanged : {
								element : 'frameElement',
								fn : function(e){
									console.info('datasetchanged', this, e.frameResetting);
								}
							},
							dataavailable : {    //raised when the document DOM is ready (same-origin only)
								element : 'frameElement',  // MIFElement reference
								fn : function(e, target){
									console.info('dataavailable');
									var doc = this.getDoc();
									if( doc){
										doc.on('click', function(e, target){
												console.log(this.id, target);
											}, this);
										this.scrollChildIntoView(this.query('#theLink a')[0]);
										
										//Uncomment when on server
										/*
										if(WIDGaT.activeWidget) {  //might cause problems
											var headID = doc.dom.getElementsByTagName("head")[0];         
											var newScript = doc.dom.createElement('script');
											newScript.type = 'text/javascript';
											newScript.src = 'http://arc.tees.ac.uk/widest/libraries/editorlib.js';
											
											var newScript2 = doc.dom.createElement('script');
											newScript.type = 'text/javascript';
											newScript.src = 'http://arc.tees.ac.uk/widest/libraries/ext-all-debug.js';
											
											headID.appendChild(newScript);
											headID.appendChild(newScript2);
											var newStyle = doc.dom.createElement('style');
											newStyle.type = 'text/css';
											
											var stl = '.component {'
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
										}*//*
									}
								}
							},
							load : {
								element : 'frameElement',
								fn : function(e, target){
								   console.info(this.id, ' is loaded,' , this.isReset);
								}
							},
							resize : {
								element : 'frameElement',
								fn : function(e, target){
									e.frameResetting || console.info(this.id, ' was resized,' ,this.isReset);
			
								}
							}
						}
					})
				}),*/
                Ext.create('WIDGaT.view.MenuBar'),
				{	
					id: 'eastPanel',
					xtype: 'panel',
					disabled: true,
					region: 'east',
					margins:'5 5 5 0',
					split: true,
					width: 300,
					layout: {
						type: 'vbox',
						align: 'stretch'
					},
					items: [
						Ext.create('WIDGaT.view.style.Edit'),
						Ext.create('WIDGaT.view.attribute.List')
					]
				},
                Ext.create('WIDGaT.view.compo.List'),
				//Ext.create('WIDGaT.view.widget.NewWindow'),
				//Ext.create('WIDGaT.view.widget.SaveWindow'),
                /*Ext.create('Ext.Panel', {

                	id: 'images-view',
                	split: true,
                	region: 'south',
                	height: 100,
                	items: Ext.create('WIDGaT.view.compo.DataView')

                }),*/
                Ext.create('Ext.Panel', {
					id:'centerPanel',
                	region: 'center',
                	margins:'5 0 5 0',
					layout: 'border',
					disabled: true,
					bodyStyle: {
						background: "lightgrey"
					},
					items: [ 
						Ext.create('WIDGaT.view.guidance.List'),
						{
							xtype: 'panel',
							region: 'center',
							bodyStyle: {
								background: "lightgrey"
							}
						}]
					/*,
					items: {
						xtype: 'panel',
						width: 344,
						height: 380,
						frame: true,
						style: {
							margin: 'auto',
							marginTop: '20%'
						},
						bodyStyle: {
							background: "white"
						},
						tools:[{
							type:'refresh',
							tooltip: 'Refresh form Data',
							// hidden:true,
							handler: function(event, toolEl, panel){
								// refresh logic
							}
						},
						{
							type:'help',
							tooltip: 'Get Help',
							handler: function(event, toolEl, panel){
								// show help here
							}
						}],
						id: 'stageFrame',
						items: Ext.create(Ext.ux.ManagedIframe.Component , {
							frameName : 'MIFportal',
							eventsFollowFrameLinks : true,
							src : 'http://localhost/TimerTemplate/index.htm'
							,listeners : {          //These listeners clear themselves on destruction
								datasetchanged : {
									element : 'frameElement',
									fn : function(e){
										console.info('datasetchanged', this, e.frameResetting);
									}
								},
								dataavailable : {    //raised when the document DOM is ready (same-origin only)
									element : 'frameElement',  // MIFElement reference
									fn : function(e, target){
										console.info('dataavailable');
										var doc = this.getDoc();
										if( doc){
											doc.on('click', function(e, target){
													console.log(this.id, target);
												}, this);
											this.scrollChildIntoView(this.query('#theLink a')[0]);
											
											var headID = doc.dom.getElementsByTagName("head")[0];         
											var newScript = doc.dom.createElement('script');
											newScript.type = 'text/javascript';
											
											var scr = '$(".component").mouseover(function() {$(this).css("border", "1px dashed grey")}); $(".component").mouseout(function() {$(this).css("border", "")}); ';
											var tt = document.createTextNode(scr);
											newScript.appendChild(tt);
											
											headID.appendChild(newScript);
											
											var newStyle = doc.dom.createElement('style');
											newStyle.type = 'text/css';
											
											var stl = '.component {'
													+ '		cursor: pointer;'
													+ '}';
											
											var ts = document.createTextNode(stl);
											newStyle.appendChild(ts);
											
											headID.appendChild(newStyle);
										}
									}
								},
								load : {
									element : 'frameElement',
									fn : function(e, target){
									   console.info(this.id, ' is loaded,' , this.isReset);
									}
								},
								resize : {
									element : 'frameElement',
									fn : function(e, target){
										e.frameResetting || console.info(this.id, ' was resized,' ,this.isReset);
				
									}
								}
							}
						})
					}*/
                }),
				Ext.create('WIDGaT.view.WelcomeWindow')
            ]
        });
                
        me.callParent(arguments);
    }
    /*items: 
        [
			topBar,
			leftPanel,
			rightPanel, {
				xtype: 'compolist',
				region: 'center',
				//tbar: txtEditor.getToolbar(),
				margins:'5 0 0 0'
			}
		]*/
});