<?php

if(!empty($_FILES['formFile']) && isset($_FILES['formFile']) && $_FILES['formFile']['error'] == 0 && isset($_POST['widgetID']) && !empty($_POST['widgetID'])) {
	if($_FILES['formFile']['tmp_name'] != "") {
		$file_temp = $_FILES['formFile']['tmp_name'];
		$file_name = $_FILES['formFile']['name'];
		$file_ext = strtolower(substr($file_name,strrpos( $file_name, '.')+1));
		$file_size_max = 2000000;
		
		$widgetID = $_POST['widgetID'];
		
		if(strlen($widgetID) == 16 && substr($widgetID,0,2)=='w@' && is_dir('../WIDEST/Widget/Output/'.$widgetID)) {
			
			if(!is_dir('../WIDEST/Widget/Output/'.$widgetID.'/media'))
				mkdir('../WIDEST/Widget/Output/'.$widgetID.'/media');
			
			$file_folder = '../WIDEST/Widget/Output/'.$widgetID.'/media/';
			
			if(isset($_POST['name']) && !empty($_POST['name']))
				$file_name = $_POST['name'].'.'.$file_ext;
			
			//$file_name = uniqid();
			$file_nameTemp = uniqid();
			
			//$file_name .= '.'.$file_ext;
			$file_nameTemp .= '.'.$file_ext;
			
			if($file_ext == 'png' || $file_ext == 'jpg' || $file_ext == 'jpeg' || $file_ext == 'gif') {
				
				list($file_width, $file_height, $file_type, $file_attr)=getimagesize($file_temp);
				
				if (!empty($file_temp) && is_uploaded_file($file_temp)) {
					if (filesize($file_temp)<$file_size_max) {
						if (($file_type===1) || ($file_type===2) || ($file_type===3)) {
							if (move_uploaded_file($file_temp, $file_folder.$file_nameTemp)) {
								chmod ($file_folder.$file_nameTemp, 0777);
								$ratio = (float)($file_width / $file_height);
								$max_dimension = 700;
								if($file_width>$file_height) 
								{
									$thumb_width = $max_dimension;
									$thumb_height = ceil($max_dimension*(1/$ratio));
								}
								else 
								{
									$thumb_width = ceil($max_dimension*($ratio));
									$thumb_height = $max_dimension;
								}
								if ($file_type === 1){
									$file_source = imagecreatefromgif($file_folder.$file_nameTemp);
									$file_thumb = imagecreate($thumb_width, $thumb_height);
									$white_background = imagecolorallocate($file_thumb, 255, 255, 255);
									imagecopyresampled($file_thumb, $file_source, 0, 0, 0, 0, $thumb_width, $thumb_height, $file_width, $file_height);
									imagecolortransparent($file_thumb, $white_background);
									imagegif($file_thumb, $file_folder.$file_name);
									chmod($file_folder.$file_name, 0777);
								}
								if ($file_type===2){
									$quality=80;
									$file_source = imagecreatefromjpeg($file_folder.$file_nameTemp);
									$file_thumb = imagecreatetruecolor($thumb_width, $thumb_height);
									imagecopyresampled($file_thumb, $file_source, 0, 0, 0, 0, $thumb_width, $thumb_height, $file_width, $file_height);
									imagejpeg($file_thumb, $file_folder.$file_name, $quality);
									chmod($file_folder.$file_name, 0777);
								}
								if ($file_type===3){
									$file_source = imagecreatefrompng($file_folder.$file_nameTemp);
									
									
									$file_thumb = imagecreatetruecolor($thumb_width, $thumb_height);
									
									imagealphablending( $file_thumb, false );
									imagesavealpha( $file_thumb, true );
									
									imagecopyresampled($file_thumb, $file_source, 0, 0, 0, 0, $thumb_width, $thumb_height, $file_width, $file_height);
									imagepng($file_thumb, $file_folder.$file_name);
									chmod($file_folder.$file_name, 0777);
								}
								unlink($file_folder.$file_nameTemp);
								
								echo '{"success":true}';
							}
							else {
								echo '{"success":false, "error":'.json_encode("An error occured during the upload.").'}';
							}
						}
						else {
							echo '{"success":false, "error":'.json_encode("Wrong file format (Accepted format: JPG, JPEG, GIF, PNG)").'}';
						}
					}
					else {
						echo '{"success":false, "error":'.json_encode("Your file is to big").'}';
					}
				}
				else {
					echo '{"success":false, "error":'.json_encode("No file to upload").'}';
				}
			
			} elseif ($file_ext == 'wav' || $file_ext == 'mp3') {
				if (!empty($file_temp) && is_uploaded_file($file_temp)) {
					if (filesize($file_temp)<$file_size_max) {
						if (move_uploaded_file($file_temp, $file_folder.$file_name)) {
							//unlink($file_folder.$file_nameTemp);
							echo '{"success":true}';
						}
						else {
							echo '{"success":false, "error":'.json_encode("An error occured during the upload.").'}';
						}
					}
					else {
						echo '{"success":false, "error":'.json_encode("Your file is to big").'}';
					}
				}
				else {
					echo '{"success":false, "error":'.json_encode("No file to upload").'}';
				}
			} else {
				echo '{"success":false, "error":'.json_encode("Wrong file format (Accepted format: JPG, JPEG, GIF, PNG, WAV, MP3)").'}';
			}
		} else {
			echo '{"success":false, "error":'.json_encode("Unable to find the widget").'}';
		}
	} else {
		echo '{"success":false, "error":'.json_encode("No file to upload").'}';
	}
} else {
	echo '{"success":false, "error":'.json_encode("An error occured while sending the form.").'}';
}


?>