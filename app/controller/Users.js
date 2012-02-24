/*

This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Users', {
    extend: 'Ext.app.Controller',
	
	views: [
        'user.List',
        'user.Edit'
    ],
	stores: [
        'Users'
    ],
    models: ['User'],

    init: function() {
        this.control({
            'userlist': {
                itemdblclick: this.editUser
            },
			'useredit button[action=save]': {
                click: this.updateUser
            }
        });
    },

    editUser: function(gris, record) {
        var view = Ext.widget('useredit');
        view.down('form').loadRecord(record);
    },
	
	updateUser: function(button) {
        var win    = button.up('window'),
			form   = win.down('form'),
			record = form.getRecord(),
			values = form.getValues();

		record.set(values);
		record.save({ // save the record to the server
						success: function(user) {
							Ext.Msg.alert('Success', 'User saved successfully.')
						},
						failure: function(user) {
							Ext.Msg.alert('Failure', 'Failed to save user.')
						}
					});
		win.close();
		this.getUsersStore().sync();
    }
});