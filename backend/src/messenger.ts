import axios from "axios";

export const sendMessengerMessages = (messengerPsids: string[], item) => {
    messengerPsids.forEach(psid => {
        axios.post("https://shining-quartz-sandalwood.glitch.me/send", {
            psid,
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        "template_type": "generic",
                        "elements": [
                            {
                                "title": "Przedmiot dostępny",
                                "image_url": item.img,
                                "subtitle": `${item.title} \n Cena: ${item.price}`,
                                "default_action": {
                                    "type": "web_url",
                                    "url": item.url,
                                    "webview_height_ratio": "tall"
                                },
                                "buttons": [
                                    {
                                        "type": "web_url",
                                        "url": item.url,
                                        "title": "Zobacz na stronie"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        })
            .then(e => console.log(e))
            .catch(e => console.log(e))
    });
}
