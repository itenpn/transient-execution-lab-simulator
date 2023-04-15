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

export { inlineReplace, inlineDelete };
