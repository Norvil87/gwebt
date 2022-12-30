import { IPlayerState, ICard, CardType } from "../types";

// Ранжирование по силе от меньшей к большей
const rankUnits = (hand: ICard[]): ICard[] => {
  const units = hand.filter((card) => card.type === CardType.Unit);
  const totalStrength = units.reduce((score, unit) => (score += unit.strength), 0);
  units.sort((a, b) => (a.strength / totalStrength <= b.strength / totalStrength ? -1 : 1));

  console.log("rankUnits", units, totalStrength);

  return units;
};

export const playAI = (playerState: IPlayerState): ICard => {
  const rankedUnits = rankUnits(playerState.hand);

  return rankedUnits[0];
};
