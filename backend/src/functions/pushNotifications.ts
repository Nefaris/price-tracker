import { messaging } from "../index";
import { Item } from "../types";

export const sendPushNotifications = (pushTokens: string[], item: Item, url: string) => {
    if (!pushTokens.length) return;

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
}

