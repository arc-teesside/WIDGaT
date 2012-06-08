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
	
	$('.component').each(function(index, el) {
		var jEl = $(el);
		if(jEl.hasClass('selected')) { //toggleing only if the component is selected
			jEl.toggleClass('selected');
		}
	});
	
	/*Ext.each(Ext.DomQuery.select('.component'), function(el) {
		var tpEl = new Ext.Element(el);
		if(tpEl.hasCls('selected')) { //toggleing only if the component is selected
			tpEl.toggleCls('selected');
		}
	});*/
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

function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}

$(document).ready(function() {

	/////////////////////     jQuery     /////////////////////
	
	$('.placeholder').each(function(index, elem) {
		
		var phDiv = document.createElement("div");
		phDiv.className = "box-title";
		
		var phBG = document.createElement("img");
		phBG.src = "http://arc.tees.ac.uk/WIDGaT/Tool/resources/images/placeholder_bg.png";
		
		phDiv.appendChild(phBG);
		elem.appendChild(phDiv);
		
		//new Ext.dd.DDTarget(el.id,'cmpDDGroup');
		$( "#"+elem.id ).sortable({
			connectWith: '.placeholder',
			tolerance: 'pointer',
			placeholder: 'ui-state-highlight',
			cancel: false,
			cursorAt: { left: 6, top: 6 },
			start: function(event, ui) { 
			
				$(ui.placeholder).css('height', $(ui.item).css('height'));
				$(ui.placeholder).css('width', $(ui.item).css('width'));
			},
			update: function(event, ui) {
				console.log('event', event);
				console.log('ui', ui.item);
				
				var sibling = ui.item.prev('.component');
				
				var targetPh = ui.item.parent('.placeholder');
				
				var eOpts = new Object();
				eOpts.rootId = ui.item.attr('id');
				eOpts.targetPh = targetPh.attr('id');
				eOpts.before = false;
				eOpts.after = false;
				
				console.log('targetPh', targetPh);
				if(sibling.length > 0) {
					//move after
					eOpts.after = sibling.attr('id');
				}
				else {
					sibling = ui.item.next('.component')
					if(sibling.length > 0) {
						//move before
						eOpts.before = sibling.attr('id');
					}
					
				}
				
				top.Ext.ComponentManager.get('compo-list').fireEvent('moved', eOpts);
			}
		});
	});
	
	
	$('.component').each(function(index, elem) {
	
		top.Ext.create('Ext.tip.ToolTip', {
			target: elem,
			html: elem.id,
			trackMouse: true,
			showDelay: 0,
			hideDelay: 0,			
			listeners: {
				show: function(cmp, eOpts) {
					top.Ext.apply(cmp, {
						mouseOffset: [top.Ext.fly('iFrameWidgetView').getLeft(), top.Ext.fly('iFrameWidgetView').getTop()-f_scrollTop()]
					})
				}
			}
		});
	
	});
	
	//////////////////////////////////////////////////////////
	
});

//onFunctionAvailable('Ext', initEditor);

//console.log('Ext typeof', typeof(Ext));
document.onmousedown = function(e) {
	flag = 0;
}

document.onmouseup = function(e) {
	
	var elem, ph, comp, selected;
	
	elem = new top.Ext.Element(e.target);
	
	if(!elem.hasCls('placeholder'))
		ph = elem.up('.placeholder');
	
	if(elem.hasCls('component'))
		comp = elem;
	else
		comp = elem.up('.component');
	
	var cpLst = top.Ext.ComponentManager.get('compo-list');
	selected = false;
	$.each(cpLst.items.items, function(i, cmp) {
		var selNodes = cmp.down('compoDataView').getSelectedNodes();
		if(selNodes.length != 0)
			selected = selNodes;
	});
	
	if(!comp && !selected) {  //outside template no cmp under pointer and no cmp selected in left list
		//deselecting all component
		document.deselectAll();
		top.Ext.ComponentManager.get('compo-list').fireEvent('deselected');
	} else if(comp && !selected) { //mouse up on cmp, no cmp selected in left list: select cmp from frame
		
		//deselecting all component fisrt
		document.deselectAll();
		
		console.log('selected component:', comp);
		
		comp.toggleCls('selected');
		
		top.Ext.ComponentManager.get('compo-list').fireEvent('selected', comp);
		
	} else if(ph && selected) { //select cmp from left list and on placeholder
	
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

document.onmousemove = function(e) {
//		console.log("Event mousemove from frame: ", e.srcElement);
	//console.log(top.dFlag);
	var elem = new top.Ext.Element(e.target);
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
