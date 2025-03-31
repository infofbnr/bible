const API_URL = "https://bible-api.com/data/web/random";

// Function to fetch a new verse
async function getVerse(forceUpdate = false) {
    const lastFetchDate = localStorage.getItem("lastFetchDate");
    const today = new Date().toISOString().split("T")[0]; // Get current date

    if (!forceUpdate && lastFetchDate === today) {
        // Load the saved verse if already fetched today
        const savedVerse = localStorage.getItem("verse");
        const savedReference = localStorage.getItem("reference");
        if (savedVerse && savedReference) {
            document.getElementById("verse").textContent = `"${savedVerse}"`;
            document.getElementById("reference").textContent = savedReference;
            return;
        }
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        const verseText = data.random_verse.text;
        const reference = `${data.random_verse.book} ${data.random_verse.chapter}:${data.random_verse.verse}`;

        // Update the UI
        document.getElementById("verse").textContent = verseText;
        document.getElementById("reference").textContent = `- ${reference}`;

        // Save to localStorage for daily retrieval
        localStorage.setItem("verse", verseText);
        localStorage.setItem("reference", `- ${reference}`);
        localStorage.setItem("lastFetchDate", today);
    } catch (error) {
        document.getElementById("verse").textContent = "Failed to load verse. Please try again.";
        document.getElementById("reference").textContent = "";
    }
}

// Load verse on page load
getVerse();
