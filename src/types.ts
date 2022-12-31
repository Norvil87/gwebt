export enum CardType {
  Unit = "unit",
}

export enum CardRow {
  Melee = "melee",
  Range = "range",
  Siege = "siege",
}

export enum CardAbilities {
  None = "none",
  Medic = "medic", // not implemented
  Moral_Boost = "moral boost", // not implemented
  Spy = "spy", // not implemented
}

export enum Fraction {
  NorthernRealms = "Northern Realms",
}

export enum GameMode {
  Multi = "Multi",
  Single = "Single",
}

export enum AIAction {
  PlayCard = "playCard",
  Pass = "pass",
}

export interface ICard {
  name: string;
  fraction: Fraction;
  type: CardType;
  row: CardRow;
  strength: number;
  ability: CardAbilities;
  comment?: string;
}

export interface IPlayerState {
  name: string;
  fraction: Fraction;
  deck: ICard[];
  discard: ICard[];
  hand: ICard[];
  passed: boolean;
  totalScore: number;
  battlefield: IBattlefieldPlayerState;
}

interface IBattlefieldPlayerState {
  melee: ICard[];
  range: ICard[];
  siege: ICard[];
}

export interface IGameState {
  gameMode: GameMode;
  gameOver: boolean;
  message: string;
  activePlayer: Player;
  player1: IPlayerState;
  player2: IPlayerState;
}

export interface IAIResponse {
  action: AIAction;
  payload?: any;
}

export type Player = "player1" | "player2";
