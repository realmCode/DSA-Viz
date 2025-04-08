const arrayBoxes = document.getElementById('array-boxes');
const numberInput = document.getElementById('number-input');
const addNumberButton = document.getElementById('add-number');
const runAlgoButton = document.getElementById('run-algo');
const speechBubble = document.getElementById('speech-bubble');

let array = [];
const animationDelay = 700;
let maxElements = window.innerWidth <= 768 ? 7 : 9;
let sortingInProgress = false;

// Initialize simulator
speechBubble.innerHTML = "Bubble Sort works by repeatedly swapping adjacent elements if they're in the wrong order.";
setTimeout(() => {
  speechBubble.innerHTML = `Enter up to ${maxElements} numbers<br>Click 'Run Bubble Sort' when ready!`;
}, 5000);

function addNumber() {
  if (sortingInProgress) return;
  
  const num = parseInt(numberInput.value);
  if (isNaN(num)) return showMessage("Please enter a valid number!", true);
  if (array.length >= maxElements) return showMessage(`Maximum ${maxElements} numbers allowed!`, true);
  
  array.push(num);
  renderArray();
  numberInput.value = '';
  runAlgoButton.disabled = false;
}

function renderArray() {
  arrayBoxes.innerHTML = array
    .map((num, i) => `
      <div class="array-box" style="transition-delay: ${i * 50}ms">
        ${num}
      </div>
    `).join('');
}

async function bubbleSort() {
  if (array.length === 0 || sortingInProgress) return;

  sortingInProgress = true;
  runAlgoButton.disabled = true;
  showMessage("Starting Bubble Sort...");

  try {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
      if (!sortingInProgress) break;

      // Create temp container for current pass
      const tempContainer = createTempContainer(n - i);
      arrayBoxes.parentElement.appendChild(tempContainer);
      
      await animatePass(tempContainer, n - i);
      
      // Update main array visualization
      await updateMainArray(n - i);
      
      // Remove temp container
      tempContainer.style.opacity = '0';
      tempContainer.style.transform = 'translateY(20px)';
      await delay(animationDelay);
      tempContainer.remove();
    }
    
    if (sortingInProgress) showMessage("Sorting complete!");
  } catch (error) {
    showMessage("Sorting interrupted!", true);
  } finally {
    sortingInProgress = false;
    runAlgoButton.disabled = array.length === 0;
  }
}

function createTempContainer(size) {
  const tempContainer = document.createElement('div');
  tempContainer.className = 'temp-container';
  
  array.slice(0, size).forEach((num, j) => {
    const tempBox = document.createElement('div');
    tempBox.className = 'temp-box';
    tempBox.textContent = num;
    tempContainer.appendChild(tempBox);
  });
  
  return tempContainer;
}

async function animatePass(tempContainer, passSize) {
  for (let j = 0; j < passSize - 1; j++) {
    if (!sortingInProgress) break;

    const currentBox = tempContainer.children[j];
    const nextBox = tempContainer.children[j + 1];
    
    // Highlight comparison
    currentBox.classList.add('highlight');
    nextBox.classList.add('highlight');
    await delay(animationDelay);

    if (array[j] > array[j + 1]) {
      // Swap array elements
      [array[j], array[j + 1]] = [array[j + 1], array[j]];
      
      // Perform swap animation
      await performSwapAnimation(currentBox, nextBox);
      
      // Update temp container values
      currentBox.textContent = array[j];
      nextBox.textContent = array[j + 1];
    } else {
      // Perform flip animation (no swap)
      await performFlipAnimation(currentBox, nextBox);
    }

    // Remove highlight
    currentBox.classList.remove('highlight');
    nextBox.classList.remove('highlight');
  }
}

async function performSwapAnimation(a, b) {
  // Calculate swap distance
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  const delta = bRect.left - aRect.left;

  // Apply animation
  a.style.transform = `translateX(${delta}px)`;
  b.style.transform = `translateX(${-delta}px)`;
  a.classList.add('flip');
  b.classList.add('flip');
  
  await delay(animationDelay);

  // Reset transforms after animation
  a.style.transform = '';
  b.style.transform = '';
  /* a.classList.remove('flip'); */
  b.classList.remove('flip');
}

async function performFlipAnimation(a, b) {
  a.classList.add('flip');
  b.classList.add('flip');
  await delay(animationDelay);
  a.classList.remove('flip');
  b.classList.remove('flip');
}

async function updateMainArray(updatedSize) {
  for (let j = 0; j < updatedSize; j++) {
    const mainBox = arrayBoxes.children[j];
    mainBox.textContent = array[j];
    mainBox.classList.add('pop-in');
    await delay(animationDelay / 2);
    mainBox.classList.remove('pop-in');
  }
}

// Helper functions
function showMessage(text, isError = false) {
  speechBubble.innerHTML = text;
  speechBubble.style.color = isError ? '#c62828' : '#000';
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Event listeners
addNumberButton.addEventListener('click', addNumber);
numberInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addNumber();
});

runAlgoButton.addEventListener('click', () => {
  if (!sortingInProgress) bubbleSort();
});

// Handle window resize
window.addEventListener('resize', () => {
  if (sortingInProgress) return;
  
  const newMax = window.innerWidth <= 768 ? 7 : 9;
  if (newMax !== maxElements) {
    maxElements = newMax;
    if (array.length > maxElements) {
      array = array.slice(0, maxElements);
      renderArray();
    }
    speechBubble.innerHTML = `Enter up to ${maxElements} numbers<br>Click 'Run Bubble Sort' when ready!`;
  }
  runAlgoButton.disabled = array.length === 0;
});