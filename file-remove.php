<?php
if(isset($_POST['widgetID']) && !empty($_POST['widgetID']) && isset($_POST['fileName']) && !empty($_POST['fileName'])) {

	$widgetID = $_POST['widgetID'];
	$fileName = $_POST['fileName'];
		
	if(strlen($widgetID) == 16 && substr($widgetID,0,2)=='w@' && is_dir('../WIDEST/Widget/Output/'.$widgetID)) {
	
		if(is_dir('../WIDEST/Widget/Output/'.$widgetID.'/media')) {

			if (is_file('../WIDEST/Widget/Output/'.$widgetID.'/media/'.$fileName)) {
				
				unlink('../WIDEST/Widget/Output/'.$widgetID.'/media/'.$fileName);
				echo '{"success":true}';

			} else {
				echo '{"success":false, "error":'.json_encode("No such file").'}';
			}

		} else {
			echo '{"success":false, "error":'.json_encode("Unable to find the Media directory").'}';
		}
	} else {
		echo '{"success":false, "error":'.json_encode("Unable to find the widget").'}';
	}

} else {
	echo '{"success":false, "error":'.json_encode("Empty post").'}';
}

?>