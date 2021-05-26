# Price checker

Price checker is an application that allows you to track the availability of products in online stores. It allows you to add products to track and set the interval of checking availability. If the product changes its status to available, the user gets a notification on his chosen medium, such as: Facebook messenger, email address and push notifications. The app is fully responsive and tailored for mobile and desktop devices.

To send notifications we use Facebook API for messenger notifcations and Firebase Cloud Messaging for push notifications.

## Credits
The application was created with the help of <a href="https://github.com/dadu109">Dawid Miczek</a> who took care of the backend.


## Usage
Run development server: `npm start`<br>
Build production version: `build:prod`<br>
Run PWA live version: `live:prod`

## Technologies
#### Frontend
Angular 11
Firebase
FireAuth
Firestore
AngularFire
Taiga UI

#### Backend
Node.js
Express
Webhooks
Cheerio
Axios
Typescript
Node-mailer

## Screenshots

#### Main panel
<img src="https://user-images.githubusercontent.com/34476654/119700486-8fdb2980-be53-11eb-9610-976feed1de0b.png" width="800px">
<img src="https://user-images.githubusercontent.com/34476654/119700552-a5505380-be53-11eb-8018-d4804ade1740.png" width="400px">

#### Settings
<img src="https://user-images.githubusercontent.com/34476654/119701995-41c72580-be55-11eb-8fce-c35ff673df2f.png" width="800px">

#### Example notification
<img src="https://user-images.githubusercontent.com/34476654/119702081-5acfd680-be55-11eb-8e46-10207a895827.png" width="400px;">
