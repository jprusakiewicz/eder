const tracksUrl = "/eder/tracks";
let currentTrackId = 0; 

function addIdsToTracks(tracks) {
    tracks.forEach((track, index) => {
        track.id = index + 1;
    });
}
async function fetchTracks() {
    try {
        const response = await fetch(tracksUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        var tracks = await response.json();
        addIdsToTracks(tracks);
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

    audioPlayer.addEventListener("ended", () => {
        // play next song
        nextTrackId = currentTrackId + 1;
        if (nextTrackId < tracks.length) {
            const nextTrack = tracks[nextTrackId];
            currentTrackId = nextTrackId;
            titleElement.textContent = nextTrack.title;
            exportDateElement.textContent = nextTrack.exportDate;
            creditsElement.textContent = nextTrack.credits;
            audioPlayer.querySelector("source").src = nextTrack.audioSrc;
            audioPlayer.load();
            audioPlayer.play();
            audioPlayer.setAttribute("data-current-track", nextTrackId);
        }
    });
}

fetchTracks();