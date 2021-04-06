require('dotenv').config()
import express from 'express';
import axios from 'axios';
import * as admin from 'firebase-admin';
import Scheduler from './classes/Scheduler';
import scrapeAndNotify from './functions/scrapeAndNotify';

const serviceAccount = require("../serviceAccountKey.json");
const scheduler = new Scheduler();
const app = express();
app.use(express.json());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const axiosInstance = axios.create();
export const firestore = admin.firestore();
export const messaging = admin.messaging();

app.listen(3000);
scheduler.scheduleJob(30000, scrapeAndNotify)


app.post('/changeInterval', (req, res) => {
    const time = req.body.time;

    if (!time) {
        res.status(400);
        return;
    }

    scheduler.scheduleJob(time, scrapeAndNotify)
    res.status(200);
    res.send("OK");
})