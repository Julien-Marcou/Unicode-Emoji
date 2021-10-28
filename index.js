import UNICODE_EMOJI from './unicode-emoji.js';

const UNICODE_EMOJI_VERSIONS = ['0.6', '0.7', '1.0', '2.0', '3.0', '4.0', '5.0', '11.0', '12.0', '12.1', '13.0', '13.1', '14.0'];

const emojiVariations = new Map();

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
    if (omitWhere.version) {
      if (!emojiVariations.has(emoji) && emoji.variations) {
        emojiVariations.set(emoji, emoji.variations);
      }
      if (emojiVariations.has(emoji)) {
        const filteredVariations = [];
        for (const variation of emojiVariations.get(emoji)) {
          if (!omitWhere.version.includes(variation.version)) {
            filteredVariations.push(variation);
          }
        }
        emoji.variations = filteredVariations.length ? filteredVariations : undefined;
      }
    }
    filteredEmojis.push(emoji);
  }
  return filteredEmojis;
}

function getVersionsAbove(maxVersion) {
  return UNICODE_EMOJI_VERSIONS.filter(version => {
    return parseFloat(version) > parseFloat(maxVersion);
  });
}

function safeCheckGroupBy(groupBy) {
  const allowedFields = ['category', 'group', 'subgroup', 'version'];
  if (!groupBy || typeof groupBy !== 'string' || !allowedFields.includes(groupBy)) {
    throw new Error("You can't group emojis with \"" + groupBy + "\" - Try \"category\", \"group\", \"subgroup\" or \"version\" instead");
  }
}

function safeCheckOmitBy(omitWhere) {
  if (omitWhere.versionAbove) {
    if (!omitWhere.version) {
      omitWhere.version = [];
    }
    omitWhere.version = omitWhere.version.concat(getVersionsAbove(omitWhere.versionAbove));
    delete omitWhere.versionAbove;
  }

  const allowedFields = ['category', 'group', 'subgroup', 'version'];
  if (!omitWhere || typeof omitWhere !== 'object') {
    throw new Error("You can't filter emojis with \"" + omitWhere + "\" - Use an object, like \"{category: ['flags', 'symbols']}\" instead")
  }
  for (const omitField in omitWhere) {
    if (!allowedFields.includes(omitField)) {
      throw new Error("You can't filter emojis with key \"" + omitField + "\" - Try \"category\", \"group\", \"subgroup\", \"version\", or \"versionAbove\" instead");
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
