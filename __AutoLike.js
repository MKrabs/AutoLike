// AutoLike is a browser extension that automatically likes videos on YouTube
// Author: @Mkrabs
// License: GNU General Public License v3.0
// Version: 1.0.0
// Repository: www.github.com/Mkrabs/AutoLike
// Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/autolike/


let likeButton, alreadyLiked, timerDiv, countSpan, processedVideoIds, channelIds, url, urlParams, videoId;

const prefix = "[AutoLike]";
let timebeforescript = 5000;
let timebetweenupdates = 10000;


function clickedLikeButton() {
    let count = 30;
    // noinspection CssInvalidHtmlTagReference
    likeButton = document.querySelector("#segmented-like-button ytd-toggle-button-renderer button");
    timerDiv = document.createElement("div");
    countSpan = document.createElement("span");

    // Hijack the like button hover event
    likeButton.addEventListener("mouseenter", event => {
        event.preventDefault();
        if(intervalId) {
            console.debug(`${prefix} Countdown manually stopped! %c⚠`, `color: orange;`);
            clearInterval(intervalId);
            timerDiv.remove();
        }
    });

    let intervalId = setInterval(() => {
        alreadyLiked = likeButton.attributes["aria-pressed"].value === "true";

        if (alreadyLiked) {
            clearInterval(intervalId);
            return;
        }

        timerDiv.classList.add("cbox", "yt-spec-button-shape-next--button-text-content");
        timerDiv.style.marginLeft = "8px";

        countSpan.classList.add("published-time-text", "style-scope", "ytd-comment-renderer");
        countSpan.textContent = count.toString();

        timerDiv.appendChild(countSpan);
        likeButton.appendChild(timerDiv);

        if (count === 0) {
            clearInterval(intervalId);
            likeButton.click();
            console.debug(`${prefix} Liked video!`);
        }

        count--;
    }, 1000);
}

function currentVideoAlreadyProcessed() {
    url = window.location.href;
    urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v");

    if (processedVideoIds.includes(videoId)) {
        console.debug(`${prefix} Video already processed! %c✘`, `color: red;`);
        return true;
    }

    console.debug(`${prefix} Video ${videoId} not processed yet! %c✔`, `color: green;`);
    processedVideoIds.push(videoId);
    localStorage.setItem("processedVideoIds", JSON.stringify(processedVideoIds));
    return false;
}


function findCurrentChannel() {
    let link = document.querySelector('#owner a').href;

    const channelRegex = /channel\/([\w.-]+)/i;
    const tagRegex = /@([\w.-]+)/i;
    const shortchangeRegex = /c\/([\w.-]+)/i;

    console.debug(`${prefix} Channel link: ${link}`);

    return link.match(channelRegex)?.[1] || link.match(tagRegex)?.[1] || link.match(shortchangeRegex)?.[1] || "";
}

function channelIncluded() {
    let channel = findCurrentChannel();
    if (channelIds.includes(channel)) {
        console.debug(`${prefix} Channel %c${channel} %cincluded! %c✔`, `color: blue;`, `color: inherit;`, `color: green;`);
        return channel;
    } else {
        console.debug(`${prefix} Channel %c${channel} %cnot included! %c✘`, `color: blue;`, `color: inherit;`, `color: red;`);
        return null;
    }
}


setTimeout(() => {
    let watcher = setInterval(() => {
        console.debug(`${prefix} Watching for videos to like...`);

        processedVideoIds = localStorage.getItem("processedVideoIds") ? JSON.parse(localStorage.getItem("processedVideoIds")) : [];
        channelIds = localStorage.getItem("channelIds") ? JSON.parse(localStorage.getItem("channelIds")) : [];

        if (channelIncluded() && !currentVideoAlreadyProcessed()) {
            clickedLikeButton();
        }
    }, timebetweenupdates);
}, timebeforescript);



