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
        tracks = sortTracks(tracks);
        tracks = tracks.filter(track => track.audioSrc !== null);
        addIdsToTracks(tracks);
        generateTrackList(tracks);
        initializeTrackList(tracks);
    } catch (error) {
        console.error("Failed to fetch tracks:", error);
    }
}

function sortTracks(tracks) {
    // tracks schema: { "title": "Track Title", "sorting": 1, "credits": "Artist Name", "audioSrc": "/path/to/audio.mp3" }
    return tracks.sort((a, b) => {
        if (a.sorting < b.sorting) return -1;
        if (a.sorting > b.sorting) return 1;
        return 0;
    });
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
                currentTrackId = track.id
                titleElement.textContent = track.title;
                exportDateElement.textContent = track.exportDate;
                creditsElement.textContent = track.credits;
                navigator.mediaSession.metadata.title = track.title;
                audioPlayer.querySelector("source").src = track.audioSrc;
                audioPlayer.load();
                detailsSection.classList.remove("hidden");
            }
        });
    });

    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: 'W inną stronę',
          artist: 'Eder',
          album: 'Bez Oklasków',
          artwork: [
            { src: 'eder/resources/artwork-96x96.png',   sizes: '96x96',   type: 'image/png' },
            { src: 'eder/resources/artwork-128x128.png', sizes: '128x128', type: 'image/png' },
            { src: 'eder/resources/artwork-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'eder/resources/artwork-256x256.png', sizes: '256x256', type: 'image/png' },
            { src: 'eder/resources/artwork-384x384.png', sizes: '384x384', type: 'image/png' },
            { src: 'eder/resources/artwork-512x512.png', sizes: '512x512', type: 'image/png' },
          ]
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            if (currentTrackId < tracks.length) {
                nextTrackId = currentTrackId++;
                nextTrack = tracks[nextTrackId];
                navigator.mediaSession.metadata.title = nextTrack.title;
                titleElement.textContent = nextTrack.title;
                exportDateElement.textContent = nextTrack.exportDate;
                creditsElement.textContent = nextTrack.credits;
                audioPlayer.querySelector("source").src = nextTrack.audioSrc;
                audioPlayer.load();
                audioPlayer.play();
                audioPlayer.setAttribute("data-current-track", nextTrackId);
            }
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            if (currentTrackId > 0) {
                const previousTrack = tracks[currentTrackId - 1];
                navigator.mediaSession.metadata.title = previousTrack.title;
                currentTrackId--;
                titleElement.textContent = previousTrack.title;
                exportDateElement.textContent = previousTrack.exportDate;
                creditsElement.textContent = previousTrack.credits;
                audioPlayer.querySelector("source").src = previousTrack.audioSrc;
                audioPlayer.load();
                audioPlayer.play();
                audioPlayer.setAttribute("data-current-track", nextTrackId);
            }
        });
      }

    closeDetailsButton.addEventListener("click", () => {
        detailsSection.classList.add("hidden");
    });

    audioPlayer.addEventListener("ended", () => {
        // play next song
        nextTrackId = currentTrackId + 1;
        if (nextTrackId < tracks.length) {
            nextTrack = tracks[nextTrackId];
            currentTrackId = nextTrackId;
            navigator.mediaSession.metadata.title = nextTrack.title;
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