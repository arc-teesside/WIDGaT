function GetOffset (object, offset) {
	if (!object)
		return;
	offset.x += object.offsetLeft;
	offset.y += object.offsetTop;

	GetOffset (object.offsetParent, offset);
}

window.editable = true;

var flag = 0;

if(top.WIDGaT.selectedCompo) {
	document.getElementById(top.WIDGaT.selectedCompo.get('id')).className += " selected";
}

document.setSelected = function(cmpId) {
	document.deselectAll();
	document.getElementById(top.WIDGaT.selectedCompo.get('id')).className += " selected";
}

 document.deselectAll = function() {
	Ext.each(Ext.DomQuery.select('.component'), function(el) {
		var tpEl = new Ext.Element(el);
		if(tpEl.hasCls('selected')) { //toggleing only if the component is selected
			tpEl.toggleCls('selected');
		}
	});
}

function onFunctionAvailable(sMethod, oCallback, oObject, bScope) {
	try {
		if (typeof(eval(sMethod)) === 'object') {
			bScope ? oCallback.call(oObject) : oCallback(oObject);
		} else {
			setTimeout(function () {
				onFunctionAvailable(sMethod, oCallback, oObject, bScope);
			}, 50);
		}
	} catch(err) {
		//console.log('err', err);
		setTimeout(function () {
			onFunctionAvailable(sMethod, oCallback, oObject, bScope);
		}, 50);
	}
}

function initEditor() {
	Ext.each(Ext.DomQuery.select('.placeholder'), function(el) {
			//var tpEl = new Ext.Element(el);

			var phDiv = document.createElement("div");
			phDiv.className = "box-title";
			
			var phBG = document.createElement("img");
			phBG.src = "http://arc.tees.ac.uk/WIDGaT/Tool/resources/images/placeholder_bg.png";
			
			phDiv.appendChild(phBG);
			el.appendChild(phDiv);
			
	});
	
	var overrides = {
			
				// Called the instance the element is dragged.
				b4StartDrag : function() {
					// Cache the drag element
					console.log('onB4StartDrag');
					if (!this.el) {
						this.el = Ext.get(this.getEl());
					}

					//Cache the original XY Coordinates of the element, we'll use this later.
					this.originalXY = this.el.getXY();
				},
				// Called when element is dropped not anything other than a dropzone with the same ddgroup
				onInvalidDrop : function() {
					// Set a flag to invoke the animated repair
					this.invalidDrop = true;
				},
				// Called when the drag operation completes
				endDrag : function() {
					// Invoke the animation if the invalidDrop flag is set to true
					if (this.invalidDrop === true) {
						// Remove the drop invitation
						this.el.removeCls('dropOK');

						// Create the animation configuration object
						var animCfgObj = {
							easing   : 'elasticOut',
							duration : 1,
							scope    : this,
							callback : function() {
								// Remove the position attribute
								this.el.dom.style.position = '';
							}
						};

						// Apply the repair animation
						this.el.moveTo(this.originalXY[0], this.originalXY[1], animCfgObj);
						delete this.invalidDrop;
					}
				},
				
				// Called upon successful drop of an element on a DDTarget with the same
				onDragDrop : function(evtObj, targetElId) {
					// Wrap the drop target element with Ext.Element
					var dropEl = Ext.get(targetElId);

					// Perform the node move only if the drag element's
					// parent is not the same as the drop target
					if (this.el.dom.parentNode.id != targetElId) {

						// Move the element
						dropEl.appendChild(this.el);

						// Remove the drag invitation
						this.onDragOut(evtObj, targetElId);

						// Clear the styles
						this.el.dom.style.position ='';
						this.el.dom.style.top = '';
						this.el.dom.style.left = '';
					}
					else {
						// This was an invalid drop, initiate a repair
						this.onInvalidDrop();
					}
				},
				// Only called when the drag element is dragged over the a drop target with the same ddgroup
				onDragEnter : function(evtObj, targetElId) {
					// Colorize the drag target if the drag node's parent is not the same as the drop target
					if (targetElId != this.el.dom.parentNode.id) {
						this.el.addCls('dropOK');
					}
					else {
						// Remove the invitation
						this.onDragOut();
					}
				},
				// Only called when element is dragged out of a dropzone with the same ddgroup
				onDragOut : function(evtObj, targetElId) {
					this.el.removeCls('dropOK');
				}
			};
			// Configure the cars to be draggable
			var cmpElements = Ext.DomQuery.select('.component');
			console.log('cmpElements', cmpElements);
			Ext.each(cmpElements, function(el) {
				if(el.id != "template") {
					
					var dd = new Ext.dd.DD(el, 'cmpDDGroup', {
						isTarget  : false
					});
					//Apply the overrides object to the newly created instance of DD
					Ext.apply(dd, overrides);
				}
			});

	Ext.each(Ext.DomQuery.select('.component'), function(el) {
			//var tpEl = new Ext.Element(el);
			Ext.create('Ext.tip.ToolTip', {
				target: el,
				html: el.id,
				trackMouse: true,
				showDelay: 0,
				hideDelay: 0
			});
			/*var phDiv = document.createElement("div");
			phDiv.className = "box-title";
			
			var phBG = document.createElement("img");
			phBG.src = "http://arc.tees.ac.uk/WIDGaT/Tool/resources/images/placeholder_bg.png";
			
			phDiv.appendChild(phBG);
			el.appendChild(phDiv);*/
			
			
	});
}

onFunctionAvailable('Ext', initEditor);

//console.log('Ext typeof', typeof(Ext));
document.onmousedown = function(e) {
	flag = 0;
}

document.onclick = function(e) {
	console.log("MIFrame.document.onclik(", e, ")");
	
	var elem = new Ext.Element(e.target);
	if(elem.hasCls('component'))
		var comp = elem;
	else
		var comp = elem.up('.component');
	
	
	var selected = top.Ext.ComponentManager.get('compo-list').down('compoDataView').getSelectedNodes();

	if(!comp && selected.length === 0) {
		//deselecting all component fisrt
		document.deselectAll();

		top.Ext.ComponentManager.get('compo-list').fireEvent('deselected');
	}
	//console.log(selected);
	if(comp && selected.length === 0) {
		//deselecting all component fisrt
		document.deselectAll();
		
		console.log('selected component:', comp);
		comp.toggleCls('selected');
		top.Ext.ComponentManager.get('compo-list').fireEvent('selected', comp);
	}
	
}

document.onmouseup = function(e) {
	if(flag === 0){
		/*var fireOnThis = top.document;
		var evObj = document.createEvent('MouseEvents');
		
		var offset = {x : 0, y : 0};
		GetOffset(top.document.getElementById("stageFrame"), offset);
	
		evObj.initMouseEvent( 'click', true, true, window, e.detail, e.screenX+offset.x, e.screenY+offset.y, e.clientX+offset.x, e.clientY+offset.y, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.target);
		fireOnThis.dispatchEvent(evObj);
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();*/
		console.log("Event mouseup from frame, no drag: ", e);
		var elem = new Ext.Element(e.target);
		if(elem.hasCls('component'))
			var comp = elem;
		else
			var comp = elem.up('.component');
		
		
		var selected = top.Ext.ComponentManager.get('compo-list').down('compoDataView').getSelectedNodes();

		if(!comp && selected.length === 0) {
			//deselecting all component fisrt
			document.deselectAll();

			top.Ext.ComponentManager.get('compo-list').fireEvent('deselected');
		}
		//console.log(selected);
		if(comp && selected.length === 0) {
			//deselecting all component fisrt
			document.deselectAll();
			
			console.log('selected component:', comp);
			comp.toggleCls('selected');
			top.Ext.ComponentManager.get('compo-list').fireEvent('selected', comp);
		}
	}
	else if(flag === 1){
		console.log("Event mouseup from frame: ", e);
		
		//Dragging from outside the frame
		
		var elem = new Ext.Element(e.target);
		var ph = elem;
		
		if(!elem.hasCls('placeholder'))
			ph = elem.up('.placeholder');
	
		if(elem.hasCls('component'))
			var comp = elem;
		else
			var comp = elem.up('.component');
		//check for all panels
		var cpLst = top.Ext.ComponentManager.get('compo-list');
		var selected = false;
		Ext.each(cpLst.items.items, function(i) {
			var selNodes = i.down('compoDataView').getSelectedNodes();
			if(selNodes.length != 0)
				selected = selNodes;
		});
		
		if(comp && !selected) {
			//deselecting all component fisrt
			document.deselectAll();
			
			console.log('selected component:', comp);
			comp.toggleCls('selected');
			top.Ext.ComponentManager.get('compo-list').fireEvent('selected', comp);
		} else if(ph && selected.length > 0) {
			//Selected component dropped in a placeholder
			console.log('From frame, placeholder: ', ph);
			console.log('From frame, selected comp: ', selected);
			top.Ext.ComponentManager.get('compo-list').fireEvent('dropped', selected, ph);
		}
		
		var fireOnThis = top.document;
		var evObj = document.createEvent('MouseEvents');

		evObj.initMouseEvent( 'mouseup', true, true, window, "mouse up triggered by frame", e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.target);
		fireOnThis.dispatchEvent(evObj);
	}
}

document.onmousemove = function(e) {
//		console.log("Event mousemove from frame: ", e.srcElement);
	//console.log(top.dFlag);
	var elem = new Ext.Element(e.target);
	var ph = elem.up('.placeholder');
	
	//check for all panels
	var selected = top.Ext.ComponentManager.get('compo-list').down('compoDataView').getSelectedNodes();
	
	
	//console.log(selected);
	if(ph && selected.length > 0) {
		//dragging component in a placeholder
		
		
		
		/*ph.setStyle("background-color", "blue");
		ph.setStyle("border", "5px solid red");
		console.log(ph);*/
		ph.on('mouseover', function(e, el) {
			ph.addCls('phHover');
		});
		ph.on('mouseout', function(e, el) {
			ph.removeCls('phHover');
		});
	}
	var fireOnThis = top.document;
	var evObj = document.createEvent('MouseEvents');
	
	var offset = {x : 0, y : 0};
	GetOffset(top.document.getElementById("stageFrame"), offset);

	evObj.initMouseEvent( 'mousemove', true, true, window, e.detail, e.screenX+offset.x+6, e.screenY+offset.y+28, e.clientX+offset.x+6, e.clientY+offset.y+28, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, e.target);
	fireOnThis.dispatchEvent(evObj);
	flag = 1;
}
