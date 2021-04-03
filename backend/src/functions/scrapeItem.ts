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
    const img = $(".sc-1e853jq-4 img").attr('src');
    return { price, available, img };
}

export default scrapeItem;