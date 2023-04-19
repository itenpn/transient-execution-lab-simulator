/**
 *  Takes an array, a replacement element, and a comparator field.
 *  Finds the index within the array with supplied field matching the replacment supplied field.
 *  Returns new array that is copy of the old, except with the match replaced.
 */
const inlineReplace = (array, replacement, field = "id") => {
  const index = array.findIndex((a) => a[field] === replacement[field]);
  let replaced = [...array];
  replaced[index] = replacement;
  return replaced;
};

/**
 * Like inlineReplace, but just removes the incoming toRemove.
 */
const inlineDelete = (array, toRemove, field = "id") => {
  const index = array.findIndex((a) => a[field] === toRemove[field]);
  let removed = [...array];
  removed.splice(index, 1);
  return removed;
};

/**
 * Sleeps for supplied milliseconds ms.
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Returns an array of all numbers [start, end)
 */
const range = (start, end) => {
  return [...Array(end - start).keys()].map((i) => i + start);
};

/**
 * Takes a number `data`, casts to base `base`, and prepends with "0" until
 * total length is at least `length` characters
 */
const stringifyData = (data, base, length = 2, paddingChar = "0") => {
  return data.toString(base).padStart(length, paddingChar);
};

export { inlineReplace, inlineDelete, sleep, range, stringifyData };
