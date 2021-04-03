export type Item = {
    price: string;
    img: string;
    available: boolean;
    url: string;
}

export type TrackedUrls = Record<string, {
    pushTokens: string[],
    emails: string[]
}>

// ;