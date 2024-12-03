// const tracks = null;
// [
//     {
//         title: "Utwór 1",
//         exportDate: "2024-12-01",
//         credits: "Artysta A, Producent B",
//         audioSrc: "https://eder.pl/eder/utwor2.mp3"
//     },
//     {
//         title: "Utwór 2",
//         exportDate: "2024-11-30",
//         credits: "Artysta C, Producent D",
//         audioSrc: "utwor2.mp3"
//     },
//     {
//         title: "Utwór 3",
//         exportDate: "2024-11-29",
//         credits: "Artysta E, Producent F",
//         audioSrc: "utwor3.mp3"
//     },
//     {
//         title: "Utwór 4",
//         exportDate: "2024-11-28",
//         credits: "Artysta G, Producent H",
//         audioSrc: "utwor4.mp3"
//     },
//     {
//         title: "Utwór 5",
//         exportDate: "2024-11-27",
//         credits: "Artysta I, Producent J",
//         audioSrc: "utwor5.mp3"
//     }
// ];

const tracksUrl = "/eder/tracks"; // Relatywny URL

async function fetchTracks() {
    try {
        const response = await fetch(tracksUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        var tracks = await response.json();
        console.log("Fetched tracks:", tracks);
        generateTrackList(tracks);
        initializeTrackList(tracks);
    } catch (error) {
        console.error("Failed to fetch tracks:", error);
    }
}

function generateTrackList(tracks) {
    const trackList = document.querySelector(".track-list");
    trackList.innerHTML = ""; // Clear existing list
    tracks.forEach((track, index) => {
        const listItem = document.createElement("li");
        listItem.className = "track-item";
        listItem.setAttribute("data-track", index + 1);
        listItem.textContent = track.title; // Dynamic title from JSON
        trackList.appendChild(listItem);
    });
}

function initializeTrackList(tracks) {
    const trackItems = document.querySelectorAll(".track-item");
    const detailsSection = document.getElementById("track-details");
    const titleElement = document.getElementById("track-title");
    const exportDateElement = document.getElementById("export-date");
    const creditsElement = document.getElementById("credits");
    const audioPlayer = document.getElementById("track-player");
    const closeDetailsButton = document.getElementById("close-details");

    trackItems.forEach((item) => {
        item.addEventListener("click", () => {
            const trackId = item.getAttribute("data-track");
            const track = tracks[trackId - 1];
            if (track) {
                titleElement.textContent = track.title;
                exportDateElement.textContent = track.exportDate;
                creditsElement.textContent = track.credits;
                audioPlayer.querySelector("source").src = track.audioSrc;
                audioPlayer.load();
                detailsSection.classList.remove("hidden");
            }
        });
    });

    closeDetailsButton.addEventListener("click", () => {
        detailsSection.classList.add("hidden");
    });
}

// Call the fetch function to load tracks dynamically
fetchTracks();