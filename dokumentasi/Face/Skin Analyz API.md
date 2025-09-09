Version
1.0

Overview
Skin Analyze API can analyze face skin within the image that you provided.

Image Requirements
Format : JPG (JPEG)

Size : between 200*200 and 4096*4096 (pixels)

File size : no larger than 2MB

Minimal size of face : To ensure the accuracy of results,it is recommended that the minimum length of the face frame (square) in the picture is no less than 200 pixels. Check size: minimum is 160 pixels. The minimal side length of a square should be no less than 1/10 of the short side of image. 

Face quality: The higher the quality of the face, the more accurate the skin analysis. Factors affecting face quality include: occlusion of facial features, blurred pictures, improper illumination (glare, dark light, backlight), excessive face angle (recommended roll ≤ ±45°, yaw ≤ ±45° , pitch ≤ ±45°), etc.

Request URL
https://api-us.faceplusplus.com/facepp/v1/skinanalyze

Request Method
POST

Request Body Format
multipart/form-data

Permission
All API Keys can use this API.

Request Parameter

Name	Type	Description
Required

api_key

String

Your registered API Key to call this API

Required

api_secret

String

Your registered API Secret to call this API

Required	
image_url

String

URL of the image

image_file	
File

The binary data of the image, uploaded via POST multipart/form-data.

image_base64	String	
Base64 encoded binary data of the image.

These three parameters (image_url, image_file and image_base64) will be adopted in the following order of precedence:

Highest: image_file; Lowest: image_url.

Return Values
Fields

Type

Description

request_id	String	Unique id of each request
result

Array	Array of face skin analysis, the specific return value information is shown in the table below.
warning	Array	
Indicates the interference factor that affects the calculation results.
Interference factors may be:

imporper_headpose：The head angle is not correct (judge the condition roll, yaw, pitch over [-45, 45])
Returns when there is an influencing factor (returns the corresponding field if there is an effect): ["improper_headpose"]
Return without influencing factors: []

face_rectangle	Object	
A rectangle area for the face location on image. The following coordinates are all integer numbers:

top：Y-coordinate of upper left corner
left：X-coordinate of upper left corner
wilewdth：The width of the rectangle frame
height：The height of the rectangle frame
time_used

Int

Time that the whole request takes. Unit: millisecond

error_message

String

This string will not be returned unless request fails. For more details, please see the following section on error message.

Elements contained in result array
Fields	Type	Description
left_eyelids	Object	
Result of left_eyelids analysis:

"left_eyelids":{"value": "0","confidence": 0.89}

0	
single-fold eyelid

1	parallel double-fold eyelid
2	fanshaped double-fold eyelid
right_eyelids	Object	
Result of right_eyelids analysis:

"right_eyelids":{"value": "0","confidence": 0.89}

0	
single-fold eyelid

1	parallel double-fold eyelid
2	fanshaped double-fold eyelid
eye_pouch	Object	
Result of eye_pouch analysis:

"eye_pouch":{"value": "0","confidence": 0.89}

0	no eye pouch
1	have eye pouch
dark_circle	Object	
Result of dark_circle analysis:

"dark_circle":{"value": "0","confidence": 0.89}

0	no dark circles
1	have dark circles
forehead_wrinkle	Object	
Result of forehead_wrinkle analysis:

"forehead_wrinkle":{"value": "0","confidence": 0.89}

0	no forehead wrinkle
1	have forehead wrinkle
crows_feet	Object	
Result of crows_feet analysis:

"crows_feet":{"value": "0","confidence": 0.89}

0	no crows feet
1	have crows feet
eye_finelines	Object	
Result of eye_finelines analysis:

"eye_finelines":{"value": "0","confidence": 0.89}

0	no eye finelines
1	have eye finelines
glabella_wrinkle	Object	
Result of glabella_wrinkle analysis:

"glabella_wrinkle":{"value": "0","confidence": 0.89}

0	no glabella wrinkle
1	have glabella wrinkle
nasolabial_fold	Object	
Result of nasolabial_fold analysis:

"nasolabial_fold":{"value": "0","confidence": 0.89}

0	no nasolabial fold
1	have nasolabial fold
skin_type	Object	
Result of skin_type analysis:

{ "skin_type": 0,

"details": {

0: {"value": 1, "confidence": 0.89 },

1: { "value": 0, "confidence": 0.01 },

2: { "value": 0, "confidence": 0.01 },

3: { "value": 0, "confidence": 0.09 },

}

}

0	oily skin
1	dry skin
2	normal skin
3	mixed skin
pores_forehead	Object	
Result of pores_forehead analysis:

"pores_forehead":{"value": "0","confidence": 1}

0	forehead without large pores
1	forehead with large pores
pores_left_cheek	Object	
Result of pores_left_cheek analysis:

"pores_left_cheek":{"value": "0","confidence": 1}

0	left cheek without large pores
1	left cheek with large pores
pores_right_cheek	Object	
Result of pores_right_cheek analysis:

"pores_right_cheek":{"value": "0","confidence": 1}

0	right cheek without large pores
1	right cheek with large pores
pores_jaw	Object	
Result of pores_jaw analysis:

"pores_jaw":{"value": "0","confidence": 1}

0	jaw without large pores
1	jaw with large pores
blackhead	Object	
Result of blackhead analysis:

"blackhead":{"value": "0","confidence": 1}

0	no blackhead
1	have blackhead
acne	Object	
Result of acne analysis:

"acne":{"value": 0,"confidence": 1}

0	no acne
1	have acne
mole	Object	
Result of mole analysis:

"mole":{"value": 0,"confidence": 1}

0	no mole
1	have mole
skin_spot	Object	
Result of skin_spot analysis:

"skin_spot":{"value": 0,"confidence": 1}

0	no skin spot
1	have skin spot
Sample Response
Sample response when request has succeeded:
{
 "image_reset": "NTyDKpmLM7RklVcRyv2xPA==", 
 "request_id": "1528687092,efbe87f7-6c0f-4754-b108-afe8f42abe17", 
 "time_used": 666, 
 "face_rectangle": {
 "top": 1, 
 "left": 1, 
 "width": 1, 
 "height": 1
 }, 
 "result": {
 "left_eyelids": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "right_eyelids": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "eye_pouch": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "dark_circle": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "forehead_wrinkle": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "crows_feet": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "eye_finelines": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "glabella_wrinkle": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "nasolabial_fold": {
 "value": "0", 
 "confidence": 0.89
 }, 
 "skin_type": 0, 
 "details": {
 "0": {
 "value": 1, 
 "confidence": 0.89
 }, 
 "1": {
 "value": 1, 
 "confidence": 0.89
 }, 
 "2": {
 "value": 0, 
 "confidence": 0.01
 }, 
 "3": {
 "value": 0, 
 "confidence": 0.01
 }
 }, 
 "pores_forehead": {
 "value": "0", 
 "confidence": 1
 }, 
 "pores_left_cheek": {
 "value": "0", 
 "confidence": 1
 }, 
 "pores_right_cheek": {
 "value": "0", 
 "confidence": 1
 }, 
 "pores_jaw": {
 "value": "0", 
 "confidence": 1
 }, 
 "blackhead": {
 "value": "0", 
 "confidence": 1
 }, 
 "acne": {
 "value": "0", 
 "confidence": 1
 }, 
 "mole": {
 "value": "0", 
 "confidence": 1
 }, 
 "skin_spot": {
 "value": "0", 
 "confidence": 1
 }
 }
} 
Sample response when request has failed:

{
 "time_used": 525, 
 "error_message": "IMAGE_DOWNLOAD_TIMEOUT", 
 "request_id": "1470378968,c6f50ec6-49bd-4838-9923-11db04c40f8d"
}


Unique ERROR_MESSAGE of this API
HTTP Status Code

Error Message

Description

400

IMAGE_ERROR_UNSUPPORTED_FORMAT:<param>

The image which <param> indicates can not be resolved. The file format may not be supported or the file is damaged.

400	NO_FACE_FOUND	No face detected
400	INVALID_IMAGE_FACE	The image uploaded is incomplete or has multiple faces.
400

INVALID_IMAGE_SIZE:<param>

The size of uploaded image does not meet the requirement as above. <param> is the argument which indicates its size of image is too big or too small.

400

INVALID_IMAGE_URL

Failed downloading image from URL. The image URL is wrong or invalid.

400	IMAGE_FILE_TOO_LARGE:<param>	The image file passed by <param> is too large. This API requires image file size to be no larger than 2 MB.
412

IMAGE_DOWNLOAD_TIMEOUT

Image download timeout

Common ERROR_MESSAGE


HTTP Status Code

Error Message

Description

401

AUTHENTICATION_ERROR

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

400	COEXISTENCE_ARGUMENTS	Passed several arguments which are not allowed to coexist. This error message will be returned unless otherwise stated.
413	Request Entity Too Large	The request entity has exceeded the limit (2MB). This error message will be returned in plain text, instead of JSON.
404

API_NOT_FOUND

Requested API can not be found.

500

INTERNAL_ERROR

Internal error. Please retry the request.

If this error keeps occurring, please contact our support team.