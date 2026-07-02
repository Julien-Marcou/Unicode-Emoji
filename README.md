# Unicode Emoji

[![NPM Package](https://img.shields.io/npm/v/unicode-emoji?label=release&color=%23cd2620&logo=npm)](https://www.npmjs.com/package/unicode-emoji)
[![Unicode Emoji v17](https://img.shields.io/badge/emoji-v17-yellow?logo=unicode&logoColor=yellow)](https://unicode.org/Public/emoji/17.0/)
[![GitHub Repository](https://img.shields.io/github/stars/Julien-Marcou/Unicode-Emoji?color=%23f5f5f5&logo=github)](https://github.com/Julien-Marcou/Unicode-Emoji)

![Downloads per Month](https://img.shields.io/npm/dm/unicode-emoji)
![Repository Size](https://img.shields.io/github/repo-size/Julien-Marcou/Unicode-Emoji?color=%23063a8d)
![Gzip Size](https://img.shields.io/bundlephobia/minzip/unicode-emoji?label=gzip%20size)
![No Dependency](https://img.shields.io/badge/dependencies-none-%23872a84)
![MIT License](https://img.shields.io/npm/l/unicode-emoji)

Raw data for Unicode Emoji 🙂

The data are generated using the `Unicode Emoji, Version 17.0` from [Unicode](https://home.unicode.org/emoji/about-emoji/).

You can learn more about emojis at [Emojipedia](https://emojipedia.org/) or find some implementation details and trivia on the [Wiki](https://github.com/Julien-Marcou/Unicode-Emoji/wiki).


## 👉 Demo

Check the generated [CSV file](https://github.com/Julien-Marcou/Unicode-Emoji/blob/master/unicode-emoji.csv).

Or just [take a look](https://emoji.julien-marcou.fr/) at what you can achieve using this package.


## 🔌 Installation

```shell
npm install unicode-emoji
```


## 🧰 Usage

This package is ESM-only. The recommended way to use it is with a bundler (e.g. webpack, esbuild, ...), which handles module resolution for you.

### With a bundler

Simply import it wherever you need it:

```javascript
import { ... } from 'unicode-emoji';
```

### Without a bundler

#### From Node.js

If you are targeting ESM, you can use the import syntax:

```javascript
import { ... } from 'unicode-emoji';
```

If you are targeting CommonJS, you don't have access to static import, so you'll need to use a dynamic import from an async function.

```javascript
async function importUnicodeEmoji() {
  const unicodeEmoji = await import('unicode-emoji');
  // ... do something
}

importUnicodeEmoji().catch((error) => console.error(error));
```

#### From a web browser

If you are not using a bundler, you'll need to expose the `/node_modules/unicode-emoji/index.js` file so it is accessible from the web, then import it in your HTML using a `module` script.

The simplest approach is to import the file directly:

```html
<script type="module">
  import { ... } from '/node_modules/unicode-emoji/index.js';
</script>
```

However, if you plan to re-use or share the package in other modules, I recommend you to use an [Import Map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap/), so that you can directly import the package using its name, just as you would with a bundler:

```html
<script type="importmap">
  {
    "imports": {
      "unicode-emoji": "/node_modules/unicode-emoji/index.js"
    }
  }
</script>

<script type="module">
  import { ... } from 'unicode-emoji';
</script>
```


## 📚 Documentation

### Retrieve emojis

```javascript
import { getEmojis } from 'unicode-emoji';

getEmojis();
```

```javascript
[
  {
    "emoji": "😀", // Emoji without skin tone variation
    "description": "grinning face",
    "version": "1.0",
    "keywords": ["face", "grin", "grinning face"],
    "category": "face-emotion",
    "group": "smileys-emotion",
    "subgroup": "face-smiling"
  },
  {
    "emoji": "👋", // Emoji with skin tone variations
    "description": "waving hand",
    "version": "0.6",
    "keywords": ["hand", "wave", "waving"],
    "category": "face-emotion",
    "group": "people-body",
    "subgroup": "hand-fingers-open",
    "variations": [
      {
        "emoji": "👋🏻",
        "description": "waving hand: light skin tone",
        "version": "1.0"
      },
      {
        "emoji": "👋🏼",
        "description": "waving hand: medium-light skin tone",
        "version": "1.0"
      },
      // ...
    ]
  },
  // ...
]
```

### Retrieve components

```javascript
import { getComponents } from 'unicode-emoji';

getComponents();
```

```javascript
{
  "skin-tone": [
    {
      "emoji": "🏻",
      "description": "light skin tone",
      "version": "1.0"
    },
    {
      "emoji": "🏼",
      "description": "medium-light skin tone",
      "version": "1.0"
    },
    // ...
  ],
  "hair-style": [
    {
      "emoji": "🦰",
      "description": "red hair",
      "version": "11.0"
    },
    {
      "emoji": "🦱",
      "description": "curly hair",
      "version": "11.0"
    },
    // ...
  ]
}
```

### Grouping & filtering

You can group & filter emojis by category, group, subgroup or version

Here is an example:

 - grouped by category
 - without emojis from the flags category
 - without emojis from the 0.6 & 0.7 versions
 - without emojis from all versions above version 12.0 (does not exclude emojis from the version 12.0)

```javascript
import { getEmojis, getEmojisGroupedBy } from 'unicode-emoji';

const groupBy = 'category';
const omitWhere = { versionAbove: '12.0', category: ['flags'], version: ['0.6', '0.7'] };

// Only omitting
getEmojis(omitWhere);

// Only grouping
getEmojisGroupedBy(groupBy);

// Grouping and omitting
getEmojisGroupedBy(groupBy, omitWhere);
```

Keep in mind that:

```javascript
const omitWhere = { versionAbove: '14.0' };
```

Is equivalent to:

```javascript
const omitWhere = { version: ['15.0', '15.1', '16.0', '17.0'] };
```

But you should always use the first one, as it will be future-proof for when new versions of `unicode-emoji` are released.

So that updating your dependencies will not opt you into newer emojis that are not yet supported on every platforms.


## 📋 Details

While complete data are available on GitHub:

 - `unicode-emoji.csv` provides complete flat data
 - `unicode-emoji.json` provides complete hierarchical data

Only the stripped-down `unicode-emoji.js` file is bundled within the NPM package to greatly reduce its size
