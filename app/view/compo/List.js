/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.compo.List' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.compolist',

    title : 'All Components',
    
    initComponent: function() {
		
		Ext.apply(this, {
			id: 'compo-list',
			disabled: true,
			region: 'west',
		    margins:'5 0 5 5',
			split: true,
			collapsible: true,
			layout: { 
						type: 'accordion',
						multi: true
					},
			width: 180
		});
		
		this.addEvents({
			selected: true,
			deselected: true,
			dropped: true
		});
		
		this.callParent(arguments);
  }
  
  

});