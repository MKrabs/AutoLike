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
    }

    setStorageValues() {
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

// Instantiate the addon
const autoLikeAddon = new AutoLikeAddon();
autoLikeAddon.run();
