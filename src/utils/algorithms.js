/**
 * Brute Force String Matching Algorithm
 * Checks character-by-character, shifting by one position on mismatch.
 */
export const bruteForceMatch = (text, pattern) => {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  let comparisons = 0;
  let shifts = 0;
  const startTime = performance.now();

  if (m === 0) return { matches, comparisons, shifts, time: 0 };

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    while (j < m) {
      comparisons++;
      if (text[i + j] !== pattern[j]) {
        break;
      }
      j++;
    }
    if (j === m) {
      matches.push(i);
    }
    if (i < n - m) shifts++;
  }

  const endTime = performance.now();
  return {
    matches,
    comparisons,
    shifts,
    time: endTime - startTime,
    complexity: {
      time: "O(n * m)",
      space: "O(1)"
    }
  };
};

/**
 * Horspool's Algorithm (Space-Time Tradeoff / Input Enhancement)
 */
export const generateHorspoolTable = (pattern) => {
  const m = pattern.length;
  const table = {};
  
  // Initialize all characters to the length of the pattern
  // For simplicity in visualization, we'll only show characters present in the pattern
  // and a default for "others"
  for (let i = 0; i < m - 1; i++) {
    table[pattern[i]] = m - 1 - i;
  }
  
  return table;
};

export const horspoolMatch = (text, pattern) => {
  const n = text.length;
  const m = pattern.length;
  const matches = [];
  let comparisons = 0;
  let shifts = 0;
  const startTime = performance.now();

  if (m === 0) return { matches, comparisons, shifts, time: 0, table: {} };

  const table = generateHorspoolTable(pattern);
  const getShift = (char) => table[char] || m;

  let i = m - 1; // Align pattern with text, start at index m-1
  while (i <= n - 1) {
    let k = 0;
    while (k < m) {
      comparisons++;
      if (text[i - k] !== pattern[m - 1 - k]) {
        break;
      }
      k++;
    }
    
    if (k === m) {
      matches.push(i - m + 1);
    }
    
    if (i < n - 1) {
      shifts++;
      i += getShift(text[i]);
    } else {
      break;
    }
  }

  const endTime = performance.now();
  return {
    matches,
    comparisons,
    shifts,
    time: endTime - startTime,
    table,
    complexity: {
      time: "O(n) average, O(n*m) worst",
      space: "O(alphabet size)"
    }
  };
};
