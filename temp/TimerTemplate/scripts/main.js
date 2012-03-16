// Temporary component functions (normally in called libaries)

// None

// Generated for all widgets by the ARC WIDGaT service

// Component function instances

{//Declare new component instances (and assign initial field values if not null)

	var template = new timerTemplate("template");

	var sliderInput1 = new sliderInput("sliderInput1");
	sliderInput1.min=0;
	sliderInput1.max=100;
	sliderInput1.defaultValue=25;

	var sliderInput2 = new sliderInput("sliderInput2");
	sliderInput2.min=0;
	sliderInput2.max=100;
	sliderInput2.defaultValue=25;

	var analogClock1 = new analogClock("analogClock1");

	var analogClock2 = new analogClock("analogClock2");

}//@[<components>]
		
function init() { //initialise components on document load
  
	template.init();
	sliderInput1.init();
	sliderInput2.init();
	analogClock1.init();
	analogClock2.init();
}//@[<initialise>]

function action(f) { //handle actions in both editor and final version
    pipes();
    if (window.editable) return;
    eval(f);
}

function pipes() { // add pipes (component connectors)

	analogClock1.startTime=10;
}//@[<pipes>]



