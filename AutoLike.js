// AutoLike is a browser extension that automatically likes videos on YouTube
// Author: @Mkrabs
// License: GNU General Public License v3.0
// Version: 1.0.0
// Repository: www.github.com/Mkrabs/AutoLike
// Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/autolike/

const prefix = "[AutoLike]";
let timebeforescript = 1000;
let timebetweenupdates = 10000;

class AutoLikeAddon {
    constructor() {
        this.channelManager = new ChannelManager();
    }

    init() {
        console.debug(`${prefix} Initializing...`);
        this.delay(timebeforescript).then(() => {
            this.startWatching();
        });
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startWatching() {
        this.watcher = setInterval(async () => {
            if (this.channelManager.isChannelIncluded() && !this.channelManager.videoAlreadyProcessed())
                this.channelManager.likeVideo();
        }, timebetweenupdates);
    }

    stopWatching() {
        console.debug(`${prefix} Stopping.`);
        clearInterval(this.watcher);
    }
}

class SyncManager {
    constructor() {
        this.processedVideoIds = [];
        this.channelIds = [];
        this.getStorageValues();
    }

    getStorageValues() {
        console.debug(`${prefix} Getting storage values`);
        console.debug(this.getSyncParameter("timebeforescript"));
        this.getChannelIds();
        this.getProcessedVideoIds();
    }

    getChannelIds() {
        this.channelIds = browser.storage.sync.get("channelIds");
    }

    getProcessedVideoIds() {
        const storedVideoIds = localStorage.getItem("processedVideoIds");
        this.processedVideoIds = storedVideoIds ? JSON.parse(storedVideoIds) : [];
    }

    setStorageValues() {
        console.debug(`${prefix} Setting storage values`);
        this.setChannelIds();
        this.setProcessedVideoIds();
    }

    setChannelIds() {
        this.setSyncParameter("channelIds");
    }

    setProcessedVideoIds() {
        localStorage.setItem("processedVideoIds", JSON.stringify(this.processedVideoIds));
    }

    async getSyncParameter(parameter) {
        function onSuccess(result) {
            console.error(`${prefix} Error: ${error}`);
            return {[parameter]: result[parameter]};
        }

        function onError(error) {
            console.error(`${prefix} Error: ${error}`);
        }

        return await browser.storage.sync.get(parameter).then(onSuccess, onError);
    }

    setSyncParameter(parameter, value) {
        const dict = {[parameter]: value};

        try {
            browser.storage.sync.set(dict);
            return dict;
        } catch (error) {
            console.error(`${prefix} Error: ${error}`);
        }
    }
}

class FrontendManager {
    #channelRegex = /channel\/([\w.-]+)/i;
    #tagRegex = /@([\w.-]+)/i;
    #shortchangeRegex = /c\/([\w.-]+)/i;

    constructor() {
        // Add any necessary properties here
    }

    findCurrentChannel() {
        let link = document.querySelector('#owner a').href.toString();
        return link.match(this.#channelRegex)?.[1]
            || link.match(this.#tagRegex)?.[1]
            || link.match(this.#shortchangeRegex)?.[1]
            || "";
    }

    watchForMouseHover() {
        // Implementation here
    }

    likeVideoIfAsked() {
        // Implementation here
    }

    addToBlacklist() {
        // Implementation here
    }

    getVideoId() {
        url = window.location.href;
        urlParams = new URLSearchParams(url.split("?")[1]);
        return urlParams.get("v");
    }
}

class ChannelManager {
    constructor() {
        this.frontendManager = new FrontendManager();
        this.syncStorage = new SyncManager();
    }


    isChannelIncluded(channel = null) {
        console.debug(`${prefix} Checking if channel is included`);
        try {
            let channelToFind = channel || findCurrentChannel();
        } catch (error) {
            console.error(`${prefix} Error: ${error}`);
            return false;
        }
        console.debug(`${prefix} Channel to find: ${channelToFind}`);
        if (this.syncStorage.channelIds.includes(channelToFind)) {
            console.debug(`${prefix} Channel %c${channelToFind} %cincluded! %c✔`, `color: blue;`, `color: inherit;`, `color: green;`);
            return channelToFind;
        }

        console.debug(`${prefix} Channel %c${channelToFind} %cnot included! %c✘`, `color: blue;`, `color: inherit;`, `color: red;`);
        return null;
    }

    videoAlreadyProcessed() {
        const videoId = this.frontendManager.getVideoId();

        if (this.syncStorage.processedVideoIds.includes(videoId)) {
            console.debug(`${prefix} Video already processed! %c✘`, `color: red;`);
            return true;
        }

        console.debug(`${prefix} Video ${videoId} not processed yet! %c✔`, `color: green;`);
        this.syncStorage.processedVideoIds.push(videoId);
        localStorage.setItem("processedVideoIds", JSON.stringify(this.syncStorage.processedVideoIds));
        return false;
    }

    likeVideo() {

    }
}

const waitForElement = (selector, callback, timeout = 5000, tries = 3) => {
    const observer = new MutationObserver((mutations, me) => {
        const element = document.querySelector(selector);
        if(!element)
            return;
        callback(element);
        me.disconnect();
    });

    observer.observe(document, { childList: true, subtree: true });

    setTimeout(() => {
        if(tries === 0) {
            console.debug(`${prefix} Element not found: ${selector}`);
            return;
        }
        tries--;
        waitForElement(selector, callback, timeout, tries);
    }, timeout);
}

// Instantiate the addon
const autoLikeAddon = new AutoLikeAddon();
autoLikeAddon.init();
