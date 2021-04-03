import { firestore } from '../index'
import { TrackedUrls } from '../types';

const getTrackedUrls = async (): Promise<TrackedUrls> => {
    const allTrackedUrls: TrackedUrls = {}
    const snap = await firestore.collection("users").get();
    const users = await snap.docs.map(doc => doc.data());

    for (const user of users) {
        const { push, email, messenger } = user.profileSettings;

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

                if (email) {
                    allTrackedUrls[url].emails.push(user.email);
                }
            }
        }
    }

    return allTrackedUrls;
}

export default getTrackedUrls;