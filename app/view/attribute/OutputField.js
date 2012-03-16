/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
 Ext.define('WIDGaT.view.attribute.OutputField', {
  extend:'Ext.form.Picker',
  alias:'widget.outputfield',
  xtype:'combotree',
  requires:["Ext.tree.Panel"],
  matchFieldWidth:false,
  value:'',
  autoSelect: true,
  //triggerCls: Ext.baseCSSPrefix + 'form-plus-trigger',
  //renderTo: Ext.getBody(),
  createPicker: function(){

    var me = this,
    picker;
      
	WIDGaT.outputStore.group('widgat.model.compo_id');
	//if(WIDGaT.debug) console.log(WIDGaT.outputStore.getGroups());
	
	var obRoot = new Object();
	obRoot.expanded = true;
	obRoot.children = new Array();
	
	
	Ext.each(WIDGaT.outputStore.getGroups(), function(group) {
			var obGrp = new Object();
			obGrp.name = group.name;
			obGrp.leaf = false;
			obGrp.expanded = true;
			obGrp.children = new Array();
			Ext.each(group.children, function(child) {
				var obChild = new Object();
				obChild.leaf = true;
				obChild.name = child.get('name');
				obChild.shortName = child.get('shortName');
				obGrp.children.push(obChild);
			});
			obRoot.children.push(obGrp);
	});
	
	var store = Ext.create('Ext.data.TreeStore', {
		model: 'WIDGaT.model.Attribute',
		root: obRoot
	});
	
	if(WIDGaT.debug) console.log('getRootNode', store.getRootNode());
    var treeConfig = Ext.apply({
      pickerField: me,
	  id: 'outputTree',
      store:  store,         
      width:me.bodyEl.getWidth(),
      height:150,
	  rootVisible: false,
	  multiSelect: false,
	  floating: true,
	  hidden: true,
	  displayField: 'name',
	  valueField: 'shortName',
      listeners:{
        scope:me,
        itemclick:me.onItemClick,
		beforeselect:me.onBeforeSelect,
		beforeitemclick:me.onBeforeItemClick
      }
           

    }, me.treeConfig);

    picker = me.picker = Ext.create('Ext.tree.Panel',treeConfig);
	if(WIDGaT.debug) console.log(picker);
    return picker;
  },

  onBeforeRender: function(cmp) {
	if(WIDGaT.debug) console.log("picker.onBeforeRender");
	  this.setRawValue(this.value);
  },

  onBeforeSelect: function(view, record) {
	  return (record.get('depth') != 1);
  },

  onBeforeItemClick: function(view, record) {
	  return (record.get('depth') != 1);
  },
  
  onItemClick:function(view, record, item, index, e, eOpts){
	if(WIDGaT.debug) console.log('record', record);
    this.setFieldValue(record.parentNode.raw.name + '.' +record.raw.shortName, record.parentNode.raw.name + '.' +record.raw.shortName);
    this.fireEvent('select', this, record.parentNode.raw.name + '.' +record.raw.shortName);
    this.collapse();
  },

  setFieldValue: function(value, label) {
    var me = this;
    me.setValue(value);
    me.setRawValue(label);
  },

  setValue:function(value){
	if(WIDGaT.debug) console.log("setValue value", value);
    var me = this,
    inputEl = me.inputEl;

    if (inputEl && me.emptyText && !Ext.isEmpty(value)) {
      inputEl.removeCls(me.emptyCls);
    }
	
    me.value = value;
	
    //me.applyEmptyText();
  },
  setRawValue:function(value){
	if(WIDGaT.debug) console.log("setRawValue value", value);
    this.inputEl.dom.value = value==null?"":value;
  },
  getValue:function(){
	if(WIDGaT.debug) console.log("getValue value", this.value);
    return this.value;
  },
  getRawValue:function(){
	if(WIDGaT.debug) console.log("getRawValue value", this.inputEl.dom.value);
	if(this.inputEl.dom.value != this.value) {
		if(this.inputEl.dom.value != '')
			this.value = this.inputEl.dom.value;
		if(this.picker)
			this.picker.getSelectionModel().deselectAll();
	}
    return this.inputEl.dom.value;
  },
  setValueWithReload:function(parentId, nodeId, nodeText){
   
    this.setFieldValue(nodeId, nodeText);

  },
  onExpand: function() {
	var me = this,
		picker = me.picker,
		lastSelected, itemNode;
		
	//me.setRawValue(me.value);
	if (picker && me.autoSelect && me.picker.store.getCount() > 0) {
		// Highlight the last selected item and scroll it into view
		lastSelected = picker.getSelectionModel().lastSelected;
		itemNode = picker.getView().getNode(lastSelected || 0);
		if (itemNode) {
			picker.getView().highlightItem(itemNode);
		}
	}
  },
  onCollapse: function() {
        //this.picker.destroy();
		this.callParent(arguments);
    },
})
