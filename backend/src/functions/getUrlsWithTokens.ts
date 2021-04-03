import { firestore } from '../index'

const getUrlsWithTokens = async (): Promise<Record<string, string[]>> => {
    const allTrackedUrls: Record<string, string[]> = {}
    const snap = await firestore.collection("users").get();
    const users = await snap.docs.map(doc => doc.data());

    for (const user of users) {
        if (!user.trackedUrls) continue;

        for (const url of user.trackedUrls) {
            const urls = allTrackedUrls[url];
            allTrackedUrls[url] = [...(urls || []), ...user.notificationTokens]
        }
    }

    return allTrackedUrls;
}

export default getUrlsWithTokens;