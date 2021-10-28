export type Emoji = {
  emoji: string;
  description: string;
  version: Version;
};

export type BaseEmoji = Emoji & {
  keywords: string[];
  category: Category;
  group: Group;
  subgroup: Subgroup;
  variations?: EmojiVariation[],
};

export type EmojiComponent = Emoji;
export type EmojiVariation = Emoji;
export type Component = 'skin-tone'|'hair-style';
export type Category = 'face-emotion'|'food-drink'|'animals-nature'|'activities-events'|'person-people'|'travel-places'|'objects'|'symbols'|'flags';
export type Group = 'smileys-emotion'|'people-body'|'animals-nature'|'food-drink'|'travel-places'|'activities'|'objects'|'symbols'|'flags';
export type Subgroup = 'face-smiling'|'face-affection'|'face-tongue'|'face-hand'|'face-neutral-skeptical'|'face-sleepy'|'face-unwell'|'face-hat'|'face-glasses'|'face-concerned'|'face-negative'|'face-costume'|'cat-face'|'monkey-face'|'emotion'|'hand-fingers-open'|'hand-fingers-partial'|'hand-single-finger'|'hand-fingers-closed'|'hands'|'hand-prop'|'body-parts'|'person'|'person-gesture'|'person-role'|'person-fantasy'|'person-activity'|'person-sport'|'person-resting'|'family'|'person-symbol'|'animal-mammal'|'animal-bird'|'animal-amphibian'|'animal-reptile'|'animal-marine'|'animal-bug'|'plant-flower'|'plant-other'|'food-fruit'|'food-vegetable'|'food-prepared'|'food-asian'|'food-marine'|'food-sweet'|'drink'|'dishware'|'place-map'|'place-geographic'|'place-building'|'place-religious'|'place-other'|'transport-ground'|'transport-water'|'transport-air'|'hotel'|'time'|'sky-weather'|'event'|'award-medal'|'sport'|'game'|'arts-crafts'|'clothing'|'sound'|'music'|'musical-instrument'|'phone'|'computer'|'light-video'|'book-paper'|'money'|'mail'|'writing'|'office'|'lock'|'tool'|'science'|'medical'|'household'|'other-object'|'transport-sign'|'warning'|'arrow'|'religion'|'zodiac'|'av-symbol'|'gender'|'math'|'punctuation'|'currency'|'other-symbol'|'keycap'|'alphanum'|'geometric'|'flag'|'country-flag'|'subdivision-flag';
export type Version = '0.6'|'0.7'|'1.0'|'2.0'|'3.0'|'4.0'|'5.0'|'11.0'|'12.0'|'12.1'|'13.0'|'13.1'|'14.0';
export type GroupedBy = Category|Group|Subgroup|Version;
export type GroupEmojiBy = 'category'|'group'|'subgroup'|'version';
export type OmitEmojiWhere = {
  category?: Category[],
  group?: Group[],
  subgroup?: Subgroup[],
  version?: Version[],
  versionAbove?: Version,
};

export declare function getComponents(): Record<Component, EmojiComponent[]>;
export declare function getEmojis(omitBy?: OmitEmojiWhere): BaseEmoji[];
export declare function getEmojisGroupedBy<T extends GroupedBy = GroupedBy>(groupBy: GroupEmojiBy, omitWhere?: OmitEmojiWhere): Record<T, BaseEmoji[]>;
