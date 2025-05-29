document.addEventListener("DOMContentLoaded", function () {
  const breakMinute = document.getElementById("break-minute");
  const breakSecond = document.getElementById("break-second");

  let breakStartTime = localStorage.getItem("breakStartTime");
  let breakTime = localStorage.getItem("remainingBreakTime") ? parseInt(localStorage.getItem("remainingBreakTime")) : 180;

  if (breakStartTime) {
    let elapsedTime = Math.floor((Date.now() - parseInt(breakStartTime)) / 1000);
    breakTime -= elapsedTime;
    if (breakTime < 0) breakTime = 0;
  }

  function updateBreakTimer() {
    let minutes = Math.floor(breakTime / 60);
    let seconds = breakTime % 60;
    breakMinute.textContent = minutes;
    breakSecond.textContent = seconds < 10 ? "0" + seconds : seconds;
  }

  function startBreakCountdown() {
    const interval = setInterval(() => {
      if (breakTime > 0) {
        breakTime--;
        localStorage.setItem("remainingBreakTime", breakTime);
        updateBreakTimer();
      } else {
        clearInterval(interval);
        localStorage.removeItem("breakStartTime");
        localStorage.removeItem("remainingBreakTime");
        openPopup();
      }
    }, 1000);
  }
  
  
  
function openPopup() {
  // 🎵 タイマー終了時の音声を再生
const alarmSound = new Audio("audio/meow_alarm.mp3");
alarmSound.play().catch(err => console.error("音声再生失敗:", err));

  
  const timerPopup = document.getElementById("popup");  // 全ページ共通で "popup" を使う
  const popupContent = timerPopup ? timerPopup.querySelector(".popup-content") : null;

  if (!timerPopup || !popupContent) {
    console.error("Popup elements not found");
    return;
  }

  timerPopup.style.display = "flex";
  popupContent.innerHTML = `
    <p>Time's Up!</p>
    <p>Keep working hard!!</p>
    <button id="start-btn" style="
      background: #D84444;
      color: #FFDE93;
      padding: 15px 30px;
      font-size: 18px;
      border: none;
      cursor: pointer;
    ">START</button>
  `;

  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      localStorage.removeItem("breakStartTime");
      localStorage.removeItem("remainingBreakTime");
      window.location.href = "index.html";
    });
  }
}

  updateBreakTimer();
  startBreakCountdown();

  const breakBtn = document.getElementById("break-btn");
  const stretchPopup = document.getElementById("stretch-popup");
  const stretchImage = document.getElementById("stretch-image");
  const stretchClose = document.getElementById("stretch-close");
  const prevPopup = document.getElementById("prev-popup");
  const nextPopup = document.getElementById("next-popup");

  const stretchImages = [
    "images/Stretch_sit.png",
    "images/Stretch_stand.png"
  ];

  let currentIndex = 0;
  
  


  function updateStretchImage() {
    stretchImage.src = stretchImages[currentIndex];
    prevPopup.style.display = currentIndex === 0 ? "none" : "inline-block";
    nextPopup.style.display = currentIndex === stretchImages.length - 1 ? "none" : "inline-block";
  }

  breakBtn.addEventListener("click", () => {
    stretchPopup.style.display = "flex";
    updateStretchImage();
  });

  stretchClose.addEventListener("click", () => {
    stretchPopup.style.display = "none";
  });

  prevPopup.addEventListener("click", () => {
    if (currentIndex > 0) currentIndex--;
    updateStretchImage();
  });

  nextPopup.addEventListener("click", () => {
    if (currentIndex < stretchImages.length - 1) currentIndex++;
    updateStretchImage();
  });
});

const catWalk = document.getElementById("catWalk");
const stretchOnly = document.getElementById("stretchOnly");

function resetGif(gifElement, newLeft, animationName, duration) {
  gifElement.classList.add("hidden");
  gifElement.style.animation = "none";
  gifElement.offsetHeight; // ← 強制再描画
  gifElement.src = gifElement.src; // ← 再読み込み（超重要！）
  gifElement.style.left = newLeft;
  gifElement.style.animation = `${animationName} ${duration}s linear forwards`;
  gifElement.classList.remove("hidden");
}
function loopCatAnimation() {
  // 1. 左から中央へ（3秒）
  resetGif(catWalk, "-30%", "walkLeftToCenter", 3);

  // 2. Stretch_only に切り替え
  setTimeout(() => {
    catWalk.classList.add("hidden");
    stretchOnly.style.left = "35%";
    stretchOnly.classList.remove("hidden");
  }, 3100);

  // 3. 中央から右へ（3秒）
  setTimeout(() => {
    stretchOnly.classList.add("hidden");
    resetGif(catWalk, "35%", "walkCenterToRight", 3);
  }, 5100);

  // 4. 次のループ
  setTimeout(loopCatAnimation, 8300);
}

// スタート
loopCatAnimation();
