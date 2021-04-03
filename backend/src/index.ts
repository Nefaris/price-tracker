require('dotenv').config()
import axios from 'axios';
import scrapeItem from './functions/scrapeItem';
import * as admin from 'firebase-admin';
const serviceAccount = require("../serviceAccountKey.json");
const axiosInstance = axios.create();
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const firestore = admin.firestore();
const messaging = admin.messaging();

// Example unavailable item
const url = "https://www.x-kom.pl/p/400625-dysk-ssd-crucial-500gb-25-sata-ssd-mx500.html";

const main = async () => {
    const item = await scrapeItem(axiosInstance, url)
    const snap = await firestore.collection("users").get();
    const tokens = await snap.docs.map(doc => doc.data().notificationTokens).flat();
    console.log(item);

    const message = {
        data: {
            "title": "Dostępny przedmiot!",
            "body": `Cena: ${item.price}`,
            "click_action": url,
            "icon": item.img,
            "image": item.img,
        },
        tokens
    };

    messaging.sendMulticast(message)
        .then((response) => {
            console.log(response);
            if (response.failureCount > 0) {
                console.log("Failiures count: ", response.failureCount);
            }
        });
}

main();