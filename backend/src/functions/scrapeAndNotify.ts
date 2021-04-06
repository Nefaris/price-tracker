import { axiosInstance, firestore } from "..";
import { Item } from "../types";
import { sendEmails } from "./email";
import getUrlsWithTokens from "./getUrlsWithTokens";
import { sendMessengerMessages } from "./messenger";
import { sendPushNotifications } from "./pushNotifications";
import scrapeItem from "./scrapeItem";

const scrapeAndNotify = async () => {
    const usersSnap = await (await firestore.collection("users").get()).docs;

    const allTrackedUrls = await getUrlsWithTokens();
    const scrapedItems: (Item | null)[] = await Promise.all(Object.keys(allTrackedUrls).map((url) => scrapeItem(axiosInstance, url)));
    console.log("Its working");

    for (const url in allTrackedUrls) {
        if (url === null) continue;

        const { pushTokens, emails, messengerPsids } = allTrackedUrls[url];
        const item = scrapedItems.find(item => item.url === url);

        console.log(item);

        if (item.available) {
            console.log('available');
            sendEmails(emails, item)
            sendMessengerMessages(messengerPsids, item)
            sendPushNotifications(pushTokens, item);
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

export default scrapeAndNotify;