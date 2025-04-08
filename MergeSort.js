const arrayBoxes = document.getElementById('array-boxes');
const numberInput = document.getElementById('number-input');
const addNumberButton = document.getElementById('add-number');
const runAlgoButton = document.getElementById('run-algo');
const speechBubble = document.getElementById('speech-bubble');

let array = [];
const animationDelay = 800;
let maxElements = window.innerWidth <= 768 ? 7 : 8;
let sortingInProgress = false;

// Initial speech bubble content
speechBubble.innerHTML = "Merge Sort is a divide-and-conquer algorithm that splits an array, sorts the subarrays, and merges them. It has a time complexity of O(n log n) and is stable. This makes it efficient for large datasets and linked lists.";
setTimeout(() => {
  speechBubble.innerHTML = `Enter up to ${maxElements} numbers<br>Click 'Run Merge Sort' when ready!`;
}, 5000);

function addNumber() {
  if (sortingInProgress) return;
  
  const num = parseInt(numberInput.value);
  if (isNaN(num)) return showMessage("Please enter a valid number!", true);
  if (array.length >= maxElements) return showMessage(`Maximum ${maxElements} numbers allowed!`, true);
  
  array.push(num);
  renderArray();
  numberInput.value = '';
  runAlgoButton.disabled = array.length === 0; // Enable button for any non-empty array
}

function renderArray() {
  arrayBoxes.innerHTML = array
    .map((num, i) => `<div class="array-box" style="transition-delay: ${i * 50}ms">${num}</div>`)
    .join('');
}

async function mergeSort() {
  if (array.length === 0 || sortingInProgress) return;
  
  sortingInProgress = true;
  runAlgoButton.disabled = true;
  showMessage("Starting Merge Sort...");
  
  try {
    await performMergeSort(array, 0, array.length - 1, 0);
    showMessage("Sorting complete!");
  } catch (error) {
    showMessage("Sorting interrupted!", true);
  } finally {
    sortingInProgress = false;
    runAlgoButton.disabled = array.length === 0;
  }
}

async function performMergeSort(arr, left, right, level) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);
  
  await performMergeSort(arr, left, mid, level + 1);
  await performMergeSort(arr, mid + 1, right, level + 1);
  await mergeWithAnimation(arr, left, mid, right, level);
}

async function mergeWithAnimation(arr, left, mid, right, level) {
  const temp = [];
  let i = left, j = mid + 1;

  // Create merge containers
  const mergeContainer = document.createElement('div');
  mergeContainer.className = 'merge-container';
  const tempArrayContainer = document.createElement('div');
  tempArrayContainer.className = 'merge-container temp-array';
  
  // Position containers
  const baseElement = arrayBoxes.children[left];
  const baseLeft = baseElement?.offsetLeft - arrayBoxes.offsetLeft || 0;
  
  mergeContainer.style.left = `${baseLeft}px`;
  mergeContainer.style.top = `${100 * (level + 1)}px`;
  tempArrayContainer.style.left = `${baseLeft}px`;
  tempArrayContainer.style.top = `${100 * (level + 1) - 60}px`;

  // Initialize elements
  const elementCount = right - left + 1;
  for (let k = 0; k < elementCount; k++) {
    const mergeBox = document.createElement('div');
    mergeBox.className = 'merge-box';
    mergeBox.textContent = arr[left + k];
    mergeContainer.appendChild(mergeBox);

    const tempBox = document.createElement('div');
    tempBox.className = 'merge-box temp-box';
    tempArrayContainer.appendChild(tempBox);
  }

  arrayBoxes.parentElement.appendChild(mergeContainer);
  arrayBoxes.parentElement.appendChild(tempArrayContainer);
  await delay(animationDelay/2);

  let currentTempIndex = 0;
  
  // Merge process
  while (i <= mid && j <= right) {
    if (!sortingInProgress) break;
    await highlightComparison(mergeContainer.children[i - left], mergeContainer.children[j - left]);
    
    if (arr[i] <= arr[j]) {
      await animateToTempArray(mergeContainer.children[i - left], tempArrayContainer.children[currentTempIndex], arr[i]);
      temp.push(arr[i++]);
    } else {
      await animateToTempArray(mergeContainer.children[j - left], tempArrayContainer.children[currentTempIndex], arr[j]);
      temp.push(arr[j++]);
    }
    currentTempIndex++;
  }

  // Handle remaining elements
  const handleRemaining = async (element, end) => {
    while (element <= end && sortingInProgress) {
      await animateToTempArray(mergeContainer.children[element - left], tempArrayContainer.children[currentTempIndex], arr[element]);
      temp.push(arr[element++]);
      currentTempIndex++;
    }
  };

  await handleRemaining(i, mid);
  await handleRemaining(j, right);

  // Update merge container
  if (sortingInProgress) {
    for (let k = 0; k < temp.length; k++) {
      mergeContainer.children[k].textContent = temp[k];
      mergeContainer.children[k].classList.add('flip');
      await delay(animationDelay/2);
      mergeContainer.children[k].classList.remove('flip');
    }
  }

  // Update main array
  if (sortingInProgress) {
    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      const mainBox = arrayBoxes.children[left + k];
      mainBox.textContent = temp[k];
      mainBox.classList.add('pop-in');
      await delay(animationDelay/2);
      mainBox.classList.remove('pop-in');
    }
  }

  // Cleanup
  [mergeContainer, tempArrayContainer].forEach(container => {
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
  });
  await delay(animationDelay);
  mergeContainer.remove();
  tempArrayContainer.remove();
}

// Helper functions
async function highlightComparison(a, b) {
  a.style.backgroundColor = '#ffcdd2';
  b.style.backgroundColor = '#ffcdd2';
  await delay(animationDelay);
  a.style.backgroundColor = '';
  b.style.backgroundColor = '';
}

async function animateToTempArray(source, target, value) {
  source.style.backgroundColor = '#ffcdd2';
  target.style.backgroundColor = '#c8e6c9';
  target.textContent = value;
  target.classList.add('pop-in');
  await delay(animationDelay/2);
  source.style.backgroundColor = '';
  target.style.backgroundColor = '#f0f4c3';
  target.classList.remove('pop-in');
}

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
  if (!sortingInProgress) mergeSort();
});

window.addEventListener('resize', () => {
  if (sortingInProgress) return;
  
  const newMax = window.innerWidth <= 768 ? 7 : 8;
  if (newMax !== maxElements) {
    maxElements = newMax;
    if (array.length > maxElements) {
      array = array.slice(0, maxElements);
      renderArray();
    }
    speechBubble.innerHTML = `Enter up to ${maxElements} numbers<br>Click 'Run Merge Sort' when ready!`;
  }
  runAlgoButton.disabled = array.length === 0;
});