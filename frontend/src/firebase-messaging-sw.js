importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBTGYazxJR65FAMkW5WD1iXioQMaoME0vM',
  authDomain: 'lotier-1c4bd.firebaseapp.com',
  projectId: 'lotier-1c4bd',
  storageBucket: 'lotier-1c4bd.appspot.com',
  messagingSenderId: '426654492085',
  appId: '1:426654492085:web:cd67e018a3e82d86f2a5fc',
  measurementId: 'G-ZXYDGYYJ3S'
});

const messaging = firebase.messaging();
