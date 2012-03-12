/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/

Ext.define('WIDGaT.view.action.TreePanel', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.actiontreepanel',
	
	initComponent: function(){
		var me = this;
		Ext.apply(me, {
			id: 'actionTreePanel',
			rootVisible: false,
			multiSelect: false
		});
		this.callParent(arguments);
	}
});