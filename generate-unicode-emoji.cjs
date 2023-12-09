const fs = require('fs');
const https = require('https');
const readline = require('readline');
const htmlparser2 = require('htmlparser2');

/* ------------- PARAMETERS ------------- */

const unicodeEmojiVersion = '15.1';
const unicodeCldrVersion = '44-1';
const unicodeCldrLocale = 'en';


/* ------------- EMOJIS CONSOLIDATION ------------- */

const categoriesMapping = {
  'smileys-emotion': {
    default: 'face-emotion'
  },
  'people-body': {
    default: 'person-people',
    'body-parts': 'face-emotion',
    'hand': 'face-emotion',
  },
  'animals-nature': {
    default: 'animals-nature'
  },
  'food-drink': {
    default: 'food-drink',
  },
  'travel-places': {
    default: 'travel-places',
    'sky-weather': 'animals-nature',
    'time': 'objects',
  },
  'activities': {
    default: 'activities-events',
  },
  'objects': {
    default: 'objects',
    'music': 'activities-events',
  },
  'symbols': {
    default: 'symbols',
  },
  'flags': {
    default: 'flags',
  },
};
const overrideCategoryForEmojis = {
  'activities-events': ['🎥', '🎞️', '📽️', '🎬', '📺', '📷', '📸', '📹', '📼', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛'],
  'animals-nature': ['🦀', '🦞', '🦐', '🦑', '🦪'],
  'objects': ['🧿', '🌂', '☂️', '💣'],
  'symbols': ['♠️', '♥️', '♦️', '♣️', '🕳️', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🔇', '🔈', '🔉', '🔊', '🔕', '💹'],
};
const overrideSubgroupForEmojis = {
  '👪': 'family',
};


/* ------------- FILES CONFIG ------------- */

// File paths
const emojisInput = `https://unicode.org/Public/emoji/${unicodeEmojiVersion}/emoji-test.txt`;
const annotationsInput = `https://raw.githubusercontent.com/unicode-org/cldr/release-${unicodeCldrVersion}/common/annotations/${unicodeCldrLocale}.xml`;
const derivedAnnotationsInput = `https://raw.githubusercontent.com/unicode-org/cldr/release-${unicodeCldrVersion}/common/annotationsDerived/${unicodeCldrLocale}.xml`;
const csvOutput = `${__dirname}/unicode-emoji.csv`;
const jsonOutput = `${__dirname}/unicode-emoji.json`;
const jsOutput = `${__dirname}/unicode-emoji.js`;

// Config to parse emojis file
const commentPrefix = '#';
const groupPrefix = '# group:';
const subgroupPrefix = '# subgroup:';
const componentStatus = 'component';
const fullyQualifiedStatus = 'fully-qualified';
const groupsWithVariations = ['people-body'];
const codePointsSeparator = ' ';
const baseDescriptionSeparator = ':';
const qualificationCodePoint = 'FE0F';

// Config to parse annotations file
const annotationTag = 'annotation';
const codePointsAttribute = 'cp';
const typeAttribute = 'type';
const textToSpeechType = 'tts';
const keywordsSeparator = /[|,]|:\s/g;


/* ------------- PROCESS ------------- */

// Emojis process
let emojiGroup;
let emojiSubgroup;
let emojiCount = 0;
const emojis = new Map(); // Used to map keywords & text to speech for each emojis
const components = new Map(); // Used to map components for each emoji variations
const baseEmojis = new Map(); // Used to attach variations to base emojis
const results = { components: {}, emojis: [] };

// Annotations process
let isAnnotationTag = false;
let annotationAttributes = null;
let annotationText = null;
let annotationCount = 0;
const annotationsParser = new htmlparser2.Parser({
  onopentag: (tag, attributes) => {
    isAnnotationTag = tag === annotationTag;
    if (isAnnotationTag) {
      annotationAttributes = attributes;
      annotationText = '';
    }
  },
  ontext: (text) => {
    if (isAnnotationTag) {
      annotationText += text;
    }
  },
  onclosetag: (tag) => {
    if (tag === annotationTag) {
      processAnnotationTag(annotationAttributes, annotationText);
      isAnnotationTag = false;
      annotationAttributes = null;
      annotationText = null;
    }
  },
  onend: () => {
    isAnnotationTag = false;
    annotationAttributes = null;
    annotationText = null;
  },
}, { decodeEntities: true });

function processEmojiLine(line) {
  // Retrieve group/subgroup line
  if (line.charAt(0) === commentPrefix) {
    if (line.startsWith(groupPrefix)) {
      emojiGroup = line
        .substring(groupPrefix.length)
        .trim()
        .replace(/[^A-Za-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
    }
    else if (line.startsWith(subgroupPrefix)) {
      emojiSubgroup = line
        .substring(subgroupPrefix.length)
        .trim()
        .replace(/[^A-Za-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
    }
  }
  // Retrieve emoji line
  else {
    const emojiMatch = line.match(/^(.+\b)\s+;\s+([\S]+)\s+#\s([\S]+)\s+E(\S+)\s+(.+)$/);
    if (!emojiMatch) {
      return;
    }
    const [_, codePoints, status, renderedEmoji, version, description] = emojiMatch;
    if (![componentStatus, fullyQualifiedStatus].includes(status)) {
      return;
    }

    const emoji = {
      emoji: renderedEmoji,
      description: description,
      version: version,
      keywords: null,
    };
    emojis.set(renderedEmoji, emoji);
    emojiCount++;
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
    process.stdout.write(`Retrieved ${emojiCount} emojis`);

    // Component emoji
    if (status === componentStatus) {
      emoji.codePoint = codePoints;
      if (!(emojiSubgroup in results.components)) {
        results.components[emojiSubgroup] = [];
      }
      results.components[emojiSubgroup].push(emoji);
      components.set(codePoints, emoji);
    }
    // Fully-qualified emoji
    else {
      emoji.codePoints = codePoints.split(codePointsSeparator);

      // Make the unqualified version of the emoji point to the fully-qualified emoji,
      // so annotations are later attached to the correct emoji
      const unqualifiedRenderedEmoji = String.fromCodePoint(
        ...emoji.codePoints
          .filter(codePoint => codePoint !== qualificationCodePoint)
          .map(codePoint => parseInt(codePoint, 16))
      );
      if (unqualifiedRenderedEmoji !== renderedEmoji) {
        emojis.set(unqualifiedRenderedEmoji, emoji);
      }

      // Map the group/subgroup to a more meaningful category
      let category = categoriesMapping[emojiGroup].default;
      for (const keyword in categoriesMapping[emojiGroup]) {
        if (keyword !== 'default' && emojiSubgroup.includes(keyword)) {
          category = categoriesMapping[emojiGroup][keyword];
          break;
        }
      }
      for (const overrideCategory in overrideCategoryForEmojis) {
        if (overrideCategoryForEmojis[overrideCategory].includes(renderedEmoji)) {
          category = overrideCategory;
        }
      }

      // Variation of an emoji
      const baseDescription = description.split(baseDescriptionSeparator)[0];
      if (groupsWithVariations.includes(emojiGroup) && baseEmojis.has(baseDescription)) {
        const baseEmoji = baseEmojis.get(baseDescription);
        if (!baseEmoji.variations) {
          baseEmoji.variations = [];
        }
        baseEmoji.variations.push(emoji);
      }
      // Base emoji
      else {
        emoji.category = category;
        emoji.group = emojiGroup;
        emoji.subgroup = overrideSubgroupForEmojis[renderedEmoji] ?? emojiSubgroup;
        results.emojis.push(emoji);
        baseEmojis.set(description, emoji);
      }
    }
  }
}

function consolidateEmojiVariations() {
  // In the Unicode data source, some emoji variations (e.g. woman with beard)
  // are defined before their base emoji (e.g. woman),
  // and because we process emojis sequentially,
  // when an emoji variation is defined before its base emoji,
  // it will be considered as a base emoji instead of a variation
  // To fix this, we loop through all the emojis a second time
  // to check if an emoji cannot be associated with another emoji
  baseEmojis.forEach((emojiVariation) => {
    // If the emoji is proven to be a variation
    const baseDescription = emojiVariation.description.split(baseDescriptionSeparator)[0];
    if (groupsWithVariations.includes(emojiVariation.group) && baseEmojis.has(baseDescription)) {
      const baseEmoji = baseEmojis.get(baseDescription);
      if (baseEmoji === emojiVariation) {
        return;
      }

      // Associate it to the correct base emoji
      if (!baseEmoji.variations) {
        baseEmoji.variations = [];
      }
      baseEmoji.variations.push(emojiVariation);

      // Remove category/group/subgroup from the variation
      delete emojiVariation.category;
      delete emojiVariation.group;
      delete emojiVariation.subgroup;

      // Remove it from the base emojis & results
      baseEmojis.delete(emojiVariation.description);
      results.emojis.splice(results.emojis.indexOf(emojiVariation), 1);
    }
  });
}

function consolidateEmojiVariationsWithComponents() {
  for (const baseEmoji of baseEmojis.values()) {
    if (baseEmoji.variations) {
      for (const emojiVariation of baseEmoji.variations) {
        for (const codePoint of emojiVariation.codePoints) {
          if (components.has(codePoint)) {
            if (!emojiVariation.components) {
              emojiVariation.components = [];
            }
            const component = components.get(codePoint);
            if (!emojiVariation.components.includes(component.emoji)) {
              emojiVariation.components.push(component.emoji);
            }
          }
        }
      }
    }
  }
}

function processAnnotationTag(attributes, text) {
  const renderedEmoji = attributes[codePointsAttribute];
  if (!emojis.has(renderedEmoji)) {
    return;
  }

  const emoji = emojis.get(renderedEmoji);
  if (attributes[typeAttribute] === textToSpeechType) {
    emoji.description = text.trim();
    annotationCount++;
    process.stdout.clearLine(-1);
    process.stdout.cursorTo(0);
    process.stdout.write(`Retrieved ${annotationCount} annotations`);
  }
  else {
    const keywords = text.split(keywordsSeparator).map((keyword) => keyword.trim());
    const keywordSet = new Set();

    // Some keywords are sentences where each word of the sentence is already in the list of keywords, so we don't need to keep the sentence
    for (const keyword of keywords) {
      const words = keyword.split(' ');
      if (words.length > 1 && words.every((word) => keywords.includes(word))) {
        continue;
      }
      keywordSet.add(keyword);
    }

    emoji.keywords = [...keywordSet].sort((a, b) => a.localeCompare(b));
  }
}

function saveResults() {
  // Save CSV
  let csvResult = 'emoji,description,version,keywords,category,group,subgroup,parent,components\n'
  for (const componentGroup in results.components) {
    for (const component of results.components[componentGroup]) {
      csvResult +=
        `${component.emoji},` +
        `"${component.description.replace(/"/g, '""')}",` +
        `${component.version},` +
        `${component.keywords.join('|')},` +
        `components,` +
        `component,`+
        `${componentGroup},,\n`;
    }
  }
  for (const baseEmoji of results.emojis) {
    if (!baseEmoji.description || !baseEmoji.keywords) {
      process.stdout.write(`Missing annotations for emoji ${baseEmoji.emoji}\n`);
    }
    csvResult +=
      `${baseEmoji.emoji},` +
      `"${baseEmoji.description?.replace(/"/g, '""')}",` +
      `${baseEmoji.version},` +
      `${baseEmoji.keywords?.join('|')},` +
      `${baseEmoji.category},` +
      `${baseEmoji.group},` +
      `${baseEmoji.subgroup},,\n`;
    if (baseEmoji.variations) {
      for (const emojiVariation of baseEmoji.variations) {
        if (!emojiVariation.description || !emojiVariation.keywords) {
          process.stdout.write(`Missing annotations for emoji ${emojiVariation.emoji}\n`);
        }
        csvResult +=
          `${emojiVariation.emoji},` +
          `"${emojiVariation.description?.replace(/"/g, '""')}",` +
          `${emojiVariation.version},` +
          `${emojiVariation.keywords?.join('|')},` +
          `${baseEmoji.category},` +
          `${baseEmoji.group},` +
          `${baseEmoji.subgroup},` +
          `${baseEmoji.emoji},` +
          `${emojiVariation.components ? emojiVariation.components.join('|') : ''}\n`;
      }
    }
  }
  fs.writeFileSync(csvOutput, csvResult);

  // Save JSON
  fs.writeFileSync(jsonOutput, JSON.stringify(results, null, 2));

  // Save JS
  for (const componentGroup in results.components) {
    results.components[componentGroup].forEach((component) => {
      delete component.codePoint;
      delete component.keywords;
    });
  }
  results.emojis.forEach((baseEmoji) => {
    delete baseEmoji.codePoints;
    if (baseEmoji.variations) {
      baseEmoji.variations.forEach((emojiVariation) => {
        delete emojiVariation.codePoints;
        delete emojiVariation.components;
        delete emojiVariation.keywords;
      })
    }
  });
  fs.writeFileSync(jsOutput, `export default ${JSON.stringify(results)};`);
}

// Retrieve emojis online
process.stdout.write(`Retrieving "Unicode Emoji, Version ${unicodeEmojiVersion}"\n`);
https.get(emojisInput, (emojisResponse) => {
  if (emojisResponse.statusCode !== 200) {
    process.stdout.write(`HTTP error ${emojisResponse.statusCode} occurred while retrieving the emojis\n`);
    return;
  }
  emojisResponse.setEncoding('utf8');
  readline.createInterface(emojisResponse).on('line', (line) => {
    processEmojiLine(line);
  }).on('close', () => {
    process.stdout.write('\n');

    // Fix emoji variations not being linked to their base emoji
    consolidateEmojiVariations();

    // Components consolidation (skin tone & hair style) for emoji variations
    consolidateEmojiVariationsWithComponents();

    // Retrieve annotations (text-to-speech & keywords) online
    process.stdout.write(`Retrieving "Common Local Data Repository, Version ${unicodeCldrVersion}" for local "${unicodeCldrLocale}"\n`);
    https.get(annotationsInput, (annotationResponse) => {
      if (annotationResponse.statusCode !== 200) {
        process.stdout.write(`HTTP error ${annotationResponse.statusCode} occurred while retrieving the annotations\n`);
        return;
      }
      annotationResponse.setEncoding('utf8');
      annotationResponse.on('data', (data) => {
        annotationsParser.write(data);
      });
      annotationResponse.on('end', () => {

        // Retrieve derived (emoji variations) annotations online
        https.get(derivedAnnotationsInput, (derivedAnnotationResponse) => {
          derivedAnnotationResponse.setEncoding('utf8');
          derivedAnnotationResponse.on('data', (data) => {
            annotationsParser.write(data);
          });
          derivedAnnotationResponse.on('end', () => {
            // End of process
            process.stdout.write('\n');
            saveResults();
          });
        });
      });
    });
  });
});
