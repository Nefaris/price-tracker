import { priceButtonClass, ctaButtonClass, unavailiableText } from "../config.json"
import { AxiosInstance } from "axios";
import cheerio from 'cheerio';
import { Item } from "../types/item";

const scrapeItem = async (axios: AxiosInstance, url: string): Promise<Item> => {
    const html = await axios.get(url).then(res => res.data);
    const $ = cheerio.load(html);

    const price = $(`.${priceButtonClass}`).text();
    const cta = $(`.${ctaButtonClass}`).text();
    const available = cta !== unavailiableText;
    return { price, available };
}

export default scrapeItem;