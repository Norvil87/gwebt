import { ICard } from "./types";

export const sortByStrength = (cards: ICard[]): ICard[] => {
  cards.sort((a, b) => (a.strength <= b.strength ? -1 : 1));

  return [...cards];
};
