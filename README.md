# Unicode Emoji

Raw data for Unicode Emoji 🙂

The data are generated using the `Unicode Emoji, Version 13.0` from [Unicode](https://home.unicode.org/emoji/about-emoji/)  

You can learn more about emojis at [Emojipedia](https://emojipedia.org/)

## 👉 Demo

[Here](http://emoji.julien-marcou.fr/) is an example of what you can achieve using this package


## 🔌 Installation

```shell
npm install unicode-emoji
```

## 🧰 Usage

### Import

```typescript
// With Typescript
import * as unicodeEmoji from 'unicode-emoji';
```

```javascript
// With Node.js
const unicodeEmoji = require('unicode-emoji');
```

### Retrieve emojis

```javascript
unicodeEmoji.getEmojis();
```
```json
[
    {
        "emoji": "😀",
        "description": "grinning face",
        "version": "1.0",
        "keywords": ["face", "grin", "grinning face"],
        "category": "face-emotion",
        "group": "smileys-emotion",
        "subgroup": "face-smiling"
    },
    {
        "emoji": "👋",
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
                ...
            }
        ]
    },
    {
        ...
    }
]
```

### Retrieve components

```javascript
unicodeEmoji.getComponents();
```

```json
{
    "skin-tone": [
        {
            "emoji": "🏻",
            "description": "light skin tone",
            "version": "1.0"
        },
        {
            ...
        }
    ],
    "hair-style": [
        {
            "emoji": "🦰",
            "description": "red hair",
            "version": "11.0"
        },
        {
            ...
        }
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

Only the stripped-down `unicode-emoji.min.json` file is bundled within this NPM package to greatly reduce its size
