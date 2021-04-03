import { firestore } from '../index'
import { TrackedUrls } from '../types';

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const getTrackedUrls = async (): Promise<TrackedUrls> => {
    const allTrackedUrls: TrackedUrls = {}
    const snap = await firestore.collection("users").get();
    const users = await snap.docs.map(doc => doc.data());

    for (const user of users) {
        const { push, email, messenger, notificationsEmail } = user.profileSettings;

        if (user.trackedUrls) {
            for (const url of user.trackedUrls) {
                if (!allTrackedUrls[url]) {
                    allTrackedUrls[url] = {
                        pushTokens: [],
                        emails: []
                    }
                }
                if (push && user.notificationTokens) {
                    const tokens = allTrackedUrls[url].pushTokens;
                    allTrackedUrls[url].pushTokens = [...(tokens || []), ...user.notificationTokens]
                }

                if (email && emailRegex.test(notificationsEmail)) {
                    allTrackedUrls[url].emails.push(notificationsEmail);
                }
            }
        }
    }

    return allTrackedUrls;
}

export default getTrackedUrls;