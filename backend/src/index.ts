require('dotenv').config()
const cron = require('node-cron');
const express = require('express');
import axios from 'axios';
import scrapeItem from './functions/scrapeItem';
import getUrlsWithTokens from './functions/getUrlsWithTokens';
import * as admin from 'firebase-admin';
import { Item } from './types';
import { sendEmails } from './functions/email';
import { sendMessengerMessages } from './messenger';
const serviceAccount = require("../serviceAccountKey.json");
const axiosInstance = axios.create();
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const firestore = admin.firestore();
export const messaging = admin.messaging();

// cron.schedule('* * * * *', function () {
//     console.log('running a task every minute');
//     cronJob();
// });

// app.listen(3000);


const cronJob = async () => {
    const usersSnap = await (await firestore.collection("users").get()).docs;

    const allTrackedUrls = await getUrlsWithTokens();
    const scrapedItems: Item[] = await Promise.all(Object.keys(allTrackedUrls).map((url) => scrapeItem(axiosInstance, url)));
    console.log(allTrackedUrls, scrapedItems);

    for (const url in allTrackedUrls) {
        const { pushTokens, emails, messengerPsids } = allTrackedUrls[url];
        const item = scrapedItems.find(item => item.url === url);

        if (item.available) {
            sendEmails(emails, `Cena: ${item.price} <img src="${item.img}" />`)
            sendMessengerMessages(messengerPsids, item)

            if (!pushTokens.length) continue;

            const message = {
                tokens: pushTokens,
                data: {
                    "title": "Dostępny przedmiot!",
                    "body": `Cena: ${item.price}`,
                    "click_action": url,
                    "icon": item.img ?? '',
                    "image": item.img ?? '',
                }
            };

            messaging.sendMulticast(message)
                .then((response) => {
                    console.log(response);
                    if (response.failureCount > 0) {
                        console.log("Failiures count: ", response.failureCount);
                    }
                });
        };

        for (const user of usersSnap) {
            const trackedItems = user.data().trackedItems;
            const trackedItem = trackedItems.find(trackedItem => trackedItem.url === url);

            if (!trackedItem) continue;

            trackedItem.notified = item.available ? item.available : trackedItem.notified;
            trackedItem.isAvailable = item.available
            firestore.collection("users").doc(user.ref.id).update({ trackedItems })
        }

    }
}

cronJob();
