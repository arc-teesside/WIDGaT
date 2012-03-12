/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.template.DataView' ,{
    extend: 'Ext.view.View',
    alias : 'widget.templateDataView',

    title : 'All Templates',
    
    initComponent: function() {		
		Ext.apply(this, {
			
			tpl: [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{name}">',
                    '<div class="thumb"><img src="{icon}" title="{name}"></div>',
                    '<span class="x-editable">{name}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ],
            multiSelect: false,
            singleSelect: false,
            trackOver: true,
            overItemCls: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No template to display'
		});
		
        this.callParent(arguments);
        
        
    }
});