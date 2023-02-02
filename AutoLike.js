// AutoLike is a browser extension that automatically likes videos on YouTube
// Author: @Mkrabs
// License: GNU General Public License v3.0
// Version: 1.0.0
// Repository: www.github.com/Mkrabs/AutoLike
// Firefox Add-on: https://addons.mozilla.org/en-US/firefox/addon/autolike/


let likeButton, alreadyLiked, timerDiv, countSpan, count, processedVideoIds, url, urlParams, videoId;

if (localStorage.getItem("processedVideoIds")) {
    processedVideoIds = JSON.parse(localStorage.getItem("processedVideoIds"));
} else {
    processedVideoIds = [];
}


function clickeLikeButton() {
    count = 20;
    // noinspection CssInvalidHtmlTagReference
    likeButton = document.querySelector("#segmented-like-button ytd-toggle-button-renderer button");
    timerDiv = document.createElement("div");
    countSpan = document.createElement("span");

    let intervalId = setInterval(() => {
        alreadyLiked = likeButton.attributes["aria-pressed"].value === "true";

        if (alreadyLiked) {
            clearInterval(intervalId);
            return;
        }

        timerDiv.classList.add("cbox", "yt-spec-button-shape-next--button-text-content");
        timerDiv.style.marginLeft = "8px";

        countSpan.classList.add("published-time-text", "style-scope", "ytd-comment-renderer");
        countSpan.role = "text";
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


setTimeout(() => {
    if (!currentVideoAlreadyProcessed())
        clickeLikeButton();
}, 5000);


