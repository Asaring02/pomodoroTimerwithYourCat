document.addEventListener("DOMContentLoaded", function () {
    const breakMinute = document.getElementById("break-minute");
    const breakSecond = document.getElementById("break-second");

    // **Breakページから取得した残り時間を利用**
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
                localStorage.setItem("remainingBreakTime", breakTime); // 🔹 残り時間を更新
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
    
    // New Meditation Popup Logic
    const breakBtn = document.getElementById("break-btn");
    const meditationPopup = document.getElementById("meditation-popup");
    const meditationText = document.getElementById("meditation-text");
    const meditationClose = document.getElementById("meditation-close");
    const prevPopup = document.getElementById("prev-popup");
    const nextPopup = document.getElementById("next-popup");

    const meditationTips = [
        "Meditation Tip 1: Focus on your breath.",
        "Meditation Tip 2: Find a quiet place.",
        "Meditation Tip 3: Maintain a good posture.",
        "Meditation Tip 4: Observe your thoughts without judgment.",
        "Meditation Tip 5: Start with short sessions.",
        "Meditation Tip 6: Practice daily for best results."
    ];

    let currentTipIndex = 0;

  function updateMeditationText() {
    meditationText.textContent = meditationTips[currentTipIndex];
    
    // 最初のページなら「前へ」ボタンを非表示、それ以外は表示
    prevPopup.style.display = currentTipIndex === 0 ? "none" : "inline-block";

    // 最後のページなら「次へ」ボタンを非表示、それ以外は表示
    nextPopup.style.display = currentTipIndex === meditationTips.length - 1 ? "none" : "inline-block";
}


    breakBtn.addEventListener("click", function () {
        meditationPopup.style.display = "flex";
        updateMeditationText();
    });

    meditationClose.addEventListener("click", function () {
        meditationPopup.style.display = "none";
    });

    prevPopup.addEventListener("click", function () {
        if (currentTipIndex > 0) currentTipIndex--;
        updateMeditationText();
    });

    nextPopup.addEventListener("click", function () {
        if (currentTipIndex < meditationTips.length - 1) currentTipIndex++;
        updateMeditationText();
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const muteIcon = document.getElementById("mute-icon");
    const meditationAudio = document.getElementById("meditation-audio");

    let isPlaying = false;

    muteIcon.addEventListener("click", function () {
        if (isPlaying) {
            meditationAudio.pause();
            meditationAudio.currentTime = 0;
            muteIcon.src = "images/VolumeOn.png";
        } else {
            meditationAudio.play();
            muteIcon.src = "images/VolumeOff.png";
        }
        isPlaying = !isPlaying;
    });
    
    const closeBtn = document.getElementById("close-btn");
        if (closeBtn) {
            closeBtn.addEventListener("click", function () {
                window.location.href = "breakpage.html";
            });
        }
});

