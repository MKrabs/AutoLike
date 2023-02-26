const channelCountSpan = document.querySelector("#channel-count");
const currentChannels = document.querySelector("#current-channels");
const channelList = document.querySelector("#channel-list");
const currentChannelAction = document.querySelector("#current-channel-action");
const currentChannelName = document.querySelector("#current-channel-name");


let channelIds = [];
let currentChannel = "";


function updateChannels() {
    browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            // Execute a script in the context of the current tab
            return browser.tabs.executeScript(tabs[0].id, {
                code: "JSON.parse(window.localStorage.getItem('channelIds'))"
            });
        })
        .then(result => {
            // Result will contain the value of 'channelIds' in the current tab's localStorage as an array
            channelIds = result[0] || [];
            channelCountSpan.textContent = channelIds.length;
            populateChannelList();
        });
}

function upgradeChannels() {
    if (channelIds.includes(currentChannel)) {
        channelIds = channelIds.filter(channel => channel !== currentChannel);
    } else {
        channelIds.push(currentChannel);
    }

    updateChannels();

    str = JSON.stringify(channelIds);
    browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            return browser.tabs.executeScript(tabs[0].id, {
                code: `window.localStorage.setItem("channelIds", JSON.stringify(${str}));`
            });
        })
        .then(_ => {
            updateChannels();
        });
}


function getCurrentChannel() {
    browser.tabs.query({active: true, currentWindow: true})
        .then(tabs => {
            // Execute a script in the context of the current tab
            return browser.tabs.executeScript(tabs[0].id, {
                code: "findCurrentChannel()"
            });
        })
        .then(result => {
            currentChannel = result[0];
            currentChannelName.textContent = currentChannel;
            currentChannelAction.textContent = channelIds.includes(currentChannel) ? "Remove" : "Add";
        });
}

function populateChannelList() {
    channelList.innerHTML = '';


    channelIds.forEach(channel => {
        let channelElem = document.createElement('div');
        channelElem.classList.add('channel-item');

        let channelNameElem = document.createElement('span');
        channelNameElem.classList.add('channel-name');
        channelNameElem.textContent = channel;
        channelElem.appendChild(channelNameElem);

        let removeBtnElem = document.createElement('span');
        removeBtnElem.classList.add('remove-channel');
        removeBtnElem.innerHTML = '&times;';


        channelElem.appendChild(removeBtnElem);
        channelList.appendChild(channelElem);
    });
}

currentChannelAction.addEventListener("click", () => {
    upgradeChannels();
});

currentChannels.addEventListener("click", () => {
    updateChannels();
});

updateChannels();
getCurrentChannel();