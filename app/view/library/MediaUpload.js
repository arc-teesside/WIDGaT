/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.view.library.MediaUpload' ,{
    extend: 'Ext.window.Window',
    alias : 'widget.mediaupload',

    title : 'File Upload Form',
    
    initComponent: function() {
		var me = this;
		Ext.apply(this, {
			bbar: [
				'->',
				{
					id: 'btnUpload',
					text: 'Upload',
					handler: function(btn) {
						var form = me.down('form').getForm();
						if(form.isValid()){
							form.submit({
								url: 'file-upload.php',
								waitMsg: 'Uploading your file...',
								success: function(fp, o) {
									Ext.getCmp('library-panel').loadMedia();
									//window.myAppGlobal.getController('WIDGaT.controller.Widgets').updateGlobalStores();
									me.fireEvent('fileuploaded');
									Ext.Msg.alert('Success', 'Your file has been uploaded');
								},
								failure: function(f, o) {
									Ext.Msg.alert('Error', 'The following error occured: ' + o.result.error);
								}
							});
						}
					}
				}, {
					id: 'btnUploadCancel',
					text: 'Cancel',
					handler: function(btn) {
						me.close();
					}
				},
			],
			items: [{
				xtype: 'form',
				width: 400,
				bodyPadding: '10 10',
				border:false,
				defaults: {
					anchor: '100%',
					allowBlank: false,
					msgTarget: 'side',
					labelWidth: 50
				},

				items: [{
					xtype: 'textfield',
					fieldLabel: 'Name',
					name: 'name',
					allowBlank: true
				},{
					xtype: 'filefield',
					id: 'formFile',
					emptyText: 'Select a file',
					fieldLabel: 'File',
					name: 'formFile',
					buttonText: 'Browse...',
					buttonConfig: {
						iconCls: 'upload-icon'
					}
				}, {
					xtype: 'hiddenfield',
					name: 'widgetID',
					value: WIDGaT.activeWidget.get('id')
				}]
			}]
		});
        this.callParent(arguments);
    }
	
	
});