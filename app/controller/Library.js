/*
This file is part of WIDGaT Toolkit

This work is licensed under a Creative Commons Attribution Non-Commercial ShareAlike 3.0 License

Contact:  http://arc.tees.ac.uk/
*/
Ext.define('WIDGaT.controller.Library', {
	extend: 'Ext.app.Controller',

	models: ['Widget'],

	views: [
		'library.LibraryGrid',
		'library.MediaUpload'
	],

	refs: [
		{ref: 'libraryGrid', selector: 'librarygrid'},
		{ref: 'mediaUpload', selector: 'mediaupload'}
	],

	init: function() {
		var me = this;
		me.control({
			'#toolUpload': {
				click: me.onToolUploadClick
			}
		});
			
	},

	onToolUploadClick: function() {
		if(this.getMediaUpload())
			this.getMediaUpload().focus();
		else {
			var mediaUploadWin = Ext.create('WIDGaT.view.library.MediaUpload');
			mediaUploadWin.show();
		}
	}
})