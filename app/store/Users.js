/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.store.Users', {
    extend: 'Ext.data.Store',
    model: 'WIDGaT.model.User',
	autoLoad: true,
	
	proxy: {
		type: 'ajax',
		api: {
			read: 'data/users.json',
			write: 'data/users.json',
			update: 'data/updateUsers.json'
		},
		reader: {
			type: 'json',
			root: 'users',
			successProperty: 'success'
		},
		writer: {
			type: 'json',
			root: 'users',
			successProperty: 'success'
		}
	}
    
});