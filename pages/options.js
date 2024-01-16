function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        timebeforescript: document.querySelector("#timebeforescript").value
    });
}

function restoreOptions() {
    function setCurrentChoice(result) {
        document.querySelector("#color").value = result.color || "blue";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("timebeforescript");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
