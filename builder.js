const contentSelect = document.getElementById("contentSelect");

const contentType = document.getElementById("contentType");
const contentName = document.getElementById("contentName");
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
// Populate content dropdown
// -----------------------------------------

content.forEach((item, index) => {

    const option = document.createElement("option");

    option.value = index;
    option.textContent = item.name;

    contentSelect.appendChild(option);

});


// -----------------------------------------
// Load content into editor
// -----------------------------------------

function loadContent(index) {

    const item = content[index];

    contentType.value = item.type;
    contentName.value = item.name;
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

    item.name = contentName.value;
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

    contentName,
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