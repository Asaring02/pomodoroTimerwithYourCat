// 🛍️ ミニポップアップ関連のグローバル変数
let currentCategory = "food"; // For "Your Items" popup
let selectedItem = null; // For store purchase and item interaction
let selectedCategory = ""; // For store purchase context
let selectedQuantity = 1; // For store purchase quantity

// 💖 Friendship System Variables
let friendship = parseInt(localStorage.getItem("friendship")) || 0;
let friendshipLevel = parseInt(localStorage.getItem("friendshipLevel")) || 1;
const MAX_FRIENDSHIP = 100; // Points needed to level up
const MAX_FRIENDSHIP_LEVEL_CAP = 100; // Absolute maximum level

// 🏆 Level Rewards Definition
const levelRewards = {
    10: 100,
    20: 50,
    30: 100,
    40: 100,
    50: 50,
    60: 100,
    70: 50,
    80: 100,
    90: 100,
};

// 🏪 Store Items Definition
const storeItems = {
    food: [
        { name: "Wet Food", img: "images/wetfood_.png", price: 10, unlockLevel: 0 },
        { name: "Dry Food", img: "images/dryfood_.png", price: 10, unlockLevel: 0 },
        { name: "Lickable Treat", img: "images/lickabletreat.png", price: 20, category: "food", unlockLevel: 20 }
    ],
    toy: [
        { name: "Ball", img: "images/ball.png", price: 30, unlockLevel: 0 },
        { name: "Toy Mouse", img: "images/toymouse_.png", price: 40, unlockLevel: 0 },
        { name: "Bristlegrass", img: "images/bristlegrass.png", price: 30, category: "toy", unlockLevel: 50 }
    ],
    supplies: [
        { name: "Cat Litter", img: "images/catlitter_.png", price: 20, unlockLevel: 0 },
        { name: "Scratching Pad", img: "images/scratchingpad_.png", price: 20, unlockLevel: 0 },
        { name: "Brush", img: "images/brush.png", price: 50, category: "supplies", unlockLevel: 70 }
    ]
    // Clothes category removed
};

// --- 所持アイテムの読み込み（保存があれば復元、なければ初期値） ---
let userItems;
const storedUserItems = localStorage.getItem("userItems");

if (storedUserItems) {
    userItems = JSON.parse(storedUserItems);
    // Remove clothes category from loaded data if it exists from old save
    if (userItems.hasOwnProperty("clothes")) {
        delete userItems.clothes;
        localStorage.setItem("userItems", JSON.stringify(userItems)); // Re-save without clothes
    }

   let itemsUpdated = false;
for (const categoryKey in userItems) {
    if (userItems.hasOwnProperty(categoryKey) && Array.isArray(userItems[categoryKey])) {
        for (let i = 0; i < userItems[categoryKey].length; i++) {
            const item = userItems[categoryKey][i];

            if (typeof item.price !== 'number' || item.price <= 0 || typeof item.unlockLevel === 'undefined') {
                const storeCategoryData = storeItems[item.category]; 
                if (storeCategoryData) {
                    const storeItemDef = storeCategoryData.find(si => si.name === item.name);
                    if (storeItemDef) {
                        if (typeof item.price !== 'number' || item.price <= 0) {
                            item.price = storeItemDef.price || 1;
                            itemsUpdated = true;
                        }
                        if (typeof item.unlockLevel === 'undefined') {
                            item.unlockLevel = storeItemDef.unlockLevel || 0;
                            itemsUpdated = true;
                        }
                    } else {
                        item.price = item.price || 1; 
                        item.unlockLevel = item.unlockLevel || 0;
                    }
                } else {
                    item.price = item.price || 1; 
                    item.unlockLevel = item.unlockLevel || 0;
                }
            }
        }
    }
}

    if (itemsUpdated) {
        localStorage.setItem("userItems", JSON.stringify(userItems));
    }
} else {
    userItems = {
        food: [
            { name: "Dry Food", img: "images/dryfood_.png", count: 3, category: "food", price: storeItems.food.find(i=>i.name==="Dry Food")?.price || 10, unlockLevel: 0 },
            { name: "Wet Food", img: "images/wetfood_.png", count: 1, category: "food", price: storeItems.food.find(i=>i.name==="Wet Food")?.price || 10, unlockLevel: 0 }
        ],
        toy: [
            { name: "Toy Mouse", img: "images/toymouse_.png", count: 2, category: "toy", price: storeItems.toy.find(i=>i.name==="Toy Mouse")?.price || 40, unlockLevel: 0 },
            { name: "Ball", img: "images/ball.png", count: 1, category: "toy", price: storeItems.toy.find(i=>i.name==="Ball")?.price || 30, unlockLevel: 0 }
        ],
        supplies: [
            { name: "Cat Litter", img: "images/catlitter_.png", count: 1, category: "supplies", price: storeItems.supplies.find(i=>i.name==="Cat Litter")?.price || 20, unlockLevel: 0 },
            { name: "Scratching Pad", img: "images/scratchingpad_.png", count: 1, category: "supplies", price: storeItems.supplies.find(i=>i.name==="Scratching Pad")?.price || 20, unlockLevel: 0 }
        ]
        // Clothes category removed from initial items
    };
    localStorage.setItem("userItems", JSON.stringify(userItems));
}

// 💰 Coin System Variables
window.userCoins = localStorage.getItem("userCoins") ? parseInt(localStorage.getItem("userCoins")) : 100;
window.coinCount = document.getElementById("coin-count");

// --- DOM Elements for Reward Popup ---
let levelRewardPopup, levelRewardTitle, levelRewardMessage, levelRewardCoinsText, levelRewardCoinsAmount, levelRewardOkBtn, levelRewardCloseBtn;


// Function to update the friendship UI
function updateFriendshipUI() {
  const bar = document.getElementById("friendship-bar");
  const levelLabel = document.getElementById("friendship-level");
  if (!bar || !levelLabel) {
    console.error("❌ Friendship UI elements not found!");
    return;
  }
  bar.value = friendship;
  bar.max = MAX_FRIENDSHIP;
  levelLabel.textContent = `Level: ${friendshipLevel}`;
}

// Function to show the custom level reward popup
function showLevelRewardPopup(title, message, coins) {
    if (!levelRewardPopup) { // Ensure popup elements are initialized
        console.error("Level reward popup elements not initialized before showing.");
        // Fallback to alert if popup isn't ready
        let alertMessage = `${title}\n${message}`;
        if (coins > 0) {
            alertMessage += `\nYou received ${coins} coins!`;
        }
        alert(alertMessage);
        return;
    }

    levelRewardTitle.textContent = title;
    levelRewardMessage.textContent = message;
    if (coins > 0) {
        levelRewardCoinsAmount.textContent = coins;
        levelRewardCoinsText.style.display = 'block'; // Show coin text
    } else {
        levelRewardCoinsText.style.display = 'none'; // Hide coin text if no coins
    }
    levelRewardPopup.style.display = 'flex';
}

// Function to check and grant level rewards
function checkAndGrantLevelReward(levelReached) {
    // ✅ Level 100判定を最初にやる（報酬とリセット処理を優先）
    if (levelReached >= MAX_FRIENDSHIP_LEVEL_CAP) {
        friendshipLevel = 1;
        friendship = 0;
        localStorage.setItem("friendship", friendship);
        localStorage.setItem("friendshipLevel", friendshipLevel);
        
         updateFriendshipUI();

        // 遅延してポップアップ表示
        setTimeout(() => {
            showLevel100Popup();
        }, 500);

        return true; // 🚫 他の報酬処理は実行しない
    }

    // ✅ 通常の報酬処理（Level 10, 20, ...）
    if (levelRewards.hasOwnProperty(levelReached)) {
        const rewardCoins = levelRewards[levelReached];
        window.userCoins += rewardCoins;
        if (window.coinCount) window.coinCount.textContent = window.userCoins;
        localStorage.setItem("userCoins", window.userCoins);

        showLevelRewardPopup(
            `Level ${levelReached} Reached!`,
            `Congratulations! You've reached Level ${levelReached}.`,
            rewardCoins
        );
        
        updateFriendshipUI();
        return true;
    }

    return false;
}


    

// Function to increase friendship and handle leveling up
function increaseFriendship(amount) {
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    console.error("❌ Invalid or non-positive amount passed to increaseFriendship:", amount);
    return;
  }

  // ✅ Level 100に達していたら、ゲージをリセットして処理を終える
  if (friendshipLevel >= MAX_FRIENDSHIP_LEVEL_CAP) {
    friendship = 0;
    localStorage.setItem("friendship", friendship);
    localStorage.setItem("friendshipLevel", friendshipLevel);
    updateFriendshipUI();
    return;
  }

  friendship += amount;

  let resetOccurredThisCall = false;
  while (friendship >= MAX_FRIENDSHIP && friendshipLevel < MAX_FRIENDSHIP_LEVEL_CAP && !resetOccurredThisCall) {
    friendship -= MAX_FRIENDSHIP;
    friendshipLevel++;
    
    resetOccurredThisCall = checkAndGrantLevelReward(friendshipLevel);
    if (resetOccurredThisCall) break; 
  }

  if (friendshipLevel >= MAX_FRIENDSHIP_LEVEL_CAP && !resetOccurredThisCall) {
    resetOccurredThisCall = checkAndGrantLevelReward(friendshipLevel); 
  }

  if (!resetOccurredThisCall && friendshipLevel >= MAX_FRIENDSHIP_LEVEL_CAP) {
    friendshipLevel = MAX_FRIENDSHIP_LEVEL_CAP;
    friendship = 0; // ✅ 最終確認として再リセット
  }

  localStorage.setItem("friendship", friendship);
  localStorage.setItem("friendshipLevel", friendshipLevel);
  updateFriendshipUI();
}


function playCatInteractionAnimation(gifId, pngId, gifAnimClass, onComplete) {
    const sit = document.getElementById("cat-sit");
    const gif = document.getElementById(gifId);
    const png = document.getElementById(pngId);

    const audioMap = {
        "gif-dryfood": "audio/Dryfood_sound.m4a",
        "gif-wetfood": "audio/Wetfood_sound.m4a",
        "gif-lickabletreat": "audio/Lickabletreat_sound.mp3",
        "gif-toymouse": "audio/Mouse_sound.mp3",
        "gif-ball": "audio/Ball_sound.mp3",
        "gif-bristlegrass": "audio/Mouse_sound.mp3",
        "gif-catlitter": "audio/Litter_sound.m4a",
        "gif-scratchingpad": "audio/Scratching_sound.m4a",
        "gif-brush": "audio/Brush_sound.m4a"
    };

    const keepSitVisible = (
        gifId === "gif-toymouse" ||
        gifId === "gif-ball" ||
        gifId === "gif-bristlegrass"
    );

    let gifDuration = 2500;
    if (gifId === "gif-toymouse") gifDuration = 500;
    else if (gifId === "gif-ball") gifDuration = 500;
    else if (gifId === "gif-bristlegrass") gifDuration = 1000;
    else if (gifId === "gif-scratchingpad") gifDuration = 1500;
    else if (gifId === "gif-lickabletreat") gifDuration = 1500;
    else if (gifId === "gif-catlitter") gifDuration = 2000;

    if (!keepSitVisible) sit.style.display = "none";

    const originalSrc = gif.src;
        gif.src = "";
        void gif.offsetHeight; // ← JSHint対策あり
        gif.src = originalSrc;
    
    gif.style.display = "block";
    gif.className = "cat-anim";
    if (gifAnimClass) gif.classList.add(gifAnimClass);
    if (gifId === "gif-catlitter") gif.classList.add("flip-horizontal");

    setTimeout(() => {
        gif.style.display = "none";
        gif.classList.remove(gifAnimClass);

        // ✅ PNG表示と同時に音を再生
        const audioSrc = audioMap[gifId];
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play().catch(err => console.error("音声再生失敗:", err));
        }

        png.style.display = "block";
        png.style.animation = "popupEat 0.6s ease-out forwards";

        setTimeout(() => {
            png.style.display = "none";
            png.style.animation = "none";
            if (!keepSitVisible) sit.style.display = "block";
            if (onComplete) onComplete();
        }, 3000);
    }, gifDuration);
}

// --- Level 100 Story Popup Setup ---
let currentPage = 0;
const level100Pages = [
  {text: "🎉 Congrats! You've reached Level 100!" },
  {text: "Your cat brought a partner and a kitten. They want you to help raise their child." },
  {img: "images/cat_family.png"},
  {text: "🐾 A new journey begins... Let's keep going!" }
];

function updateLevel100Popup() {
  const page = level100Pages[currentPage];
  const level100Img = document.getElementById("level100-img");
  const level100Text = document.getElementById("level100-text");
  const level100Prev = document.getElementById("level100-prev");
  const level100Next = document.getElementById("level100-next");

  if (!level100Img || !level100Text || !level100Prev || !level100Next) return;

  if (page.img) {
    level100Img.src = page.img;
    level100Img.style.display = "block";
  } else {
    level100Img.style.display = "none";
  }

  level100Text.textContent = page.text || "";
  level100Prev.style.display = currentPage === 0 ? "none" : "inline-block";
  level100Next.style.display = currentPage === level100Pages.length - 1 ? "none" : "inline-block";
}

function showLevel100Popup() {
  const level100Popup = document.getElementById("level-100-popup");
  if (!level100Popup) return;
  currentPage = 0;
  updateLevel100Popup();
  level100Popup.style.display = "flex";
}

document.addEventListener("DOMContentLoaded", function () {
  // ...他の初期化コード...

  const level100Prev = document.getElementById("level100-prev");
  const level100Next = document.getElementById("level100-next");
  const closeMultiPopup = document.querySelector(".close-multi-popup");

  if (level100Prev && level100Next) {
    level100Prev.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage--;
        updateLevel100Popup();
      }
    });
    level100Next.addEventListener("click", () => {
      if (currentPage < level100Pages.length - 1) {
        currentPage++;
        updateLevel100Popup();
      }
    });
  }

  if (closeMultiPopup) {
    closeMultiPopup.addEventListener("click", () => {
      const level100Popup = document.getElementById("level-100-popup");
      if (level100Popup) level100Popup.style.display = "none";
    });
  }

  // ...他の初期化コード...
});





    // --- Initialize Reward Popup Elements ---
    levelRewardPopup = document.getElementById('level-reward-popup');
    levelRewardTitle = document.getElementById('level-reward-title');
    levelRewardMessage = document.getElementById('level-reward-message');
    levelRewardCoinsText = document.getElementById('level-reward-coins-text');
    levelRewardCoinsAmount = document.getElementById('level-reward-coins-amount');
    levelRewardOkBtn = document.getElementById('level-reward-ok-btn');
    levelRewardCloseBtn = levelRewardPopup ? levelRewardPopup.querySelector('.level-reward-popup-close-btn') : null;

    if (levelRewardOkBtn) {
        levelRewardOkBtn.addEventListener('click', () => {
            if (levelRewardPopup) levelRewardPopup.style.display = 'none';
        });
    }
    if (levelRewardCloseBtn) {
        levelRewardCloseBtn.addEventListener('click', () => {
            if (levelRewardPopup) levelRewardPopup.style.display = 'none';
        });
    }
    // --- End Reward Popup Init ---

    const breakMinute = document.getElementById("break-minute");
    const breakSecond = document.getElementById("break-second");

    if (window.coinCount) {
        window.coinCount.textContent = window.userCoins;
    } else {
        console.error("Coin count display element not found on DOMContentLoaded");
    }
    updateFriendshipUI();

    const timerPopup = document.getElementById("popupTimer");
    const popupContent = timerPopup ? timerPopup.querySelector(".popupTimer-content") : null;
    
    let pomodoroCount = localStorage.getItem("pomodoroCount") ? parseInt(localStorage.getItem("pomodoroCount")) : 0;
    let totalBreakTime = (pomodoroCount % 4 === 0) ? 500 : 3; 

    let breakStartTime = localStorage.getItem("breakStartTime");
    let breakTime = localStorage.getItem("remainingBreakTime") ? parseInt(localStorage.getItem("remainingBreakTime")) : totalBreakTime;

    if (!breakStartTime || breakTime <= 0) {
        breakTime = totalBreakTime;
        localStorage.setItem("remainingBreakTime", breakTime);
        if (breakStartTime && breakTime <=0) { 
             localStorage.removeItem("breakStartTime"); 
        }
    }

    function updateBreakTimer() {
        const currentRemainingTime = (typeof breakTime === 'number') ? breakTime : 0;
        let minutes = Math.floor(currentRemainingTime / 60);
        let seconds = currentRemainingTime % 60;
        if (breakMinute) breakMinute.textContent = minutes;
        if (breakSecond) breakSecond.textContent = seconds < 10 ? "0" + seconds : seconds;
    }

    let interval;
    function startBreakCountdown() {
        if (interval) { clearInterval(interval); interval = null; } 
        interval = setInterval(() => {
            if (breakTime > 0) {
                breakTime--;
                localStorage.setItem("remainingBreakTime", breakTime); 
                updateBreakTimer();
            } else {
                clearInterval(interval);
                interval = null;
                localStorage.removeItem("breakStartTime"); 
                localStorage.removeItem("remainingBreakTime"); 
                if (popupContent && (!timerPopup || timerPopup.style.display !== 'flex')) {
                    openPopup();
                } else if (!popupContent) { console.error("Timer popup content not found when timer ended.");}
            }
        }, 1000);
    }

    function openPopup() {
        // 🎵 タイマー終了時の音声を再生
const alarmSound = new Audio("audio/meow_alarm.mp3");
alarmSound.play().catch(err => console.error("音声再生失敗:", err));

        if (!timerPopup || !popupContent) { console.error("Timer popup elements not found for openPopup"); return; }
        localStorage.removeItem("breakStartTime");
        localStorage.removeItem("remainingBreakTime");

        timerPopup.style.display = "flex";
        popupContent.innerHTML = `<p>Time's Up!</p><p>Keep working hard!!</p><button id="start-btn" style="background:#D84444;color:#FFDE93;padding:15px 30px;font-size:18px;border:none;cursor:pointer;">START</button>`;
        const startBtn = document.getElementById("start-btn");
        if (startBtn) { 
            startBtn.addEventListener("click", () => { 
                localStorage.removeItem("breakStartTime"); 
                localStorage.removeItem("remainingBreakTime");
                window.location.href = "index.html"; 
            }); 
        }
    }

    updateBreakTimer(); 
    if (breakTime > 0) {
        startBreakCountdown();
    } else { 
        openPopup(); 
    }
    
    const meditationButton = document.querySelector(".break-btn:nth-of-type(1)");
    const stretchButton = document.querySelector(".break-btn:nth-of-type(2)");

    if (meditationButton) { 
        meditationButton.addEventListener("click", () => { 
            localStorage.setItem("breakStartTime", Date.now()); 
            localStorage.setItem("remainingBreakTime", breakTime);
            window.location.href = "meditation.html"; 
        }); 
    } else { console.error("Meditation button not found"); }

    if (stretchButton) { 
        stretchButton.addEventListener("click", () => { 
            localStorage.setItem("breakStartTime", Date.now()); 
            localStorage.setItem("remainingBreakTime", breakTime);
            window.location.href = "stretch.html"; 
        }); 
    } else { console.error("Stretch button not found"); }

    const itemPurchasePopup = document.getElementById("itemPurchasePopup");
    const miniPopupItemName = document.getElementById("mini-popup-item-name");
    const miniPopupItemImg = document.getElementById("mini-popup-item-img");
    const purchaseQuantityDisplay = document.getElementById("purchase-quantity");
    const miniPopupTotalPrice = document.getElementById("mini-popup-total-price");
    const increaseBtn = document.getElementById("increase-btn");
    const decreaseBtn = document.getElementById("decrease-btn");
    const closeMiniPopupBtn = document.querySelector(".close-mini-popup");
    const confirmPurchaseBtn = document.getElementById("confirm-purchase-btn");

    function showMiniPopup(item, categoryFromStore) {
        if (item.unlockLevel && friendshipLevel < item.unlockLevel) {
            alert(`This item is locked. It unlocks at Friendship Level ${item.unlockLevel}.`);
            return;
        }
        selectedItem = { ...item }; selectedCategory = categoryFromStore; selectedQuantity = 1;
        if (miniPopupItemName) miniPopupItemName.textContent = item.name;
        if (miniPopupItemImg) miniPopupItemImg.src = item.img;
        updateMiniPopupPrice();
        if (itemPurchasePopup) itemPurchasePopup.style.display = "flex";
    }
    function updateMiniPopupPrice() {
        if (purchaseQuantityDisplay) purchaseQuantityDisplay.textContent = selectedQuantity;
        if (miniPopupTotalPrice && selectedItem && typeof selectedItem.price !== 'undefined') {
            miniPopupTotalPrice.textContent = `Total: ${selectedItem.price * selectedQuantity}💰`;
        }
    }
    if (increaseBtn) increaseBtn.addEventListener("click", () => { selectedQuantity++; updateMiniPopupPrice(); });
    if (decreaseBtn) decreaseBtn.addEventListener("click", () => { if (selectedQuantity > 1) { selectedQuantity--; updateMiniPopupPrice(); } });
    if (closeMiniPopupBtn) closeMiniPopupBtn.addEventListener("click", () => { if (itemPurchasePopup) itemPurchasePopup.style.display = "none"; });
    function closeMiniPopup() { if (itemPurchasePopup) itemPurchasePopup.style.display = "none"; }

    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener("click", () => {
            if (!selectedItem || typeof selectedItem.price === 'undefined') { alert("Error: No item selected or item has no price."); return; }
            if (selectedItem.unlockLevel && friendshipLevel < selectedItem.unlockLevel) {
                 alert(`Cannot purchase. This item unlocks at Friendship Level ${selectedItem.unlockLevel}.`);
                 closeMiniPopup();
                 return;
            }
            const totalPrice = selectedItem.price * selectedQuantity;
            if (isNaN(totalPrice) || totalPrice <= 0) { alert("This item has an invalid price!"); return; }
            if (window.userCoins >= totalPrice) {
                window.userCoins -= totalPrice;
                if (window.coinCount) window.coinCount.textContent = window.userCoins;
                localStorage.setItem("userCoins", window.userCoins);
                const targetCategoryKey = selectedCategory;
                const targetList = userItems[targetCategoryKey];
                if (!targetList) { console.error(`User items category '${targetCategoryKey}' does not exist!`); alert("Error. Category not found."); closeMiniPopup(); return; }
                const existingItem = targetList.find(i => i.name === selectedItem.name);
                if (existingItem) {
                    existingItem.count += selectedQuantity;
                    existingItem.price = selectedItem.price; 
                } else {
                    targetList.push({ 
                        name: selectedItem.name, 
                        img: selectedItem.img, 
                        count: selectedQuantity, 
                        category: targetCategoryKey, 
                        price: selectedItem.price,
                        unlockLevel: selectedItem.unlockLevel 
                    });
                }
                localStorage.setItem("userItems", JSON.stringify(userItems));
                closeMiniPopup();
                updateItemsList(currentCategory); 
            } else { alert("You don't have enough money to buy this!"); }
        });
    }

    const popupItems = document.getElementById("popupItems");
    const itemsList = document.getElementById("items-list");
    const itemsBtn = document.querySelector(".items-btn");
    const closePopupItemsBtn = document.querySelector(".close-items-btn");
    const itemsTabButtons = document.querySelectorAll("#popupItems .tab-btn"); 

 function handleItemClick(itemObject, itemCategory) {
    if (!popupItems) return;

    if (itemObject.count <= 0) {
        alert("No more of this item left!");
        return;
    }

    itemObject.count -= 1;
    localStorage.setItem("userItems", JSON.stringify(userItems));

    if (typeof itemObject.price === 'number' && itemObject.price > 0) {
        increaseFriendship(itemObject.price);
    } else {
        increaseFriendship(1);
    }

     let gifId = null;
     let pngId = null;
     let gifAnimClass = null;

     switch (itemObject.name) {
         case "Dry Food":
             gifId = "gif-dryfood";
             pngId = "Dry_cat";
             gifAnimClass = "walkTopRight";
             break;
         case "Wet Food":
             gifId = "gif-wetfood";
             pngId = "cat-eat";
             gifAnimClass = "walkTopRight";
             break;
         case "Cat Litter":
             gifId = "gif-catlitter";
             pngId = "Litter_cat";
             gifAnimClass = "walkBottomLeft";
             break;
         case "Lickable Treat":
             gifId = "gif-lickabletreat";
             pngId = "Lickabletreat_cat";
             gifAnimClass = "walkDownCenter";
             break;
         case "Scratching Pad":
             gifId = "gif-scratchingpad";
             pngId = "Scratchingpad_cat";
             gifAnimClass = "walkDownCenter";
             break;
         case "Brush":
             gifId = "gif-brush";
             pngId = "Brush_cat";
             gifAnimClass = "walkRightDown";
             break;
         case "Toy Mouse":
            gifId = "gif-toymouse";
            pngId = "Mouse_cat";
            gifAnimClass = "stayBottom";
            break;
        case "Ball":
            gifId = "gif-ball";
            pngId = "Ball_cat";
            gifAnimClass = "stayBottom";
            break;
        case "Bristlegrass":
            gifId = "gif-bristlegrass";
            pngId = "Bristlegrass_cat";
            gifAnimClass = "stayBottom";
            break;
    default:
        alert(`The cat interacts with ${itemObject.name}! 🐱`);
        updateItemsList(itemCategory);
        return;
     }

   

    closeItemsPopup();
    playCatInteractionAnimation(gifId, pngId, gifAnimClass, () => {
    updateItemsList(itemCategory);
    });
}

    
    function closeItemsPopup() { if (popupItems) { popupItems.style.display = "none"; } }

    function updateItemsList(categoryToDisplay) {
        if (!itemsList) { console.error("itemsList element not found"); return; }
        itemsList.innerHTML = "";
        let itemsInCategory = userItems[categoryToDisplay] || [];
        if (itemsInCategory.length === 0) { itemsList.innerHTML = "<p>No items in this category yet...</p>"; }
        else {
            itemsInCategory.forEach(item => {
                let itemCard = document.createElement("div"); itemCard.classList.add("item-card", item.category);
                let itemName = document.createElement("span"); itemName.textContent = item.name; itemName.classList.add("item-name");
                let itemImg = document.createElement("img"); itemImg.src = item.img; itemImg.alt = item.name;
                let itemCount = document.createElement("span"); itemCount.textContent = `x${item.count}`; itemCount.classList.add("item-count");
                itemCard.appendChild(itemName); itemCard.appendChild(itemImg); itemCard.appendChild(itemCount);
                itemCard.addEventListener("click", () => { handleItemClick(item, categoryToDisplay); });
                itemsList.appendChild(itemCard);
            });
        }
    }

    if (itemsBtn) {
        itemsBtn.addEventListener("click", () => {
            let activeTab = document.querySelector("#popupItems .tab-btn.active[data-category]");
            if (!activeTab || activeTab.dataset.category === "clothes") { 
                 const foodTab = document.querySelector("#popupItems .tab-btn[data-category='food']");
                 if (foodTab) {
                     itemsTabButtons.forEach(btn => btn.classList.remove("active"));
                     foodTab.classList.add("active");
                     currentCategory = "food";
                 } else if (itemsTabButtons.length > 0) { 
                     itemsTabButtons.forEach(btn => btn.classList.remove("active"));
                     itemsTabButtons[0].classList.add("active");
                     currentCategory = itemsTabButtons[0].dataset.category;
                 } else {
                     currentCategory = "food"; 
                 }
            } else {
                currentCategory = activeTab.dataset.category;
            }
            updateItemsList(currentCategory);
            if (popupItems) popupItems.style.display = "flex";
        });
    }
    if (closePopupItemsBtn) closePopupItemsBtn.addEventListener("click", closeItemsPopup);
    if (popupItems) window.addEventListener("click", (event) => { if (event.target === popupItems) { closeItemsPopup(); } });
    
    const currentItemTabs = document.querySelectorAll("#popupItems .tab-btn[data-category]"); 
    currentItemTabs.forEach(button => {
        button.addEventListener("click", function () {
            currentItemTabs.forEach(btn => btn.classList.remove("active")); this.classList.add("active");
            currentCategory = this.dataset.category; updateItemsList(currentCategory);
        });
    });

    const storeBtnDOM = document.getElementById("store-btn"); 
    const popupStoreDOM = document.getElementById("popupStore");
    const closeStoreBtnDOM = document.querySelector(".close-store-btn");
    const storeItemsListDOM = document.getElementById("store-items-list");
    const storeTabButtonsDOM = document.querySelectorAll("#popupStore .tab-btn"); 
    let currentStoreCategory = "food";

    function updateStoreList(category) {
        if (!storeItemsListDOM) { console.error("storeItemsListDOM element not found"); return; }
        storeItemsListDOM.innerHTML = "";
        const itemsToDisplay = storeItems[category] || []; 
        if (itemsToDisplay.length === 0) { storeItemsListDOM.innerHTML = "<p>No items available in this category.</p>"; return; }
        
        itemsToDisplay.forEach(item => {
            const card = document.createElement("div");
            card.className = "item-card";
    
            const nameDisplay = document.createElement("span");
            nameDisplay.className = "item-name";
            nameDisplay.textContent = item.name;
    
            const img = document.createElement("img");
            img.src = item.img;
            img.alt = item.name;
    
            const priceDisplay = document.createElement("span");
            priceDisplay.className = "item-count"; 
            priceDisplay.textContent = `${item.price}💰`;
    
            card.appendChild(nameDisplay);
            card.appendChild(img);
            card.appendChild(priceDisplay);

            if (item.unlockLevel && friendshipLevel < item.unlockLevel) {
                card.classList.add("locked");
                const unlockInfo = document.createElement("span");
                unlockInfo.className = "unlock-info";
                unlockInfo.textContent = `Unlocks at Lv. ${item.unlockLevel}`;
                card.appendChild(unlockInfo);
                card.addEventListener("click", (e) => {
                    e.stopPropagation(); 
                    alert(`This item is locked. It unlocks at Friendship Level ${item.unlockLevel}.`);
                });
            } else {
                card.addEventListener("click", () => {
                    showMiniPopup(item, category); 
                });
            }
            storeItemsListDOM.appendChild(card);
        });
    }

    if (storeBtnDOM) {
        storeBtnDOM.addEventListener("click", () => {
            let activeStoreTab = document.querySelector("#popupStore .tab-btn.active[data-store-category]");
             if (!activeStoreTab || activeStoreTab.dataset.storeCategory === "clothes") { 
                 const foodStoreTab = document.querySelector("#popupStore .tab-btn[data-store-category='food']");
                 if (foodStoreTab) {
                     storeTabButtonsDOM.forEach(btn => btn.classList.remove("active"));
                     foodStoreTab.classList.add("active");
                     currentStoreCategory = "food";
                 } else if (storeTabButtonsDOM.length > 0) { 
                     storeTabButtonsDOM.forEach(btn => btn.classList.remove("active"));
                     storeTabButtonsDOM[0].classList.add("active");
                     currentStoreCategory = storeTabButtonsDOM[0].dataset.storeCategory;
                 } else {
                      currentStoreCategory = "food"; 
                 }
            } else {
                currentStoreCategory = activeStoreTab.dataset.storeCategory;
            }
            updateStoreList(currentStoreCategory); 
            if (popupStoreDOM) popupStoreDOM.style.display = "flex";
        });
    }
    if (closeStoreBtnDOM) closeStoreBtnDOM.addEventListener("click", () => { if (popupStoreDOM) popupStoreDOM.style.display = "none"; });
    if (popupStoreDOM) window.addEventListener("click", (e) => { if (e.target === popupStoreDOM) { popupStoreDOM.style.display = "none"; } });
    
    const currentStoreTabs = document.querySelectorAll("#popupStore .tab-btn[data-store-category]"); 
    currentStoreTabs.forEach(button => {
        button.addEventListener("click", function () {
            currentStoreTabs.forEach(btn => btn.classList.remove("active")); this.classList.add("active");
            currentStoreCategory = this.dataset.storeCategory; 
            updateStoreList(currentStoreCategory); 
        });
    });

    // --- DEBUG BUTTONS LOGIC ---
    const debugAddLevelsBtn = document.getElementById("debug-add-levels-btn");
    const debugResetFriendshipBtn = document.getElementById("debug-reset-friendship-btn");

    if (debugAddLevelsBtn) {
        debugAddLevelsBtn.addEventListener("click", () => {
            const pointsToAdd = 10 * MAX_FRIENDSHIP; 
            increaseFriendship(pointsToAdd);
            //alert(Debug: Attempted to add 10 friendship levels. New level: ${friendshipLevel});
            updateStoreList(currentStoreCategory); 
        });
    }

    if (debugResetFriendshipBtn) {
        debugResetFriendshipBtn.addEventListener("click", () => {
            friendship = 0;
            friendshipLevel = 1;
            localStorage.setItem("friendship", friendship);
            localStorage.setItem("friendshipLevel", friendshipLevel);
            updateFriendshipUI();
            //alert("Debug: Friendship has been reset to Level 1, 0 points.");
            updateStoreList(currentStoreCategory); 
        });
    }
    // --- END OF DEBUG BUTTONS LOGIC ---
    // --- END OF DEBUG BUTTONS LOGIC ---

