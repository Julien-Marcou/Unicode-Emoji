import UNICODE_EMOJI from './unicode-emoji.js';

function groupEmojis(emojis, groupBy) {
  const groupedEmojis = {};
  for (const emoji of emojis) {
    if (!(emoji[groupBy] in groupedEmojis)) {
      groupedEmojis[emoji[groupBy]] = [];
    }
    groupedEmojis[emoji[groupBy]].push(emoji);
  }
  return groupedEmojis;
}

function filterEmojis(emojis, omitWhere) {
  const filteredEmojis = [];
  for (const emoji of emojis) {
    let omit = false;
    for (const omitField in omitWhere) {
      if (omitWhere[omitField].includes(emoji[omitField])) {
        omit = true;
        break;
      }
    }
    if (omit) {
      continue;
    }
    if (emoji.variations && omitWhere.version) {
      const filteredVariations = [];
      for (const variation of emoji.variations) {
        if (!omitWhere.version.includes(variation.version)) {
          filteredVariations.push(variation);
        }
      }
      emoji.variations = filteredVariations;
    }
    filteredEmojis.push(emoji);
  }
  return filteredEmojis;
}

function safeCheckGroupBy(groupBy) {
  const allowedFields = ['category', 'group', 'subgroup', 'version'];
  if (!groupBy || typeof groupBy !== 'string' || !allowedFields.includes(groupBy)) {
    throw new Error("You can't group emojis with \"" + groupBy + "\" - Try \"category\", \"group\", \"subgroup\" or \"version\" instead");
  }
}

function safeCheckOmitBy(omitWhere) {
  const allowedFields = ['category', 'group', 'subgroup', 'version'];
  if (!omitWhere || typeof omitWhere !== 'object') {
    throw new Error("You can't filter emojis with \"" + omitWhere + "\" - Use an object, like \"{category: ['flags', 'symbols']}\" instead")
  }
  for (const omitField in omitWhere) {
    if (!allowedFields.includes(omitField)) {
      throw new Error("You can't filter emojis with key \"" + omitField + "\" - Try \"category\", \"group\", \"subgroup\" or \"version\" instead");
    }
    else if (!(omitWhere[omitField] instanceof Array)) {
      throw new Error("You can't filter emojis with value \"" + omitWhere[omitField] + "\" for key \"" + omitField + "\" - Use an array, like \"['flags', 'symbols']\" instead");
    }
  }
}

export function getComponents() {
  return UNICODE_EMOJI.components;
}

export function getEmojis(omitWhere) {
  if (omitWhere) {
    safeCheckOmitBy(omitWhere);
    return filterEmojis(UNICODE_EMOJI.emojis, omitWhere);
  }
  return UNICODE_EMOJI.emojis;
}

export function getEmojisGroupedBy(groupBy, omitWhere) {
  let emojis = UNICODE_EMOJI.emojis;
  if (omitWhere) {
    safeCheckOmitBy(omitWhere);
    emojis = filterEmojis(emojis, omitWhere);
  }
  safeCheckGroupBy(groupBy);
  return groupEmojis(emojis, groupBy);
}