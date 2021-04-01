import axios from 'axios';
import scrapeItem from './functions/scrapeItem';
const axiosInstance = axios.create();

// Example unavailable item
const url = "https://www.x-kom.pl/p/590448-karta-graficzna-nvidia-palit-geforce-rtx-3090-gaming-pro-oc-24g-gddr6x.html";

const main = async () => {
    const item = await scrapeItem(axiosInstance, url)
    console.log(item)
}

main();