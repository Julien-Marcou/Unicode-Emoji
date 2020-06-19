export interface Emoji {
  emoji: string;
  description: string;
  version: string;
}

export interface BaseEmoji extends Emoji {
  keywords: string[];
  category: string;
  group: string;
  subgroup: string;
  variations?: EmojiVariation[],
}

export interface EmojiComponent extends Emoji {
}

export interface EmojiVariation extends Emoji {
}

export type GroupEmojiBy = 'category'|'group'|'subgroup'|'version'
export type OmitEmojiWhere = Partial<Record<'category'|'group'|'subgroup'|'version', string[]>>;

export declare function getComponents(): Record<string, EmojiComponent[]>;
export declare function getEmojis(omitBy?: OmitEmojiWhere): BaseEmoji[];
export declare function getEmojisGroupedBy(groupBy: GroupEmojiBy, omitWhere?: OmitEmojiWhere): Record<string, BaseEmoji[]>;
