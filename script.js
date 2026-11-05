// CHANGE THIS to your relationship start date (YYYY-MM-DDTHH:MM:SS).
// Example: new Date("2026-09-05T00:00:00")
const relationshipStartDate = new Date("2026-09-05T00:00:00");

// Smoothly move from the welcome screen to the music section.
document.getElementById("openHeartBtn").addEventListener("click", () => {
  document.getElementById("music").scrollIntoView({ behavior: "smooth" });
  burstHearts(18);
});

// Anniversary letter: edit this message to make it more personal.
const letterMessage =
  "Happy two months! These past weeks have given me so many little reasons to smile. Thank you for your kindness, your time, and all the moments that have made these days special. I hope we keep learning about each other, making beautiful memories, and supporting one another through every new chapter. No matter how small the moment, I am grateful to share it with you. Here's to many more happy memories together. ❤️";

const envelopeButton = document.getElementById("envelopeButton");
const envelope = envelopeButton.querySelector(".envelope");
const letterPaper = document.getElementById("letterPaper");
const typedLetter = document.getElementById("typedLetter");
let letterOpened = false;

envelopeButton.addEventListener("click", () => {
  if (letterOpened) return;
  letterOpened = true;
  envelope.classList.add("open");
  letterPaper.classList.add("show");
  burstHearts(28);
  typeText(letterMessage, typedLetter, 28);
});

function typeText(text, element, speed) {
  let index = 0;
  element.textContent = "";
  function typeNext() {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
      setTimeout(typeNext, speed);
    }
  }
  typeNext();
}

// Live relationship counter.
function updateCounter() {
  const now = new Date();
  let difference = now - relationshipStartDate;
  if (Number.isNaN(relationshipStartDate.getTime()) || difference < 0) difference = 0;

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCounter();
setInterval(updateCounter, 1000);

// Random sweet messages.
const messages = [
  "You make ordinary moments feel special. ❤️",
  "I hope your day is as lovely as your smile.",
  "Two months of memories, and so many more to make.",
  "Thank you for being a bright part of my days.",
  "My favourite moments are the ones filled with laughter.",
  "Here's to more kindness, adventures, and happy memories. 💗"
];
document.getElementById("surpriseBtn").addEventListener("click", () => {
  const message = messages[Math.floor(Math.random() * messages.length)];
  const output = document.getElementById("randomMessage");
  output.textContent = message;
  output.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 350 });
  burstHearts(12);
});

// Local photo previews. Images are not uploaded to a server.
document.querySelectorAll(".photo-card input").forEach((input) => {
  input.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    const preview = document.getElementById(input.dataset.preview);
    preview.src = URL.createObjectURL(file);
    input.closest(".photo-card").classList.add("has-photo");
  });
});

// Floating hearts for a gentle animated background.
const ambientHearts = document.getElementById("ambientHearts");
function makeHeart() {
  const heart = document.createElement("span");
  heart.className = "ambient-heart";
  heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (12 + Math.random() * 20) + "px";
  heart.style.animationDuration = (7 + Math.random() * 6) + "s";
  ambientHearts.appendChild(heart);
  setTimeout(() => heart.remove(), 14000);
}
setInterval(makeHeart, 900);
function burstHearts(amount) {
  for (let i = 0; i < amount; i++) {
    setTimeout(makeHeart, i * 45);
  }
}

// Official YouTube IFrame Player API.
// Video ID comes from the supplied YouTube link.
let youtubePlayer;
let playerReady = false;
const musicToggle = document.getElementById("musicToggle");
const volumeSlider = document.getElementById("volumeSlider");
const musicStatus = document.getElementById("musicStatus");

window.onYouTubeIframeAPIReady = function () {
  youtubePlayer = new YT.Player("youtubePlayer", {
    videoId: "GLEx6bhPu7s",
    playerVars: {
      playsinline: 1,
      controls: 1,
      rel: 0
    },
    events: {
      onReady: function (event) {
        playerReady = true;
        event.target.setVolume(Number(volumeSlider.value));
      },
      onStateChange: function (event) {
        if (event.data === YT.PlayerState.PLAYING) {
          musicToggle.textContent = "❚❚ Pause song";
          musicStatus.textContent = "Now playing our special song. ❤️";
        } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
          musicToggle.textContent = "▶ Play song";
          musicStatus.textContent = "Song paused.";
        }
      }
    }
  });
};

musicToggle.addEventListener("click", () => {
  if (!playerReady) {
    musicStatus.textContent = "The YouTube player is still loading. Try again in a moment.";
    return;
  }
  const state = youtubePlayer.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
});

volumeSlider.addEventListener("input", () => {
  if (playerReady) youtubePlayer.setVolume(Number(volumeSlider.value));
});
