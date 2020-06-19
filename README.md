# Unicode Emoji

Raw data for Unicode Emoji 🙂

The data are generated using the `Unicode Emoji, Version 13.0` from [Unicode](https://home.unicode.org/emoji/about-emoji/)  

You can learn more about emojis at [Emojipedia](https://emojipedia.org/) or find some implementation details and trivia on the [Wiki](https://github.com/Julien-Marcou/Unicode-Emoji/wiki)

## 👉 Demo

Check the generated [CSV file](https://github.com/Julien-Marcou/Unicode-Emoji/blob/master/unicode-emoji.csv)

Or just [take a look](https://emoji.julien-marcou.fr/) of what you can achieve using this package


## 🔌 Installation

```shell
npm install unicode-emoji
```

## 🧰 Usage

### Import

This NPM package uses the ES6 import syntax (you'll need Node.js v14+ if you are not using TypeScript)

```javascript
import * as unicodeEmoji from 'unicode-emoji';
```

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
        "emoji": "👋", // Emoji with skin tone variation
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

You can group & filter emojis  by category, group, subgroup or version

Here is an example :
 - grouped by category
 - without the emojis from the flags category
 - without the emojis from the 12.1 & 13.0 versions

```javascript
const groupBy = 'category';
const omitWhere = { category: ['flags'], version: ['12.1', '13.0'] };

// Only omitting
unicodeEmoji.getUnicodeEmojis(omitWhere)

// Grouping and omitting
unicodeEmoji.getUnicodeEmojisGroupedBy(groupBy, omitWhere);
```


## 📋 Details

While complete data are available on GitHub :
 - `unicode-emoji.csv` provides complete flat data
 - `unicode-emoji.json` provides complete hierarchical data

Only the stripped-down `unicode-emoji.js` file is bundled within this NPM package to greatly reduce its size
