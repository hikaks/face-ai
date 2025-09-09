Version
3.0

Overview
Find one or more most similar faces from Faceset, to a new face. You can upload image file or use face_token for face searching. For image upload, the biggest face by the size of bounding box within the image will be used. For face_token, you shall get it by using Detect API.

Image Requirements
Format : JPG (JPEG), PNG
Size : between 48*48 and 4096*4096 (pixels)
File size : no larger than 2MB
Minimal size of face : the bounding box of a detected face is a square. The minimal side length of a square should be no less than 150 pixels.

Changelog
March 28, 2017. Added support for Base64 encoded image.

Request URL
https://api-us.faceplusplus.com/facepp/v3/search

Request Method
POST

Permission
All API Keys can use this API.

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

Required (choose any of four)

 

face_token

String

The id of the face to be searched. (Highest precedence)

image_url

String

URL of the image containing the face to be searched.

image_file	File	
The binary data of the image, uploaded via POST multipart/form-data.

image_base64	String	
Base64 encoded binary data of the image.

These three parameters (image_url, image_file and image_base64) will be adopted in the following order of precedence:

Highest: image_file; Lowest: image_url.

Required (choose either of two)

faceset_token

String

The id of Faceset.

outer_id	String	User-defined id of Faceset.
Optional	return_result_count	Int	The number of returned results that have highest confidence score, between [1,5]. The default value is 1.
Return Values
Fields

Type

Description

request_id	String	Unique id of each request
results	Array	
Array of search results.

 If no face is detected within the image uploaded, this array will not be returned.

thresholds

Object

A set of thresholds including 3 floating-point numbers with 3 decimal places between [0,100].

If the confidence does not meet the "1e-3" threshold, it is highly suggested that the two faces are not from the same person. While if the confidence is beyond the "1e-5" threshold, there's high possibility that they are from the same person.

1e-3: confidence threshold at the 0.1% error rate;

1e-4: confidence threshold at the 0.01% error rate;

1e-5: confidence threshold at the 0.001% error rate;

Note: seeing that thresholds are not static, there's no need to store values of thresholds in a persistent form, especially not to compare the confidence with a previously returned threshold.

 If no face is detected within the image uploaded, this string will not be returned.

image_id	String	
Unique id of an image uploaded by image_url, image_file or image_base64.

Note: if none of image_url, image_file or image_base64 is used, this string will not be returned.

faces	Array	Array of detected faces within the image uploaded by image_url, image_file or image_base64. The first face in this array will be used for face comparing.
Note: if none of image_url, image_file or image_base64 is used, this array will not be returned. If no face is detected, the array is [].

time_used

Int

Time that the whole request takes. Unit: millisecond

error_message

String

This string will not be returned unless request fails. For more details, please see the following section on error message.

Elements contained in results array
Fields

Type

Description

face_token	String	face_token in the Faceset.
confidence

Float

Indicates the similarity of two faces, a floating-point number with 3 decimal places between [0,100]. Higher confidence indicates higher possibility that two faces belong to same person.

user_id	String	
User-defined id of face. This string will not be returned if not exists.

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


Sample Response
Sample response when request has succeeded:
{
	"request_id": "1470481443,0d749845-7153-4f5e-a996-ffc5a1ac0a79",
	"time_used": 1126,
	"thresholds": {
		"1e-3": 65.3,
		"1e-5": 76.5,
		"1e-4": 71.8
	},
	"results": [{
		"confidence": 96.46,
		"user_id": "234723hgfd",
		"face_token": "4dc8ba0650405fa7a4a5b0b5cb937f0b"
	}]
}

Sample response when request has failed:
{
	"time_used": 5,
	"error_message": "INVALID_OUTER_ID",
	"request_id": "1469761051,ec285c20-8660-47d3-8b91-5dc2bffa0049"
}
 

Unique ERROR_MESSAGE of this API
HTTP Status Code

Error Message

Description

400

INVALID_FACE_TOKEN: <face_token>

face_token can not be found

400

INVALID_OUTER_ID

outer_id can not be found

400

INVALID_FACESET_TOKEN

faceset_token can not be found

400	EMPTY_FACESET	No face_token found in the Faceset
400

IMAGE_ERROR_UNSUPPORTED_FORMAT:<param>

The image which <param> indicates can not be resolved. The file format may not be supported or the file is damaged.

400

INVALID_IMAGE_SIZE:<param>

The size of uploaded image does not meet the requirement as above. <param> is the argument which indicates its size of image is too big.

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
 

curl -X POST "https://api-us.faceplusplus.com/facepp/v3/search" \
-F "api_key=<api_key>" \
-F "api_secret=<api_secret>" \
-F "face_token=c2fc0ad7c8da3af5a34b9c70ff764da0" \
-F "outer_id=facesetid"