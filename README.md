# Unicode Emoji

[![NPM Package](https://img.shields.io/npm/v/unicode-emoji?label=release&color=%23cd2620&logo=npm)](https://www.npmjs.com/package/unicode-emoji)
[![Unicode Emoji v14.0](https://img.shields.io/badge/emoji-v14.0-yellow?logo=unicode&logoColor=yellow)](https://unicode.org/Public/emoji/14.0/)
[![GitHub Repository](https://img.shields.io/github/stars/Julien-Marcou/Unicode-Emoji?color=%23f5f5f5&logo=github)](https://github.com/Julien-Marcou/Unicode-Emoji)

![Downloads per Month](https://img.shields.io/npm/dm/unicode-emoji)
![Repository Size](https://img.shields.io/github/repo-size/Julien-Marcou/Unicode-Emoji?color=%23063a8d)
![Gzip Size](https://img.shields.io/bundlephobia/minzip/unicode-emoji?label=gzip%20size)
![No Dependency](https://img.shields.io/badge/dependencies-none-%23872a84)
![MIT License](https://img.shields.io/npm/l/unicode-emoji)

Raw data for Unicode Emoji 🙂

The data are generated using the `Unicode Emoji, Version 14.0` from [Unicode](https://home.unicode.org/emoji/about-emoji/).

You can learn more about emojis at [Emojipedia](https://emojipedia.org/) or find some implementation details and trivia on the [Wiki](https://github.com/Julien-Marcou/Unicode-Emoji/wiki).


## 👉 Demo

Check the generated [CSV file](https://github.com/Julien-Marcou/Unicode-Emoji/blob/master/unicode-emoji.csv).

Or just [take a look](https://emoji.julien-marcou.fr/) at what you can achieve using this package.


## 🔌 Installation

```shell
npm install unicode-emoji
```


## 🧰 Usage

This NPM package uses the ECMAScript Modules system, so the easiest way to use it, is with a Bundler (like WebPack), so you don't have to worry about how to make it available and import it.

### With a Bundler

You can simply import it wherever you need it :

```javascript
import * as unicodeEmoji from 'unicode-emoji';
```

### With Node.js

ES Modules are only supported since Node.js v14.

#### Targeting CommonJS

When targeting CommonJS, you don't have access to static import, so you'll have to use dynamic import :

```javascript
const unicodeEmoji = await import('unicode-emoji');
```

Also, you'll need to import it inside an async function, as top-level await is not supported for CommonJS.

#### Targeting ES Module

When setting `"type": "module"` inside your `package.json` or when importing it from a `.mjs` file, you can simply use the ES6 import syntax :

```javascript
import * as unicodeEmoji from 'unicode-emoji';
```

### From a web browser

If you are not using a bundler, you'll have to expose the `unicode-emoji/index.js` file so it is accessible from the web.

#### Using the full path

```html
<script type="module">
  import * as unicodeEmoji from '/node_modules/unicode-emoji/index.js';
</script>
```
#### Using Import Maps

[Import Maps](https://wicg.github.io/import-maps/) can be very useful when you have several dependencies between different modules, as it allows you to import modules using their names instead of their full path.

But they are not implemented in any browser yet, so you'll have to use a polyfill :

```html
<script async src="https://unpkg.com/es-module-shims@0.12.1/dist/es-module-shims.js"></script>
<script type="importmap-shim">
  {
    "imports": {
      "unicode-emoji": "/node_modules/unicode-emoji/index.js"
    }
  }
</script>
<script type="module-shim">
  import * as unicodeEmoji from 'unicode-emoji';
</script>
```


## 📚 Documentation

### Retrieve emojis

```javascript
unicodeEmoji.getEmojis();
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
unicodeEmoji.getComponents();
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

Here is an example :
 - grouped by category
 - without emojis from the flags category
 - without emojis from the 0.6 & 0.7 versions
 - without emojis from all versions above version 12.0 (does not exclude emojis from the version 12.0)

```javascript
const groupBy = 'category';
const omitWhere = { versionAbove: '12.0', category: ['flags'], version: ['0.6', '0.7'] };

// Only omitting
unicodeEmoji.getEmojis(omitWhere);

// Only grouping
unicodeEmoji.getEmojisGroupedBy(groupBy);

// Grouping and omitting
unicodeEmoji.getEmojisGroupedBy(groupBy, omitWhere);
```

Keep in mind that :

```javascript
const omitWhere = { versionAbove: '12.0' };
```

Is equivalent to :

```javascript
const omitWhere = { version: ['12.1', '13.0', '13.1', '14.0'] };
```

But you should always use the first one, as it will be future-proof for when new versions of `unicode-emoji` are released.

So that updating your dependencies will not opt you into newer emojis that are not yet supported on every platforms.


## 📋 Details

While complete data are available on GitHub :
 - `unicode-emoji.csv` provides complete flat data
 - `unicode-emoji.json` provides complete hierarchical data

Only the stripped-down `unicode-emoji.js` file is bundled within the NPM package to greatly reduce its size
