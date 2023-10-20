/* eslint-disable @typescript-eslint/no-explicit-any */
export type PokemonMove = {
  accuracy: number | null;
  contest_combos: any;
  contest_effect: ContestEffect;
  contest_type: ContestType;
  damage_class: DamageClass;
  effect_chance: number | null;
  effect_changes: any[];
  effect_entries: EffectEntry[];
  flavor_text_entries: FlavorTextEntry[];
  generation: Generation;
  id: number;
  learned_by_pokemon: LearnedByPokemon[];
  machines: any[];
  meta: Meta;
  name: string;
  names: Name[];
  past_values: any[];
  power: any;
  pp: number;
  priority: number;
  stat_changes: any[];
  super_contest_effect: SuperContestEffect;
  target: Target;
  type: Type;
};

export type AbilityEffectChange = {
  effect_entries: EffectEntry[];
  version_group: VersionGroup;
};

export type ContestEffect = {
  url: string;
};

export type ContestType = {
  name: string;
  url: string;
};

export type DamageClass = {
  name: string;
  url: string;
};

export type EffectEntry = {
  effect: string;
  language: Language;
  short_effect: string;
};

export type Language = {
  name: string;
  url: string;
};

export type FlavorTextEntry = {
  flavor_text: string;
  language: Language2;
  version_group: VersionGroup;
};

export type Language2 = {
  name: string;
  url: string;
};

export type VersionGroup = {
  name: string;
  url: string;
};

export type Generation = {
  name: string;
  url: string;
};

export type LearnedByPokemon = {
  name: string;
  url: string;
};

export type Meta = {
  ailment: Ailment;
  ailment_chance: number;
  category: Category;
  crit_rate: number;
  drain: number;
  flinch_chance: number;
  healing: number;
  max_hits: number | null;
  max_turns: number | null;
  min_hits: number | null;
  min_turns: number | null;
  stat_chance: number;
};

export type Ailment = {
  name: string;
  url: string;
};

export type Category = {
  name: string;
  url: string;
};

export type Name = {
  language: Language3;
  name: string;
};

export type Language3 = {
  name: string;
  url: string;
};

export type SuperContestEffect = {
  url: string;
};

export type Target = {
  name: string;
  url: string;
};

export type Type = {
  name: string;
  url: string;
};
