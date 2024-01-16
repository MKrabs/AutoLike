// AutoLike is a browser extension that automatically likes videos on YouTube
// Author: @Mkrabs
// License: GNU General Public License v3.0
// Version: 1.0.0
// Repository: www.github.com/Mkrabs/AutoLike
// Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/autolike/


class AutoLikeAddon {
    constructor() {
        this.prefix = "[AutoLike]";
        this.syncStorage = new SyncManager();
        this.videoManager = new VideoManager();
        this.channelManager = new ChannelManager();
        this.init();
    }

    init() {
        console.debug(`${this.prefix} Initializing...`);
        this.syncStorage.getStorageValues();
    }

}

class SyncManager {
    constructor() {
        this.processedVideoIds = [];
        this.channelIds = [];
        this.getStorageValues();
    }

    getStorageValues() {
        console.debug(`${autoLikeAddon.prefix} Getting storage values...`);
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
        console.debug(`${autoLikeAddon.prefix} Setting storage values...`);
        this.setChannelIds();
        this.setProcessedVideoIds();
    }

    setChannelIds() {
        browser.storage.sync.set({ channelIds: this.channelIds });
    }

    setProcessedVideoIds() {
        localStorage.setItem("processedVideoIds", JSON.stringify(this.processedVideoIds));
    }
}

class VideoManager {
    constructor() {
        // Add any necessary properties here
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
}

class ChannelManager {
    constructor() {
        // Add any necessary properties here
    }

    findCurrentChannel() {
        // Implementation here
    }

    channelIncluded() {
        // Implementation here
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
            console.debug(`${this.prefix} Element not found: ${selector}`);
            return;
        }
        tries--;
        waitForElement(selector, callback, timeout, tries);
    }, timeout);
}

// Instantiate the addon
const autoLikeAddon = new AutoLikeAddon();
autoLikeAddon.run();
