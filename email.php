<?php

if(isset($_POST['email']) && !empty($_POST['email']) && isset($_POST['widgetID']) && !empty($_POST['widgetID'])) {

		$mailTo = $_POST['email'];
		$widgetID = $_POST['widgetID'];
		
		
	if(isValidEmail($mailTo) && strlen($widgetID) == 16 && substr($widgetID,0,2)=='w@') {

		$mailHeader = 'From: Widget Design Authoring Toolkit (WIDGaT) <no-reply@arc.tees.ac.uk>';
		$mailSubject = 'Your Widget';
		
		$mailMessage = 'Widget Design Authoring Toolkit (WIDGaT)'.PHP_EOL.PHP_EOL;
		$mailMessage .= 'Here is the link to your Widget:'.PHP_EOL;
		$mailMessage .= 'http://arc.tees.ac.uk/WIDGaT/Tool/?w='.$widgetID.PHP_EOL.PHP_EOL;

		$mailMessage .= 'Kind regards,'.PHP_EOL.'The Accessibility Research Centre Team';
		
		if (mail($mailTo, $mailSubject, $mailMessage, $mailHeader))
			echo 'Email successfully sent!';
		else
			echo 'Failed to deliver email, please try again.';
	}
	else {
		echo 'Email Invalid';
	}
} else {
	echo 'Email missing!';
}


function isValidEmail($email){
    return preg_match("/^[_a-z0-9-]+(\.[_a-z0-9+-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i", $email);
}

?>