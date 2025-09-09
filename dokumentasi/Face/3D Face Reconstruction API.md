Version
1.0

Overview
3D Face Reconstruction API can reconstruct 3D face model based on one or three single face pictures.

Image Requirements
Format : JPG (JPEG)

Size : between 200*200 and 4096*4096 (pixels)

File size : no larger than 2MB

Minimal size of face : To ensure the accuracy of results,it is recommended that the minimum length of the face frame (square) in the picture is no less than 200 pixels. 

Face quality: The higher the quality of the face, the more accurate the 3D face reconstruction. Factors affecting face quality include: occlusion of facial features, blurred pictures and improper illumination.

URL
https://api-us.faceplusplus.com/facepp/v1/3dface

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

Required(Choose one of three)


image_url_1	
String

URL of the face image

Note: When downloading image, it may take too long to download image due to network reasons. It is recommended to use the image_file or image_base64 parameter to upload pictures directly.

image_file_1	
File

The binary data of the face image, uploaded via POST multipart/form-data.
image_base64_1	String	
Base64 encoded binary data of the image.

These three parameters (image_url, image_file and image_base64) will be adopted in the following order of precedence:

Highest: image_file; Lowest: image_url.

Optional(Choose one of three）	image_url_2	String	URL of the second image, it is recommended to pass in the left side face image.
image_file_2	File	The binary data of the second image, uploaded via POST multipart/form-data.
image_base64_2	String	
Base64 encoded binary data of the image.

These three parameters (image_url_2, image_file_2 and image_base64_2) will be adopted in the following order of precedence:

Highest: image_file_2; Lowest: image_url_2.

Optional(Choose one of three）	image_url_3	String	URL of the third image, it is recommended to pass in the right side face image.
image_file_3	File	The binary data of the third image, uploaded via POST multipart/form-data.
image_base64_3	String	
Base64 encoded binary data of the image.

These three parameters (image_url_3, image_file_3 and image_base64_3) will be adopted in the following order of precedence:

Highest: image_file_3; Lowest: image_url_3.

Optional	texture	Int	
Whether to return the texture map. Valid values are:

0	No
1	Yes
Note: The default value is 0.

Optional	mtl	Int	
Whether to return the mtl file. Valid values are:

0	No
1	Yes
Note: The default value is 0.



Return Values
Fields

Type

Description

request_id	String	Unique id of each request
obj_file	String	obj file, face 3D model file
texture_img	String	Expanded texture map, jpg format.Base64-encoded binary image data.
mtl_file	String	mtl file, material library file
transfer_matrix	Array[folat][float]	
16 * n transformation matrix, n is the number of incoming image

Note: Input the perspective transformation matrix (excluding perspective) corresponding to the perspective of the picture. The model corresponding to the obj file will be consistent with the perspective in the image after this matrix change

time_used

Int

Time that the whole request takes. Unit: millisecond.

error_message

String

This string will not be returned unless request fails. For more details, please see the following section on error message.

Note：

1. obj_file and mtl_file need to be base64 decoded.

2. obj file, mtl file, and texture file need to be fixed file names: face.obj, face.mtl, tex.jpg.

3. obj file, mtl file, and texture file are saved in the same system path.

4. Windows system, it is recommended to use the Microsoft 3D Viewer to view the visualization results of the obj file. The projection mode is orthogonal.

5. macOS system, you can use mashlab to view the obj file visualization results.

Sample Response
Sample response when request has succeeded:
{
  "request_id": "1576058873,18105fd0-28fe-4790-a44e-6102009bc195",
  "mtl_file": "mtl_file",
  "obj_file": "obj_file",
  "texture_img": "texture_img",
  "time_used": 2114,
  "transfer_matrix": [
    [6.7192183, -0.27454704, -0.1731284, -69.249084, 0.26191366, 6.7055917, -0.46870133, 114.49048, 0.017390553, 0.041857347, 0.60856056, 0, 0, 0, 0, 1]
  ]
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

400	NO_FACE_FOUND: <param>	No face detected, <param> indicates the problem with which image
400	MULTIPLE_FACE_FOUND: <param>	Multiple faces appear in the image, <param> indicates the problem with which image
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


