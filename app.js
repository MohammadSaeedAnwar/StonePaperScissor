// Game state variables
let playerScore = 0;
let aiScore = 0;
let currentStreak = 0;
let bestStreak = 0;
let achievements = [];

// Sound effects
const sounds = {
    win: new Audio('https://assets.mixkit.co/active_storage/sfx/2018/win-sparkle.wav'),
    lose: new Audio('https://assets.mixkit.co/active_storage/sfx/2019/lose-drum.wav'),
    tie: new Audio('https://assets.mixkit.co/active_storage/sfx/2020/tie-bell.wav'),
    click: new Audio('https://assets.mixkit.co/active_storage/sfx/2021/click-pop.wav')
};

// Achievement definitions
const ACHIEVEMENTS = {
    FIRST_WIN: { id: 'first-win', title: 'First Victory', description: 'Win your first game', icon: '🎉' },
    STREAK_3: { id: 'streak-3', title: 'Hot Streak', description: 'Win 3 games in a row', icon: '🔥' },
    STREAK_5: { id: 'streak-5', title: 'Unstoppable', description: 'Win 5 games in a row', icon: '⚡' },
    MASTER_ROCK: { id: 'master-rock', title: 'Rock Master', description: 'Win 3 times with Rock', icon: '🪨' },
    MASTER_PAPER: { id: 'master-paper', title: 'Paper Master', description: 'Win 3 times with Paper', icon: '📄' },
    MASTER_SCISSORS: { id: 'master-scissors', title: 'Scissors Master', description: 'Win 3 times with Scissors', icon: '✂️' }
};

// Tracking variables for achievements
const weaponWins = {
    rock: 0,
    paper: 0,
    scissors: 0
};

// DOM elements
const optionButtons = document.querySelectorAll(".option-button");
const resultMessage = document.querySelector(".result-message");
const playerScoreDisplay = document.querySelector(".player-score");
const aiScoreDisplay = document.querySelector(".ai-score");
const streakDisplay = document.createElement('div');
streakDisplay.className = 'streak-display';
document.querySelector('.score-display').appendChild(streakDisplay);

const achievementsContainer = document.createElement('div');
achievementsContainer.className = 'achievements-container';
document.body.appendChild(achievementsContainer);

// Game options
const gameOptions = ["rock", "paper", "scissors"];

/**
 * Generate a random computer choice
 * @returns {string} - The computer's choice (rock, paper, or scissors)
 */
const generateAiChoice = () => {
  const randomIndex = Math.floor(Math.random() * 3);
  return gameOptions[randomIndex];
};

/**
 * Handle a tie game scenario
 */
const handleTie = () => {
  console.log("Game is a tie.");
  resultMessage.innerText = "It's a tie! Play again!";
  resultMessage.style.background = "linear-gradient(135deg, #64748b, #475569)";
  sounds.tie.play();
  currentStreak = 0;
  updateStreak(false);
};

/**
 * Update the score and display the game result
 * @param {boolean} playerWins - Whether the player won the round
 * @param {string} playerChoice - The player's choice
 * @param {string} aiChoice - The AI's choice
 */
const showRoundResult = (playerWins, playerChoice, aiChoice) => {
  // Create more readable choice names with first letter capitalized
  const formatChoice = (choice) => choice.charAt(0).toUpperCase() + choice.slice(1);
  const playerChoiceFormatted = formatChoice(playerChoice);
  const aiChoiceFormatted = formatChoice(aiChoice);
  
  if (playerWins) {
    // Player wins scenario
    playerScore++;
    playerScoreDisplay.innerText = playerScore;
    console.log("You Win!");
    resultMessage.innerText = `You win! Your ${playerChoiceFormatted} beats ${aiChoiceFormatted}`;
    resultMessage.style.background = "linear-gradient(135deg, #22c55e, #16a34a)";
    sounds.win.play();
    if (currentStreak >= 3) {
        initConfetti();
    }
  } else {
    // AI wins scenario
    aiScore++;
    aiScoreDisplay.innerText = aiScore;
    console.log("You Lose");
    resultMessage.innerText = `You lose! ${aiChoiceFormatted} beats your ${playerChoiceFormatted}`;
    resultMessage.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
    sounds.lose.play();
  }
  
  // Add animation effect to the result message
  resultMessage.animate(
    [
      { transform: 'scale(1.1)', opacity: 0.9 },
      { transform: 'scale(1)', opacity: 1 }
    ],
    { 
      duration: 300,
      easing: 'ease-out'
    }
  );
  
  updateStreak(playerWins);
  checkAchievements(playerWins, playerChoice);
};

/**
 * Determine the winner of the round and update the game state
 * @param {string} playerChoice - The player's choice
 */
const playRound = (playerChoice) => {
  console.log(`Player chose: ${playerChoice}`);
  
  // Generate AI choice
  const aiChoice = generateAiChoice();
  console.log(`AI chose: ${aiChoice}`);
  
  // Check for a tie
  if (playerChoice === aiChoice) {
    handleTie();
    return;
  }
  
  // Determine winner using game logic
  let playerWins = false;
  
  switch (playerChoice) {
    case "rock":
      playerWins = aiChoice === "scissors";
      break;
    case "paper":
      playerWins = aiChoice === "rock";
      break;
    case "scissors":
      playerWins = aiChoice === "paper";
      break;
  }
  
  // Show the round result
  showRoundResult(playerWins, playerChoice, aiChoice);
};

/**
 * Add visual feedback when an option is selected
 * @param {Element} selectedOption - The DOM element that was clicked
 */
const addSelectionFeedback = (selectedOption) => {
  // Add a brief highlight effect
  selectedOption.classList.add("selected");
  
  // Remove the highlight after animation completes
  setTimeout(() => {
    selectedOption.classList.remove("selected");
  }, 300);
};

// Event listeners for player choices
optionButtons.forEach((optionButton) => {
  optionButton.addEventListener("click", () => {
    const playerChoice = optionButton.getAttribute("id");
    sounds.click.play();
    addSelectionFeedback(optionButton);
    playRound(playerChoice);
  });
});

/**
 * Initialize confetti effect
 */
const initConfetti = () => {
    const confettiColors = ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'];
    const confettiCount = 150;
    
    for (let i = 0; i < confettiCount; i++) {
        createConfettiParticle();
    }
};

/**
 * Create a single confetti particle
 */
const createConfettiParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'confetti';
    particle.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    particle.style.opacity = Math.random();
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => particle.remove(), 5000);
};

/**
 * Update and display the current streak
 * @param {boolean} playerWins - Whether the player won the round
 */
const updateStreak = (playerWins) => {
    if (playerWins) {
        currentStreak++;
        if (currentStreak > bestStreak) {
            bestStreak = currentStreak;
            localStorage.setItem('bestStreak', bestStreak);
        }
    } else {
        currentStreak = 0;
    }
    
    streakDisplay.innerHTML = `
        <div class="streak-current ${currentStreak > 0 ? 'active' : ''}">
            <span class="streak-label">Current Streak:</span>
            <span class="streak-value">${currentStreak}</span>
            ${currentStreak >= 3 ? '🔥' : ''}
        </div>
        <div class="streak-best">
            <span class="streak-label">Best Streak:</span>
            <span class="streak-value">${bestStreak}</span>
            ${bestStreak >= 5 ? '👑' : ''}
        </div>
    `;
};

/**
 * Check and award achievements
 * @param {boolean} playerWins - Whether the player won the round
 * @param {string} playerChoice - The player's choice
 */
const checkAchievements = (playerWins, playerChoice) => {
    if (playerWins) {
        // First win achievement
        if (!achievements.includes(ACHIEVEMENTS.FIRST_WIN.id)) {
            unlockAchievement(ACHIEVEMENTS.FIRST_WIN);
        }
        
        // Streak achievements
        if (currentStreak === 3 && !achievements.includes(ACHIEVEMENTS.STREAK_3.id)) {
            unlockAchievement(ACHIEVEMENTS.STREAK_3);
        }
        if (currentStreak === 5 && !achievements.includes(ACHIEVEMENTS.STREAK_5.id)) {
            unlockAchievement(ACHIEVEMENTS.STREAK_5);
        }
        
        // Weapon mastery achievements
        weaponWins[playerChoice]++;
        const masterAchievement = {
            rock: ACHIEVEMENTS.MASTER_ROCK,
            paper: ACHIEVEMENTS.MASTER_PAPER,
            scissors: ACHIEVEMENTS.MASTER_SCISSORS
        }[playerChoice];
        
        if (weaponWins[playerChoice] === 3 && !achievements.includes(masterAchievement.id)) {
            unlockAchievement(masterAchievement);
        }
    }
};

/**
 * Display achievement notification
 * @param {Object} achievement - The achievement object
 */
const unlockAchievement = (achievement) => {
    achievements.push(achievement.id);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-details">
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
        </div>
    `;
    
    achievementsContainer.appendChild(notification);
    
    // Add animation classes
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
};

// Load saved data
window.addEventListener('load', () => {
    const savedAchievements = localStorage.getItem('achievements');
    if (savedAchievements) {
        achievements = JSON.parse(savedAchievements);
    }
    
    bestStreak = parseInt(localStorage.getItem('bestStreak')) || 0;
    updateStreak(false);
});

// Initialize the score displays
playerScoreDisplay.innerText = playerScore;
aiScoreDisplay.innerText = aiScore;