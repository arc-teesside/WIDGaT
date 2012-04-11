/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.compo.DataView' ,{
    extend: 'Ext.view.View',
    alias : 'widget.compoDataView',

    title : 'All Components',
	
    initComponent: function() {
		
		Ext.apply(this, {
			
			tpl: [
                '<tpl for=".">',
                    '<div class="thumb-wrap" id="{className}">', //className servs as id
                    '<div class="thumb"><img src="{icon}" ></div>',
                    '<span class="x-editable">{name}</span></div>',
                '</tpl>',
                '<div class="x-clear"></div>'
            ],
            multiSelect: false,
            singleSelect: false,
            trackOver: true,
            overItemCls: 'x-item-over',
            itemSelector: 'div.thumb-wrap',
            emptyText: 'No component to display',
			style: {
				overflow: "auto"
			},
			plugins: [
                Ext.create('Ext.ux.DataView.Draggable')
            ]
		});
		
        this.callParent(arguments);
        
        
    }
});