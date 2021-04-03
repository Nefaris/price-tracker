require('dotenv').config()
const cron = require('node-cron');
const express = require('express');
import axios from 'axios';
import scrapeItem from './functions/scrapeItem';
import getUrlsWithTokens from './functions/getUrlsWithTokens';
import * as admin from 'firebase-admin';
import { Item } from './types/item';
const serviceAccount = require("../serviceAccountKey.json");
const axiosInstance = axios.create();
const app = express();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const firestore = admin.firestore();
export const messaging = admin.messaging();

cron.schedule('* * * * *', function () {
    console.log('running a task every minute');
    cronJob();
});

app.listen(3000);


const cronJob = async () => {
    const allTrackedUrls = await getUrlsWithTokens();
    const scrapedItems: Item[] = await Promise.all(Object.keys(allTrackedUrls).map((url) => scrapeItem(axiosInstance, url)));
    console.log(allTrackedUrls, scrapedItems);

    for (const url in allTrackedUrls) {
        const tokens = allTrackedUrls[url];
        const item = scrapedItems.find(item => item.url === url);

        if (!item.available) continue;

        const message = {
            tokens,
            data: {
                "title": "Dostępny przedmiot!",
                "body": `Cena: ${item.price}`,
                "click_action": url,
                "icon": item.img,
                "image": item.img,
            }
        };

        messaging.sendMulticast(message)
            .then((response) => {
                console.log(response);
                if (response.failureCount > 0) {
                    console.log("Failiures count: ", response.failureCount);
                }
            });
    }
}
cronJob();