const contentSelect = document.getElementById("contentSelect");

const contentModel = document.getElementById("contentModel");
const contentYear = document.getElementById("contentYear");
const contentActive = document.getElementById("contentActive");

const headline = document.getElementById("headline");
const tagline = document.getElementById("tagline");

const offerLabel = document.getElementById("offerLabel");
const offer = document.getElementById("offer");
const offerSub = document.getElementById("offerSub");
const finePrint = document.getElementById("finePrint");

const featureFields = [
    ["feature1a", "feature1b"],
    ["feature2a", "feature2b"],
    ["feature3a", "feature3b"],
    ["feature4a", "feature4b"]
];

const preview = document.getElementById("tvPreview");


// -----------------------------------------
// Load saved content
// -----------------------------------------

const savedContent = localStorage.getItem("dealerTVContent");

if (savedContent) {
    try {
        const parsedContent = JSON.parse(savedContent);

       parsedContent.forEach((savedItem, index) => {
    if (content[index]) {
        content[index] = {
            ...content[index],
            ...savedItem
        };
    }
});
    } catch (error) {
        console.error("Could not load saved content:", error);
    }
}


// -----------------------------------------
// Get display name
// -----------------------------------------

function getDisplayName(item) {
    if (item.type === "vehicle") {
        return item.model;
    }

    if (item.type === "service") {
        return item.service;
    }

    return "UNTITLED CONTENT";
}


// -----------------------------------------
// Populate content dropdown
// -----------------------------------------

content.forEach((item, index) => {

    const option = document.createElement("option");

    option.value = index;
    option.textContent = getDisplayName(item);

    contentSelect.appendChild(option);

});


// -----------------------------------------
// Load content into editor
// -----------------------------------------

function loadContent(index) {

    const item = content[index];


    contentActive.checked = item.active !== false;

    if (item.type === "vehicle") {
        contentModel.value = item.model;
        contentYear.value = item.year;
    } else {
        contentModel.value = item.service;
        contentYear.value = "";
    }

    headline.value = item.headline;
    tagline.value = item.tagline;

    offerLabel.value = item.offerLabel;
    offer.value = item.offer;
    offerSub.value = item.offerSub;
    finePrint.value = item.finePrint;

    item.features.forEach((feature, index) => {

        document.getElementById(
            featureFields[index][0]
        ).value = feature[0];

        document.getElementById(
            featureFields[index][1]
        ).value = feature[1];

    });

}


// -----------------------------------------
// Build current editor data
// -----------------------------------------

function getEditorData() {

    const index = Number(contentSelect.value);
    const item = { ...content[index] };
    item.active = contentActive.checked;

    if (item.type === "vehicle") {
        item.year = contentYear.value;
    }

    item.headline = headline.value;
    item.tagline = tagline.value;

    item.offerLabel = offerLabel.value;
    item.offer = offer.value;
    item.offerSub = offerSub.value;
    item.finePrint = finePrint.value;

    item.features = featureFields.map(fields => [

        document.getElementById(fields[0]).value,
        document.getElementById(fields[1]).value

    ]);

    return item;

}


// -----------------------------------------
// Update preview
// -----------------------------------------

function updatePreview() {

    const item = getEditorData();

    if (!preview.contentWindow) {
        return;
    }

    preview.contentWindow.postMessage(
        {
            type: "dealer-tv-preview",
            content: item
        },
        "*"
    );

}


// -----------------------------------------
// Save current content
// -----------------------------------------

function saveCurrentContent() {

    const index = Number(contentSelect.value);
    const item = getEditorData();

    content[index] = item;

    localStorage.setItem(
        "dealerTVContent",
        JSON.stringify(content)
    );

    contentSelect.options[index].textContent =
        getDisplayName(item);

    alert("Changes saved.");

}


// -----------------------------------------
// Reset saved content
// -----------------------------------------

function resetContent() {

    localStorage.removeItem("dealerTVContent");

    location.reload();

}


// -----------------------------------------
// Save button
// -----------------------------------------

document.getElementById("saveButton").addEventListener("click", () => {

    saveCurrentContent();

});


// -----------------------------------------
// Reset button
// -----------------------------------------

document.getElementById("resetButton").addEventListener("click", () => {

    resetContent();

});


// -----------------------------------------
// Content selection
// -----------------------------------------

contentSelect.addEventListener("change", () => {

    loadContent(Number(contentSelect.value));
    updatePreview();

});


// -----------------------------------------
// Live editing
// -----------------------------------------

const editableFields = [

    contentYear,
    contentActive,
    headline,
    tagline,
    offerLabel,
    offer,
    offerSub,
    finePrint

];

featureFields.forEach(fields => {

    fields.forEach(id => {

        editableFields.push(
            document.getElementById(id)
        );

    });

});


editableFields.forEach(field => {

    field.addEventListener("input", updatePreview);

});


// -----------------------------------------
// Preview ready
// -----------------------------------------

preview.addEventListener("load", () => {

    loadContent(0);
    updatePreview();

});