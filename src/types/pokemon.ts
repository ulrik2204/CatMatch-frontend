export type NameUrlPair = {
  name: string;
  url: string;
};

export type Ability = {
  ability: NameUrlPair;
  is_hidden: boolean;
  slot: number;
};

export type Item = {
  item: NameUrlPair;
};

export type Move = {
  move: NameUrlPair;
};

export type SimpleSprite = {
  front_default: string;
};

export type Sprites = SimpleSprite & {
  other: OtherSprites;
};

export type OtherSprites = {
  dream_world: SimpleSprite;
  "official-artwork": SimpleSprite;
};

export type TypeOfPokemon = {
  type: NameUrlPair;
};

export type Pokemon = {
  abilities: Ability[];
  base_experience: number;
  forms: NameUrlPair[];
  height: number;
  held_items: Item[];
  id: number;
  moves: Move[];
  name: string;
  species: NameUrlPair;
  sprites: Sprites;
  types: TypeOfPokemon[];
  weight: number;
};
