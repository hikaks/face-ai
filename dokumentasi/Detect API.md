Version
3.0

Overview
Detect and analyze human faces within the image that you provided.

Detect API can detect all the faces within the image. Each detected face gets its face_token, which can be used in follow-up analysis and operations. With a Standard API Key, you can specify a rectangle area within the image to perform face detection.

Detect API can analyze detected faces directly, providing face landmarks and attributes information. With a Free API Key, only the 5 largest faces by its bounding box size can be analyzed, while you can use Face Analyze API to analyze the rest faces. With a Standard API Key, you can analyze all the detected faces.

About face_token
If you want to use the detected face for follow-up operations, we recommend you to add its corresponding face_token into FaceSet. A face_token expires within 72 hours if it is not added into any FaceSet. 

Every time you operate face detection upon one image, the face within the image will get a different face_token.

Image Requirements
Format : JPG (JPEG), PNG
Size : between 48*48 and 4096*4096 (pixels)
File size : no larger than 2MB
Minimal size of face : the bounding box of a detected face is a square. The minimal side length of a square should be no less than 1/48 of the short side of image, and no less than 48 pixels. For example if the size of image is 4096 * 3200px, the minimal size of face should be 66 * 66px.

Changelog
October 18, 2017. Added 106-point landmarks.

September 19, 2017. Added attribute "skinstatus".

August 16, 2017. Added attributes "mouthstatus", "beauty", "eyegaze".

June 7, 2017. Algorithm major upgrade. Added attribute "emotion".

March 9, 2017. Added support for Base64 encoded image.



Request URL
https://api-us.faceplusplus.com/facepp/v3/detect

Request Method
POST

Permission
All API Keys can use this API. Please note that paramaters "calculate_all" and "face_rectangle" can be used only with a Standard API Key.

Request Parameter


Name

Type

Description

Required

api_key

String

Your registered API Key to call this API

Required

api_secret

String

Your registered API Secret to call this API

Required ( choose any of three)

image_url

String

URL of the image.

Note: getting images from URLs may take a long time due to internet connection problems, so it is recommended that you upload images directly by using image_file.

image_file

File

The binary data of the image, uploaded via POST multipart/form-data.

image_base64	String	
Base64 encoded binary data of the image.

These three parameters (image_url, image_file and image_base64) will be adopted in the following order of precedence:

Highest: image_file; Lowest: image_url.

Optional

return_landmark

Int

Whether or not detect and return key points of facial features and contour. Valid values are:

2	detect and return 106-point landmarks
1	detect and return 83-point landmarks
0	
do not detect

Note: default value is 0.

Optional

return_attributes

String

Whether or not detect and return face attributes. Valid values are:

none	
do not detect attributes

gender
age
smiling
headpose
facequality
blur
eyestatus
emotion
beauty
mouthstatus
eyegaze
skinstatus
Attributes you need.

All the attributes you need should be put in a comma-seperated string, without any requirement on sequence.

For details about each attributes, kindly check the following part "attributes" under "Return Values".

Note: Because new attribute "eyestatus" is provided, attributes "glass" will be removed on 31st, October, 2017. Please modify your program to adapt to eyestatus.



Note: The default value is "none".

Optional (Available only with a Standard API Key)	calculate_all	Int	
Whether or not analyze and return attributes and landmarks of all the detected faces. If not used, only the 5 largest faces by its bounding box size will be analyzed. Valid values are:

1	
Yes

0	
No

Note: The default value is 0.

Optional (Available only with a Standard API Key)	face_rectangle	String	
Whether or not specify a rectangle to perform face detection.

If not used, this API will detect within the entire image.

If valid values are passed in this parameter with a Standard API Key, this feature will be used. You will need to pass a string to indicate the face rectangle, according to which this API will perform face detection and analysis within the specified area. The face rectangle will be the same as you passed. For areas out of the rectangle you passed, this API will not perform face detection, nor will return other face information.

Parameter requirements: four integers, indicating the Y-coordinate of upper left corner (top), X-coordinate of upper left corner (left), width of the rectangle frame (width), height of the rectangle frame (height). Such as "70,80,100,100".

Return Values
Fields

Type

Description

request_id	String	Unique id of each request
faces

Array

Array of detected faces

Note: if no face is detected, the array is []

image_id	String	
Unique id of an image

time_used

Int

Time that the whole request takes. Unit: millisecond

error_message

String

This string will not be returned unless request fails. For more details, please see the following section on error message.

Elements contained in faces array
Fields

Type

Description

face_token

String

Unique id of the detected face

face_rectangle

Object

A rectangle area for the face location on image. The following coordinates are all integer numbers:

top：Y-coordinate of upper left corner
left：X-coordinate of upper left corner
width：The width of the rectangle frame
height：The height of the rectangle frame
landmark

Object

An array of face landmarks.

If you pass 1 to parameter "landmark", this field will return 83-point landmarks.

If you pass 2 to parameter "landmark", this field will return 106-point landmarks.

For more details of the values and illustration of 83-point or 106-point landmarks, please refer to: Landmarks Illustration (83 Points), Landmarks Illustration (106 Points).

attributes

Object

Face attributes, detailed information can be found in the following table.

Elements contained in face attributes
Fields
Type
Description
gender	String	
Result of gender analysis. Values are:

Male
Female
age	Int	
Result of age analysis. Value is an age whole number in years.

smile	Object	
Smile intensity, include the following objects:

value: a floating-point number with 3 decimal places between [0,100].
threshold: a smiling face can be confirmed if this number goes beyond the threshold value.
glass	String	
Glass wearing condition. Values are:

None	do not wear glasses
Dark	wear dark glasses
Normal	wear ordinary glasses
Note: Because new parameter, eyestatus is provided, parameter of glass will expire on 30th, July, 2017. Please modify your program to adapt to eyestatus.

headpose	Object	
3D head pose analysis results, including the following objects. The value of each object is a floating-point number with 6 decimal places between [-180,180].

pitch_angle

roll_angle

yaw_angle

blur	Object	
Face blur condition, including the following objects:

blurness
Each object includes the following fields:

value: a floating-point number with 3 decimal places between [0,100].
threshold: indicates whether the blur has affected face recognition

eyestatus	Object	
Status of eyes, including two objects:

left_eye_status
right_eye_status
Each object contains the following values. The value is a floating-point number with 3 decimal places between [0,100]. The sum of all values is 100.

occlusion: the confidence that the eye is blocked
no_glass_eye_open: the confidence that not wear glass and the eye is open
normal_glass_eye_close: the confidence that wear ordinary glass and the eye is closed
normal_glass_eye_open: the confidence that wear ordinary glass and the eye is open
dark_glasses: the confidence that wear dark glass
no_glass_eye_close: the confidence that not wear glass and the eye is closed
emotion	Object	
Emotion expressed, including the following fields. The value of each field is a floating-point number with 3 decimal places between [0,100]. Bigger value of a field indicates greater confidence of the emotion which the field represents. The sum of all values is 100.

anger
disgust
fear
happiness
neutral
sadness
surprise
facequality	Object	
How suitable the image quality of face is for face comparing, including the following fields:

value: a floating-point number with 3 decimal places between [0,100]
threshold: a face can be to compare if this number goes beyond the threshold value.
beauty	Object	
Result of beauty analysis, including the following fields. The value of each field is a floating-point number with 3 decimal places between [0,100]. Higher beauty score indicates the detected face is more beautiful.

male_score：beauty score of the detected face given by male
female_score：beauty score of the detected face given by female
mouthstatus	Object	
Status of mouth, including the following fields. The value of each field is a floating-point number with 3 decimal places between [0,100]. The sum of all values is 100.

surgical_mask_or_respirator: the confidence that the mouth is blocked by surgical mask or respirator
other_occlusion: the confidence that the mouth is blocked by other object
close: the confidence that the mouth is closed, not blocked
open: the confidence that the mouth is open, not blocked
eyegaze	Object	
Eye center locations and eye gaze directions, including the following objects.

left_eye_gaze：eye center location and eye gaze direction of left eye
right_eye_gaze：eye center location and eye gaze direction of right eye
Each object contains the following fields. The value of each field is a floating-point number with 3 decimal places between [0,100].

position_x_coordinate: the x coordinate of eye center
position_y_coordinate: the y coordinate of eye center
vector_x_component: the x component of eye gaze direction vector
vector_y_component: the y component of eye gaze direction vector
vector_z_component: the z component of eye gaze direction vector
skinstatus



Object	
Status of skin, including the following fields. The value of each field is a floating-point number with 3 decimal places between [0,100]. Bigger value of a field indicates greater confidence of the status which the field represents.

health
stain
acne
dark_circle
Sample Response
Sample response when request has succeeded:


{
	"image_id": "Dd2xUw9S/7yjr0oDHHSL/Q==",
	"request_id": "1470472868,dacf2ff1-ea45-4842-9c07-6e8418cea78b",
	"time_used": 752,
	"faces": [{
		"landmark": {
			"mouth_upper_lip_left_contour2": {
				"y": 185,
				"x": 146
			},
			"contour_chin": {
				"y": 231,
				"x": 137
			},
  //   .............landmarks omitted...........
			"right_eye_pupil": {
				"y": 146,
				"x": 205
			},
			"mouth_upper_lip_bottom": {
				"y": 195,
				"x": 159
			}
		},
		"attributes": {
			"gender": {
				"value": "Female"
			},
			"age": {
				"value": 21
			},
			"glass": {
				"value": "None"
			},
			"headpose": {
				"yaw_angle": -26.625063,
				"pitch_angle": 12.921974,
				"roll_angle": 22.814377
			},
			"smile": {
				"threshold": 30.1,
				"value": 2.566890001296997
			}
		},
		"face_rectangle": {
			"width": 140,
			"top": 89,
			"left": 104,
			"height": 141
		},
		"face_token": "ed319e807e039ae669a4d1af0922a0c8"
	}]
}

Sample response when request has failed:
{
	"time_used": 3,
	"error_message": "MISSING_ARGUMENTS: image_url, image_file, image_base64",
	"request_id": "1470378968,c6f50ec6-49bd-4838-9923-11db04c40f8d"
}
Unique ERROR_MESSAGE of this API
HTTP Status Code

Error Message

Description

400

IMAGE_ERROR_UNSUPPORTED_FORMAT:<param>

The image which <param> indicates can not be resolved. The file format may not be supported or the file is damaged.

400

INVALID_IMAGE_SIZE:<param>

The size of uploaded image does not meet the requirement as above. <param> is the argument which indicates its size of image is too big or too small.

400

INVALID_IMAGE_URL

Failed downloading image from URL. The image URL is wrong or invalid.

400	IMAGE_FILE_TOO_LARGE:<param>	The image file passed by <param> is too large. This API requires image file size to be no larger than 2 MB.
403	INSUFFICIENT_PERMISSION:<param>	
With a Free API Key, you cannot use <param>. Please do not use this parameter, or use with a Standard API Key.

412

IMAGE_DOWNLOAD_TIMEOUT

Image download timeout

Common ERROR_MESSAGE
HTTP Status Code

Error Message

Description

401	AUTHENTICATION_ERROR	
api_key and api_secret does not match.

403

AUTHORIZATION_ERROR:<reason>

api_key does not have permission to call this API.

Values of <reason> are:

"Denied by Client"

"Denied by Admin"

"Insufficient Account Balance"

403

CONCURRENCY_LIMIT_EXCEEDED

The rate limit for this API Key has been exceeded.

Note: "rate limit" means the QPS capacity of each API Key. To raise QPS capacity of your API Key, please refer to Face++ Pricing and Plans page or contact us.

400

MISSING_ARGUMENTS: <key>

Some required arguments missed.

400

BAD_ARGUMENTS:<key>

Error while parsing some arguments. This error may be caused by illegal type or length of argument.

400	COEXISTENCE_ARGUMENTS	
Passed several arguments which are not allowed to coexist. This error message will be returned unless otherwise stated.

400	TOO_MANY_FACE_ATTRIBUTES	More than one face in the picture.
413	Request Entity Too Large	
The request entity has exceeded the limit (2MB). This error message will be returned in plain text, instead of JSON.

404

API_NOT_FOUND

Requested API can not be found.

500

INTERNAL_ERROR

Internal error. Please retry the request.

If this error keeps occurring, please contact our support team.

Sample request


curl -X POST "https://api-us.faceplusplus.com/facepp/v3/detect" -F "api_key=<api_key>" \
-F "api_secret=<api_secret>" \
-F "image_file=@image_file.jpg" \
-F "return_landmark=1" \
-F "return_attributes=gender,age"