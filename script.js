const API_URL = "https://bible-api.com/data/web/random";

async function getVerse(forceUpdate = false) {
    const lastFetchDate = localStorage.getItem("lastFetchDate");
    const today = new Date().toISOString().split("T")[0];

    if (!forceUpdate && lastFetchDate === today) {
        const savedVerse = localStorage.getItem("verse");
        const savedReference = localStorage.getItem("reference");
        if (savedVerse && savedReference) {
            updateUI(savedVerse, savedReference);
            return;
        }
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const verseText = data.random_verse.text;
        const reference = `${data.random_verse.book} ${data.random_verse.chapter}:${data.random_verse.verse}`;

        updateUI(verseText, `- ${reference}`);

        localStorage.setItem("verse", verseText);
        localStorage.setItem("reference", `- ${reference}`);
        localStorage.setItem("lastFetchDate", today);

    } catch (error) {
        updateUI("Failed to load verse. Please try again.", "");
    }
}

function updateUI(text, reference) {
    document.getElementById("verse").textContent = text;
    document.getElementById("reference").textContent = reference;
}

function copyVerse() {
    const verse = document.getElementById("verse").textContent;
    const reference = document.getElementById("reference").textContent;
    const combined = `${verse} ${reference}`;
    navigator.clipboard.writeText(combined)
        .then(() => {
            const notification = document.createElement("div");
            notification.textContent = "Verse copied to clipboard!";
            notification.classList.add("fixed", "top-5", "left-1/2", "transform", "-translate-x-1/2", "bg-green-500", "text-white", "py-2", "px-4", "rounded", "shadow-lg");
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 2000);
        })
        .catch((error) => {
            console.error('Error copying text: ', error);
        });
}

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
    console.log("Dark mode toggled:", document.body.classList.contains("dark"));
}

// Load on page load
if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

getVerse();
