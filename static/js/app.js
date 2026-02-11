// DOM Elements
const rollButton = document.getElementById('rollButton');
const diceResult = document.getElementById('diceResult');
const resultNumber = document.getElementById('resultNumber');
const stateMessage = document.getElementById('stateMessage');
const flames = document.getElementById('flames');
const dumpster = document.querySelector('.dumpster');

// State
let isRolling = false;

// Event Listeners
rollButton.addEventListener('click', rollDice);

// Main function to roll the dice
async function rollDice() {
    // Prevent multiple simultaneous rolls
    if (isRolling) return;
    
    isRolling = true;
    rollButton.disabled = true;
    resultNumber.className = '';
    
    // Clear previous state
    flames.classList.remove('active');
    dumpster.classList.remove('on-fire');
    stateMessage.className = 'state-message';
    stateMessage.textContent = 'Rolling...';
    
    // Add rolling animation
    resultNumber.style.animation = 'spin 0.6s ease-in-out';
    
    // Simulate rolling animation with interval
    const rollDuration = 600; // milliseconds
    const rollInterval = 50; // update every 50ms
    const startTime = Date.now();
    
    const rollAnimation = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= rollDuration) {
            clearInterval(rollAnimation);
            // Fetch actual result from server
            fetchDiceResult();
        } else {
            // Show random numbers during animation
            resultNumber.textContent = Math.floor(Math.random() * 6) + 1;
        }
    }, rollInterval);
}

// Fetch dice result from Flask API
async function fetchDiceResult() {
    try {
        const response = await fetch('/api/roll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        // Display the result with a brief delay for effect
        setTimeout(() => {
            displayResult(data.number, data.is_fire, data.message);
        }, 200);
        
    } catch (error) {
        console.error('Error rolling dice:', error);
        resultNumber.textContent = '?';
        stateMessage.textContent = 'Error! Try again.';
        stateMessage.className = 'state-message';
        isRolling = false;
        rollButton.disabled = false;
    }
}

// Display the dice result and update UI
function displayResult(number, isFire, message) {
    // Update result number
    resultNumber.textContent = number;
    
    // Update state message and UI based on result
    stateMessage.textContent = message;
    
    if (isFire) {
        // Dumpster is on fire!
        resultNumber.className = 'fire';
        stateMessage.className = 'state-message fire';
        
        // Show flames with animation
        flames.classList.add('active');
        dumpster.classList.add('on-fire');
        
    } else {
        // Safe!
        resultNumber.className = 'safe';
        stateMessage.className = 'state-message safe';
        
        // Keep flames hidden
        flames.classList.remove('active');
        dumpster.classList.remove('on-fire');
    }
    
    // Re-enable button after result is displayed
    setTimeout(() => {
        isRolling = false;
        rollButton.disabled = false;
    }, 500);
}

// Add CSS animation for spinning (not in stylesheet for dynamic use)
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotateZ(0deg); opacity: 0.7; }
        50% { transform: rotateZ(180deg); opacity: 1; }
        100% { transform: rotateZ(360deg); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Console message for fun
console.log('%cWelcome to Dumpster Fire Dice! 🔥', 'color: #ff4500; font-size: 16px; font-weight: bold;');
console.log('%cCheck if your day is a dumpster fire or just fine!', 'color: #667eea; font-size: 14px;');
