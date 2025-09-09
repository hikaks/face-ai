Version
1.0

Overview
Get 1000 key points of the face from the uploading image or the face mark face_token detected by the Detect API, and accurately locate the facial features and facial contours.

A Dense Facial Landmark analysis that supports one face at once. If there are multiple faces in the picture, only one face with the largest face area is analyzed. (same area, randomly select a face).

This API is to accurately locate the facial features of each part of the face. It is recommended to use the high-resolution image of the face to get the best results.

Image Requirements
Format : JPG (JPEG), PNG
Size : between 100*100 and 4096*4096 (pixels)
File size : no larger than 2MB
Minimal size of face : the bounding box of a detected face is a square. The minimal side length of a square should be no less than 1/24 of the short side of image, and no less than 100 pixels. For example if the size of image is 4096 * 3200px, the minimal size of face should be 132 * 132px.

Changelog
August 19, 2019. Eye landmark add the eyelid landmark（The eyelid landmark has a complete circle around the eyelash contour and canthus, which can be used to achieve the beauty effect of eyeliner ）

Request URL
https://api-us.faceplusplus.com/facepp/v1/face/thousandlandmark

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

Required

(choose any of four)

face_token

String

Face ID face_token, use this parameter first

image_url	
String

URL of the image.

image_file	
File

The binary data of the image, uploaded via POST multipart/form-data.

image_base64	String	
Base64 encoded binary data of the image.

These three parameters (image_url, image_file and image_base64) will be adopted in the following order of precedence:

Highest: image_file; Lowest: image_url.

Required

return_landmark

String

Whether to detect and return face key points. The legal value is：

all	
Detect and return facial landmarks in all parts.

(As long as 'all' is included in the parameter, all key points are returned)

left_eyebrow

right_eyebrow

left_eye

left_eye_eyelid

right_eye

right_eye_eyelid

nose

mouse

face



The part of the face that you want to detect and return.

You need to group the required items into a comma-separated string, and the order between the items is not required.

For a detailed description of each item, refer to the "landmarks" section of the "Return Values" section below.

Note：The default value of this parameter is All.

Return Values
FIelds	Type	Description
request_id	String	A only string that used to distinguish each request.
face

Object

Analyzed face

Note: If no face is detected, it is empty.

time_used

Int

The time spent in the entire request, the unit is milliseconds.

error_message

String

This string will be returned when the request fails. For details, see the section on subsequent error messages. Otherwise this field does not exist.

Elements contained in faces array
FIelds

Type

Description

face_rectangle

Object

The position of the face rectangle, including the following properties. The value of each attribute is an integer:

Top: the ordinate of the pixel in the upper left corner of the rectangle
Left: the abscissa of the pixel in the upper left corner of the rectangle
Width: the width of the rectangle
Height: the height of the rectangle
landmark

Object

An array of key points coordinates for facial features and contours.

TBA: Add a detailed illustration of the facial landmarks.



Elements contained in Landmarks
Field	Type	Description	
face	Object	
A collection of facial landmarks. The return values are：

face_hairline_0 ... face_hairline_144	The landmarks of the upper part of the face, starting from the vicinity of the right ear to the end of the left ear, it is a sequence of positions detected in a counterclockwise order.
face_contour_right_0... face_contour_right_63	
The landmarks of the lower part of the right side of the face. From the beginning of the chin to the vicinity of the right ear, it is a sequence of positions detected in a counterclockwise order.

face_contour_right_0

is the center of the chin 。

face_contour_left_0... face_contour_left_63	The landmarks of the lower part of the right side of the face. It is a sequence of positions detected in clockwise order from the beginning of the chin to the vicinity of the left ear。
When the face is angled, the landmarks are marked with key points in the visual area. If there is occlusion, it is currently the landmark positions of the pre-judgment. (It is planned to return a null value to the occlusion area in the future.)





left_eyebrow	Object	
The collection of landmarks for the left eyebrow. The return value is:

left_eyebrow_0 ... left_eyebrow_63	Starting from the center of the left eyebrow, the sequence of landmarks of the left eyebrow detected in a clockwise order


right_eyebrow	Object	
The collection of landmarks for the right eyebrow. The return value is:

right_eyebrow_0 ... right_eyebrow_63	Starting from the center of the right eyebrow, the sequence of landmarks of the right eyebrow detected in a counterclockwise order






left_eye	Object	
The collection of landmarks for the white of the left eye. The return value is:

left_eye_0 ... left_eye_62	Starting from the center of the left end of the left eye, the sequence of landmarks of the left eye detected in a clockwise order.
left_eye_pupil_center	Light eye pupil center
left_eye_pupil_radius	Left eye pupil radius


left_eye_eyelid	Object	
The collection of landmarks for the left eyelid. The return value is:

left_eye_eyelid_0...left_eye_eyelid_63	
Starting from the left outside canthus，the sequence of landmarks of the left eyelid detected in a clockwise order.



right_eye	Object	
The collection of landmarks for the white of the right eye. The return value is:

right_eye_0 ... right_eye_62	Starting from the center of the right end of the right eye, the sequence of landmarks of the right eye detected in a counterclockwise order.
right_eye_pupil_center	
Right eye pupil center

right_eye_pupil_radius	Right eye pupil radius


right_eye_ eyelid	Object	
The collection of landmarks for the right eyelid. The return value is:

right_eye_eyelid_0...right_eye_eyelid_63	Starting from the right outside canthus，the sequence of landmarks of the right eyelid detected in a counterclockwise order.


nose	Object	
The collection of landmarks for the nose. The return value is:

nose_left_0 ... nose_left_62	Starting from the left of the nose to the tip of the nose, the sequence of landmarks of the nose is detected sequentially.
nose_right_0 ...nose_right_62	Starting from the right of the nose to the tip of the nose, the sequence of landmarks of the nose is detected sequentially.
left_nostril	Left nostril (the center of the upper edge of the nostril)
right_nostril	Right nostril (the center of the upper edge of the nostril)
nose_midline_0...nose_midline_59	From the middle of the eyebrow to the philtrum, the sequence of key points of the midline of the nose detected from top to bottom


mouth	Object	A collection of landmarks for the mouth. The return value is:
upper_lip_0 ... upper_lip_31	The upper edge of the upper lip. A sequence of landmarks starting from the left corner of the mouth to the upper edge of the upper lip detected from left to the right.
upper_lip_32 ... upper_lip_63	The lower edge of the upper lip. A sequence of landmarks about the lower edge of the upper lip detected from right to the left.
lower_lip_0 ... lower_lip_31	The lower edge of the lower lip. A sequence of landmarks starting from the left corner of the mouth to the lower edge of the lower lip detected from left to the right.
lower_lip_32 ... lower_lip_63	The upper edge of the lower lip. A sequence of landmarks about the upper edge of the lower lip detected from right to the left.




Lines：
The facial features and contours of the face can be obtained by connecting the points together, and a polygonal chain can be generated, which is, a line formed by a plurality of points connected in order, which may or may not be closed-loop. The expression of this line is a collection of landmarks.



The corresponding curve can be generated by the landmarks returned. The following is an example (using opencv  'plotlines' function) to show if a curve is generated by a point and perform subsequent operations.



Example of generating a curve：

(to be added)



Sample Response
Sample response when request has succeeded
TBA

Sample response when request has failed:
{
    "time_used": 5,
    "error_message": "INVALID_FACE_TOKENS_SIZE",
    "request_id": "1469761051,ec285c20-8660-47d3-8b91-5dc2bffa0049"
}

Unique ERROR_MESSAGE of this API
HTTP Status
Code

Error Message

Description

400

INVALID_FACE_TOKEN: <face_token>

When using face_token as a parameter, the passed face_token does not exist



Common ERROR_MESSAGE
HTTP Status
Code

Error Message

Description

401

AUTHENTICATION_ERROR

api_key and api_secret does not match

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
Passed several arguments which are not allowed to coexist. This error message will be returned unless otherwise stated

412	IMAGE_DOWNLOAD_TIMEOUT	Image download timeout
413	Request Entity Too Large	The request entity has exceeded the limit (2MB). This error message will be returned in plain text, instead of JSON
404

API_NOT_FOUND

Requested API can not be found.

500

INTERNAL_ERROR

Internal error. Please retry the request.

If this error keeps occurring, please contact our support team.

Sample request
curl -X POST "https://api-cn.faceplusplus.com/facepp/v1/face/facekeypoint" \
-F "api_key=<api_key>" \
-F "api_secret=<api_secret>" \
-F "return_landmark=1" \
-F "face_tokens=c2fc0ad7c8da3af5a34b9c70ff764da0"