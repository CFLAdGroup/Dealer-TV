const isPreview =
    new URLSearchParams(window.location.search).get("preview") === "true";

const video = document.getElementById("vehicleVideo");

const vehicleName = document.querySelector(".vehicle-name");
const tagline = document.querySelector(".tagline");
const offerLabel = document.querySelector(".offer-label");
const offer = document.querySelector(".offer");
const offerSub = document.querySelector(".offer-sub");
const finePrint = document.querySelector(".fine-print");
const headline = document.querySelector(".headline");

const featureElements = document.querySelectorAll(".feature");

let currentContent = 0;

// Load saved dealer content
const savedContent = localStorage.getItem("dealerTVContent");

if (savedContent) {
    try {
        const parsedContent = JSON.parse(savedContent);

        parsedContent.forEach((savedItem, index) => {
            if (content[index]) {
                content[index] = savedItem;
            }
        });
    } catch (error) {
        console.error("Could not load saved content:", error);
    }
}


function updateTemplate(item) {

    vehicleName.textContent = item.name;
    tagline.textContent = item.tagline;
    offerLabel.textContent = item.offerLabel;
    offer.textContent = item.offer;
    offerSub.textContent = item.offerSub;
    finePrint.textContent = item.finePrint;
    headline.textContent = item.headline;

    item.features.forEach((feature, index) => {

        if (featureElements[index]) {

            featureElements[index]
                .querySelector("strong")
                .textContent = feature[0];

            featureElements[index]
                .querySelector("small")
                .textContent = feature[1];
        }
    });
}


function playContent(index) {

    const item = content[index];

    updateTemplate(item);

    video.src = item.video;
    video.load();
    video.muted = true;

    video.play().catch(error => {
        console.error("Video playback error:", error);
    });
}


function playNextContent() {

    currentContent++;

    if (currentContent >= content.length) {
        currentContent = 0;
    }

    playContent(currentContent);
}


// PREVIEW MODE

if (isPreview) {

    window.addEventListener("message", (event) => {

        if (event.data?.type !== "dealer-tv-preview") {
            return;
        }

        const item = event.data.content;

        updateTemplate(item);

        video.src = item.video;
        video.load();
        video.muted = true;

        video.play().catch(error => {
            console.error("Preview video playback error:", error);
        });

    });

}


// NORMAL TV MODE

if (!isPreview) {

    video.addEventListener("ended", playNextContent);

    playContent(currentContent);

}