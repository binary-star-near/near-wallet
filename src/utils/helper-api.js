
import { ACCOUNT_HELPER_URL } from '../config';

export let controller;

export async function getAccountIds(publicKey) {
    controller = new AbortController();
    return await fetch(`${ACCOUNT_HELPER_URL}/publicKey/${publicKey}/accounts`, { signal: controller.signal }).then((res) => res.json());
}

export function isUrlNotJavascriptProtocol(url) {
    if (!url) {
        return true;
    }

    const urlProtocol = new URL(url).protocol;
    if (urlProtocol === 'javascript:') {
        console.log('Invalid URL protocol:', urlProtocol, 'URL cannot execute JavaScript');
        return false;
    }

    return true;
}
