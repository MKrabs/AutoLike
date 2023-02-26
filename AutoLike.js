// AutoLike is a browser extension that automatically likes videos on YouTube
// Author: @Mkrabs
// License: GNU General Public License v3.0
// Version: 1.0.0
// Repository: www.github.com/Mkrabs/AutoLike
// Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/autolike/


let likeButton, alreadyLiked, timerDiv, countSpan, count, processedVideoIds, channelIds, url, urlParams, videoId;

processedVideoIds = localStorage.getItem("processedVideoIds") ? JSON.parse(localStorage.getItem("processedVideoIds")) : [];
channelIds = localStorage.getItem("channelIds") ? JSON.parse(localStorage.getItem("channelIds")) : [];


function clickedLikeButton() {
    count = 20;
    // noinspection CssInvalidHtmlTagReference
    likeButton = document.querySelector("#segmented-like-button ytd-toggle-button-renderer button");
    timerDiv = document.createElement("div");
    countSpan = document.createElement("span");

    // Hijack the like button hover event
    likeButton.addEventListener("mouseenter", event => {
        event.preventDefault();
        clearInterval(intervalId);
        timerDiv.remove();
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
        }

        count--;
    }, 1000);
}

function currentVideoAlreadyProcessed() {
    url = window.location.href;
    urlParams = new URLSearchParams(url.split("?")[1]);
    videoId = urlParams.get("v");

    if (processedVideoIds.includes(videoId)) {
        return true;
    }

    processedVideoIds.push(videoId);
    localStorage.setItem("processedVideoIds", JSON.stringify(processedVideoIds));
    return false;
}


function findCurrentChannel() {
    let link = document.querySelector('#owner a').href;

    const channelRegex = /channel\/([\w.-]+)/i;
    const tagRegex = /@([\w.-]+)/i;
    const shortchangeRegex = /c\/([\w.-]+)/i;

    return link.match(channelRegex)?.[1] || link.match(tagRegex)?.[1] || link.match(shortchangeRegex)?.[1] || "";
}

function channelIncluded() {
    let channel = findCurrentChannel();
    return channelIds.includes(channel) ? channel : null;
}


setTimeout(() => {
    const channel = channelIncluded();
    if (channel !== null && !currentVideoAlreadyProcessed()) {
        clickedLikeButton();
    }
}, 5000);



