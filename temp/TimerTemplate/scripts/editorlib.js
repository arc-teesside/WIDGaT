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
