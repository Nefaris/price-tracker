import config from "../config.json"
import { AxiosInstance } from "axios";
import cheerio from 'cheerio';
import { Item } from "../types";

const scrapeItem = async (axios: AxiosInstance, url: string): Promise<Item> => {
    const storeSettings = config.stores.filter(store => url.includes(store.name))[0]

    const html = await axios.get(url).then(res => res.data);
    const $ = cheerio.load(html);

    const price = $(storeSettings.priceButtonClass).text();
    const cta = $(storeSettings.ctaButtonClass).text();
    const available = cta !== storeSettings.unavailiableText;
    const title = $(storeSettings.titleClass).text();
    const img = $(storeSettings.imageClass).attr('src');
    return { price, available, img, url, title };
}

export default scrapeItem;