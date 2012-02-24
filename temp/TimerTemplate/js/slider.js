// JavaScript Document


var sliderInput = function(ID) {
	this.id = ID;
	this.min = 1;
	this.max = 60;
	this.defaultValue = 5;
	this.selectedValue = 5;
	var _this = this;
	
	this.init = function() {
		var ID = "#" +this.id;
		$(ID+'-slider').slider({
			animate: true,
			 min:this.min,
			 max:this.max,
			 step: 1,
			 value: this.defaultValue,
			 change: function(event, ui) {
				$(ID+'-displayNb').html(ui.value+"mins");
				_this.selectedValue = ui.value;
			 }
		});	
	}
}