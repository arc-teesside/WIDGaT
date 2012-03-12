/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Pipes', {
    extend: 'Ext.data.Store',
    model: 'WIDGaT.model.Pipe',
	
	getByFrom: function(from) {
        return (this.snapshot || this.data).findBy(function(record) {
			return record.get('from') === from;
        });
    },
	
	getByTo: function(to) {
        return (this.snapshot || this.data).findBy(function(record) {
			return record.get('to') === to;
        });
    }
});