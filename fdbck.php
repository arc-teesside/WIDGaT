<?php

require_once('recaptchalib.php');

if(isset($_POST['name']) && !empty($_POST['name']) &&
	isset($_POST['email']) && !empty($_POST['email']) &&
	isset($_POST['widgetID']) && !empty($_POST['widgetID']) &&
	isset($_POST['comment']) && !empty($_POST['comment'])) {
	
	//isset($_POST["recaptcha_response_field"]) && !empty($_POST['recaptcha_response_field'])) {

	/*$privatekey = "6LeQc9cSAAAAAKCQwraAaglVZRHadv_Q9lviiXoV";

	# the response from reCAPTCHA
	$resp = null;
	# the error code from reCAPTCHA, if any
	$error = null;

	# was there a reCAPTCHA response?
	if ($_POST["recaptcha_response_field"]) {
			$resp = recaptcha_check_answer ($privatekey,
											$_SERVER["REMOTE_ADDR"],
											$_POST["recaptcha_challenge_field"],
											$_POST["recaptcha_response_field"]);

			if ($resp->is_valid) {*/
							
				$fh = fopen("fdbck.txt", 'a+') or die("can't open file");
				
				fread($fh, filesize("fdbck.txt"));
				
				$stringData = date(DATE_RFC822)." -- ".$_POST['widgetID']." -- ".$_POST['name']." -- ".$_POST['email']." -- ".$_POST['comment'].PHP_EOL;
				
				fwrite($fh, $stringData);
				
				fclose($fh);
				
			/*} else {
					# set the error code so that we can display it
					//header("HTTP/1.0 400");
					header('Bad captcha', true, 400);
					echo '101';
					die();
			}
	}*/
} else {
	header("HTTP/1.0 400");
}
/*
https://developers.google.com/recaptcha/docs/php

require_once('recaptchalib.php');
  $privatekey = "your_private_key";
  $resp = recaptcha_check_answer ($privatekey,
                                $_SERVER["REMOTE_ADDR"],
                                $_POST["recaptcha_challenge_field"],
                                $_POST["recaptcha_response_field"]);

  if (!$resp->is_valid) {
    // What happens when the CAPTCHA was entered incorrectly
    die ("The reCAPTCHA wasn't entered correctly. Go back and try it again." .
         "(reCAPTCHA said: " . $resp->error . ")");
  } else {
    // Your code here to handle a successful verification
  }

*/
?>