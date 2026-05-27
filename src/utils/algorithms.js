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
 * Brute Force Matcher with step-by-step recording.
 */
export const bruteForceMatchSteps = (text, pattern) => {
  const n = text.length;
  const m = pattern.length;
  const steps = [];
  const matches = [];
  let comparisons = 0;
  let shifts = 0;

  if (m === 0) return [];

  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    let currentMatchedOffsets = [];
    
    // Record step at the beginning of a shift alignment
    steps.push({
      type: 'alignment',
      shiftIndex: i,
      activePatternIdx: 0,
      activeTextIdx: i,
      status: 'align',
      matchedIndices: [],
      narrative: `Aligning pattern at index ${i} of the source text.`,
      comparisons,
      shifts,
      matches: [...matches]
    });

    while (j < m) {
      comparisons++;
      const textChar = text[i + j];
      const patternChar = pattern[j];
      const textIdx = i + j;
      const isCharMatch = textChar === patternChar;
      
      if (isCharMatch) {
        currentMatchedOffsets.push(j);
        steps.push({
          type: 'compare',
          shiftIndex: i,
          activePatternIdx: j,
          activeTextIdx: textIdx,
          status: 'char-match',
          matchedIndices: [...currentMatchedOffsets],
          narrative: `Comparing text[${textIdx}] ('${textChar === ' ' ? 'SPC' : textChar}') with pattern[${j}] ('${patternChar === ' ' ? 'SPC' : patternChar}'). It matches!`,
          comparisons,
          shifts,
          matches: [...matches]
        });
        j++;
      } else {
        steps.push({
          type: 'compare',
          shiftIndex: i,
          activePatternIdx: j,
          activeTextIdx: textIdx,
          status: 'mismatch',
          matchedIndices: [...currentMatchedOffsets],
          narrative: `Comparing text[${textIdx}] ('${textChar === ' ' ? 'SPC' : textChar}') with pattern[${j}] ('${patternChar === ' ' ? 'SPC' : patternChar}'). Mismatch!`,
          comparisons,
          shifts,
          matches: [...matches]
        });
        break;
      }
    }

    if (j === m) {
      matches.push(i);
      steps.push({
        type: 'match-success',
        shiftIndex: i,
        activePatternIdx: m - 1,
        activeTextIdx: i + m - 1,
        status: 'success',
        matchedIndices: [...currentMatchedOffsets],
        narrative: `Full pattern match found starting at index ${i}!`,
        comparisons,
        shifts,
        matches: [...matches]
      });
    }

    if (i < n - m) {
      shifts++;
      steps.push({
        type: 'shift',
        shiftIndex: i + 1,
        activePatternIdx: 0,
        activeTextIdx: i + 1,
        status: 'shift',
        matchedIndices: [],
        narrative: `Mismatch or complete match found. Shifting pattern by 1 position to alignment ${i + 1}.`,
        comparisons,
        shifts,
        matches: [...matches]
      });
    }
  }

  return steps;
};

/**
 * Horspool's Algorithm (Space-Time Tradeoff / Input Enhancement)
 */
export const generateHorspoolTable = (pattern) => {
  const m = pattern.length;
  const table = {};
  
  // By default, if character is not in pattern, shift is m.
  // We populate table for characters in pattern (except last one)
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

/**
 * Horspool Matcher with step-by-step recording.
 */
export const horspoolMatchSteps = (text, pattern) => {
  const n = text.length;
  const m = pattern.length;
  const steps = [];
  const matches = [];
  let comparisons = 0;
  let shifts = 0;

  if (m === 0) return [];

  const table = generateHorspoolTable(pattern);
  const getShift = (char) => table[char] || m;

  let i = m - 1; // Align pattern with text, start at index m-1
  
  while (i <= n - 1) {
    let k = 0;
    let currentMatchedOffsets = []; // Store pattern indices that match
    const alignStartTextIdx = i - m + 1; // Pattern begins at this text index

    // Record step when aligned
    steps.push({
      type: 'alignment',
      shiftIndex: alignStartTextIdx,
      activePatternIdx: m - 1,
      activeTextIdx: i,
      status: 'align',
      matchedIndices: [],
      narrative: `Aligning pattern end at index ${i} of the source text (starts at ${alignStartTextIdx}).`,
      comparisons,
      shifts,
      matches: [...matches]
    });

    while (k < m) {
      comparisons++;
      const patternIdx = m - 1 - k;
      const textIdx = i - k;
      const textChar = text[textIdx];
      const patternChar = pattern[patternIdx];
      const isCharMatch = textChar === patternChar;

      if (isCharMatch) {
        currentMatchedOffsets.push(patternIdx);
        steps.push({
          type: 'compare',
          shiftIndex: alignStartTextIdx,
          activePatternIdx: patternIdx,
          activeTextIdx: textIdx,
          status: 'char-match',
          matchedIndices: [...currentMatchedOffsets],
          narrative: `Comparing text[${textIdx}] ('${textChar === ' ' ? 'SPC' : textChar}') with pattern[${patternIdx}] ('${patternChar === ' ' ? 'SPC' : patternChar}'). It matches! Checking from right to left.`,
          comparisons,
          shifts,
          matches: [...matches]
        });
        k++;
      } else {
        steps.push({
          type: 'compare',
          shiftIndex: alignStartTextIdx,
          activePatternIdx: patternIdx,
          activeTextIdx: textIdx,
          status: 'mismatch',
          matchedIndices: [...currentMatchedOffsets],
          narrative: `Comparing text[${textIdx}] ('${textChar === ' ' ? 'SPC' : textChar}') with pattern[${patternIdx}] ('${patternChar === ' ' ? 'SPC' : patternChar}'). Mismatch!`,
          comparisons,
          shifts,
          matches: [...matches]
        });
        break;
      }
    }

    if (k === m) {
      const matchStart = i - m + 1;
      matches.push(matchStart);
      steps.push({
        type: 'match-success',
        shiftIndex: matchStart,
        activePatternIdx: 0,
        activeTextIdx: matchStart,
        status: 'success',
        matchedIndices: [...currentMatchedOffsets],
        narrative: `Full pattern match found starting at index ${matchStart}!`,
        comparisons,
        shifts,
        matches: [...matches]
      });
    }

    if (i < n - 1) {
      shifts++;
      const endChar = text[i];
      const shiftVal = getShift(endChar);
      const nextEndIdx = i + shiftVal;
      
      let tableLookupText = `The character at the end of alignment is '${endChar === ' ' ? 'SPC' : endChar}'. `;
      if (table[endChar] !== undefined) {
        tableLookupText += `Looking it up in the Bad Character Shift Table: shift is ${shiftVal}.`;
      } else {
        tableLookupText += `'${endChar === ' ' ? 'SPC' : endChar}' is NOT in the pattern. Using full pattern length shift: ${shiftVal}.`;
      }

      steps.push({
        type: 'shift',
        shiftIndex: i - m + 1 + shiftVal,
        activePatternIdx: m - 1,
        activeTextIdx: nextEndIdx,
        status: 'shift',
        matchedIndices: [],
        narrative: `${tableLookupText} Shifting the pattern by ${shiftVal} positions.`,
        comparisons,
        shifts,
        matches: [...matches]
      });
      
      i = nextEndIdx;
    } else {
      break;
    }
  }

  return steps;
};
