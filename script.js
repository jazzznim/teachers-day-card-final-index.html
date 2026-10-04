const $ = (selector) => document.querySelector(selector);

const book = $("#book");
const bookCover = $("#bookCover");
const openBookBtn = $("#openBook");
const closeBookBtn = $("#closeBook");
const nextPageBtn = $("#nextPage");
const prevPageBtn = $("#prevPage");
const pageIndicator = $("#pageIndicator");
const music = $("#backgroundMusic");
const musicBtn = $("#musicBtn");
const musicMiniBtn = $("#musicMiniBtn");
const customizer = $("#customizer");
const openCustomizer = $("#openCustomizer");
const closeCustomizer = $("#closeCustomizer");
const applyChanges = $("#applyChanges");
const resetCard = $("#resetCard");
const toast = $("#toast");

const teacherInput = $("#teacherInput");
const studentInput = $("#studentInput");
const titleInput = $("#titleInput");
const messageInput = $("#messageInput");
const photoInput = $("#photoInput");
const audioInput = $("#audioInput");

const DEFAULTS = {
  teacher: "Mr. Randy Bello",
  student: "Jasmin Merdegia",
  title: "Happy Teachers' Day!",
  message: "Thank you for your patience, guidance, and dedication. Your lessons inspire us to learn, grow, and become better every day. We truly appreciate everything you do! ❤️📚 God bless you and your family sir rands."
};

let currentPage = 0; // 0 = cover, 1 = open spread
let photoObjectUrl = null;
let audioObjectUrl = null;

function updateText() {
  const teacher = teacherInput.value.trim() || DEFAULTS.teacher;
  const student = studentInput.value.trim() || DEFAULTS.student;
  const title = titleInput.value.trim() || DEFAULTS.title;
  const message = messageInput.value.trim() || DEFAULTS.message;

  $("#introTeacher").textContent = teacher;
  $("#leftTeacher").textContent = teacher;
  $("#coverTeacher").textContent = teacher;
  $("#messageTitle").textContent = title;
  $("#messageText").textContent = message;
  $("#studentName").textContent = student;
  $("#coverStudent").textContent = student.toUpperCase();
}

function setPage(page) {
  currentPage = Math.max(0, Math.min(1, page));
  book.classList.toggle("open", currentPage === 1);
  pageIndicator.textContent = currentPage === 0 ? "Cover" : "Message";
  prevPageBtn.disabled = currentPage === 0;
  nextPageBtn.disabled = currentPage === 1;
  prevPageBtn.style.opacity = currentPage === 0 ? ".35" : "1";
  nextPageBtn.style.opacity = currentPage === 1 ? ".35" : "1";
}

function openCard() {
  setPage(1);
  createBurst();
}

function closeCard() {
  setPage(0);
}

bookCover.addEventListener("click", openCard);
openBookBtn.addEventListener("click", openCard);
closeBookBtn.addEventListener("click", closeCard);
nextPageBtn.addEventListener("click", openCard);
prevPageBtn.addEventListener("click", closeCard);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    customizer.classList.remove("show");
    customizer.setAttribute("aria-hidden", "true");
    closeCard();
  }
  if (event.key === "ArrowRight") openCard();
  if (event.key === "ArrowLeft") closeCard();
});

function toggleMusic() {
  if (music.paused) {
    music.play().then(() => {
      musicBtn.innerHTML = "❚❚ Pause Music";
      musicMiniBtn.textContent = "❚❚";
      showToast("Music is playing ♪");
    }).catch(() => {
      showToast("Click the music button again to start the audio.");
    });
  } else {
    music.pause();
    musicBtn.innerHTML = "♫ Play Music";
    musicMiniBtn.textContent = "♫";
  }
}

musicBtn.addEventListener("click", toggleMusic);
musicMiniBtn.addEventListener("click", toggleMusic);
music.addEventListener("ended", () => {
  musicBtn.innerHTML = "♫ Play Music";
  musicMiniBtn.textContent = "♫";
});

openCustomizer.addEventListener("click", () => {
  customizer.classList.add("show");
  customizer.setAttribute("aria-hidden", "false");
});
closeCustomizer.addEventListener("click", () => {
  customizer.classList.remove("show");
  customizer.setAttribute("aria-hidden", "true");
});
customizer.addEventListener("click", (event) => {
  if (event.target === customizer) {
    customizer.classList.remove("show");
    customizer.setAttribute("aria-hidden", "true");
  }
});

[teacherInput, studentInput, titleInput, messageInput].forEach((field) => {
  field.addEventListener("input", updateText);
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    showToast("Please choose an image file.");
    return;
  }
  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = URL.createObjectURL(file);
  $("#teacherPhoto").src = photoObjectUrl;
  $("#photoFileName").textContent = file.name;
  showToast("Photo added to your card.");
});

audioInput.addEventListener("change", () => {
  const file = audioInput.files[0];
  if (!file) return;
  if (!file.type.startsWith("audio/") && !/\.(m4a|mp3|wav|ogg|aac|webm)$/i.test(file.name)) {
    showToast("Please choose an audio file.");
    return;
  }
  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
  audioObjectUrl = URL.createObjectURL(file);
  music.pause();
  music.src = audioObjectUrl;
  music.load();
  musicBtn.innerHTML = "♫ Play Music";
  musicMiniBtn.textContent = "♫";
  $("#audioFileName").textContent = file.name;
  showToast("Audio added. Press Play Music.");
});

applyChanges.addEventListener("click", () => {
  updateText();
  customizer.classList.remove("show");
  customizer.setAttribute("aria-hidden", "true");
  showToast("Your message card is updated.");
});

resetCard.addEventListener("click", () => {
  teacherInput.value = DEFAULTS.teacher;
  studentInput.value = DEFAULTS.student;
  titleInput.value = DEFAULTS.title;
  messageInput.value = DEFAULTS.message;

  if (photoObjectUrl) URL.revokeObjectURL(photoObjectUrl);
  photoObjectUrl = null;
  $("#teacherPhoto").src = "assets/teacher-photo.jpg";
  $("#photoFileName").textContent = "Default teacher photo loaded";

  if (audioObjectUrl) URL.revokeObjectURL(audioObjectUrl);
  audioObjectUrl = null;
  music.pause();
  music.src = "assets/teachers-day-music.m4a";
  music.load();
  musicBtn.innerHTML = "♫ Play Music";
  musicMiniBtn.textContent = "♫";
  $("#audioFileName").textContent = "Default Teachers' Day music loaded";

  updateText();
  showToast("Card restored to the default message.");
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2400);
}

function createParticle() {
  const particle = document.createElement("span");
  particle.className = "particle";
  particle.textContent = Math.random() > .25 ? "♡" : "✦";
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.fontSize = `${8 + Math.random() * 12}px`;
  particle.style.animationDuration = `${6 + Math.random() * 7}s`;
  particle.style.animationDelay = `${Math.random() * 1.5}s`;
  $("#particles").appendChild(particle);
  setTimeout(() => particle.remove(), 15000);
}

setInterval(createParticle, 900);
for (let i = 0; i < 12; i++) setTimeout(createParticle, i * 170);

function createBurst() {
  const symbols = ["♥", "♡", "✦", "✧"];
  for (let i = 0; i < 22; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${35 + Math.random() * 30}%`;
    particle.style.bottom = `${25 + Math.random() * 20}%`;
    particle.style.fontSize = `${10 + Math.random() * 16}px`;
    particle.style.animationDuration = `${2.8 + Math.random() * 2.5}s`;
    $("#particles").appendChild(particle);
    setTimeout(() => particle.remove(), 6000);
  }
}

updateText();
setPage(0);
