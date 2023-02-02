setTimeout(() => {
    const likeButton = document.querySelector("#segmented-like-button ytd-toggle-button-renderer button");
    let count = 20;
    let timerDiv = document.createElement("div");
    let countSpan = document.createElement("span");

    const intervalId = setInterval(() => {
        let alreadyLiked = likeButton.attributes["aria-pressed"].value;
        if (alreadyLiked === "true")
            clearInterval(intervalId);


        timerDiv.classList.add("cbox", "yt-spec-button-shape-next--button-text-content");
        timerDiv.style.marginLeft = "8px";

        countSpan.classList.add("yt-core-attributed-string", "yt-core-attributed-string--white-space-no-wrap");
        countSpan.role = "text";
        countSpan.textContent = count.toString();

        timerDiv.appendChild(countSpan);
        likeButton.appendChild(timerDiv);

        count--;

        if (count === 0) {
            clearInterval(intervalId);
            likeButton.click();
        }
    }, 1000);
}, 5000);
