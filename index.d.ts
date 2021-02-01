export type Emoji = {
  emoji: string;
  description: string;
  version: string;
};

export type BaseEmoji = Emoji & {
  keywords: string[];
  category: string;
  group: string;
  subgroup: string;
  variations?: EmojiVariation[],
};

export type EmojiComponent = Emoji;
export type EmojiVariation = Emoji;
export type GroupEmojiBy = 'category'|'group'|'subgroup'|'version'
export type OmitEmojiWhere = Partial<Record<'category'|'group'|'subgroup'|'version', string[]>>;

export declare function getComponents(): Record<string, EmojiComponent[]>;
export declare function getEmojis(omitBy?: OmitEmojiWhere): BaseEmoji[];
export declare function getEmojisGroupedBy(groupBy: GroupEmojiBy, omitWhere?: OmitEmojiWhere): Record<string, BaseEmoji[]>;
