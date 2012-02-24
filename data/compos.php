<?php
	$compos = array(array(
		'id'=> 1,
		'className'=> "analogClock",
		'name' => "Analog Clock",
		'description'=> "Analog looking clock timer using CSS3 for animation",
		'category'=> 'clock',
		'icon'=> 'http=>//localhost/Component/analog/icon.png',
		'placeHolder' => 'placeholder12',
		'authors'=> array(array(
			'name'=> "Franck Perrin",
			'email'=> "f.perrin@tees.ac.uk",
			'link'=> "http=>//arc.tees.ac.uk",
			'organisation'=> "ARC Teesside University"
		)),
		'html'=> "analog.html",
		'javascript'=> "analog.js",
		'stylesheet'=> "analog.css",
		
		'attributes'=> array(array(
			'shortName'=> "startTime",
			'name'=> "Starting Time",
			'type'=> "Number",
			'input'=> true,
			'required'=> true
		)),
		
		'actions' => array(array(
			'shortName'=> "launchCountdown",
			'name'=> "launch Countdown"
		), array(
			'shortName'=> "resetClock",
			'name'=> "Reset clock"
		)),
		
		'guidances'=> array(array(
				'priority'=> "high",
				'text'=> "The clock needs a starting time"
		))
	), array(
		'id'=> 2,
		'className'=> "analogClock",
		'name' => "Slider",
		'description'=> "Analog looking clock timer using CSS3 for animation",
		'category'=> 'clock',
		'icon'=> 'http=>//localhost/Component/analog/icon.png',
		'placeHolder' => 'placeholder12',
		'authors'=> array(array(
			'name'=> "Franck Perrin",
			'email'=> "f.perrin@tees.ac.uk",
			'link'=> "http=>//arc.tees.ac.uk",
			'organisation'=> "ARC Teesside University"
		)),
		'html'=> "analog.html",
		'javascript'=> "analog.js",
		'stylesheet'=> "analog.css",
		
		'attributes'=> array(array(
			'shortName'=> "startTime",
			'name'=> "Starting Time",
			'type'=> "Number",
			'input'=> true,
			'required'=> true
		)),
		
		'actions' => array(array(
			'shortName'=> "launchCountdown",
			'name'=> "launch Countdown"
		), array(
			'shortName'=> "resetClock",
			'name'=> "Reset clock"
		)),
		
		'guidances'=> array(array(
				'priority'=> "high",
				'text'=> "The clock needs a starting time"
		))
	));
	
	
	if (isset($_REQUEST['id'])) {
		$id = $_REQUEST['id'];
		foreach ($compos as &$compo) {
			if ($compo['id'] == $id) {
				echo json_encode($compo);
				break;
			}
		}
	} else {
		echo json_encode($compos);
	}	
?>