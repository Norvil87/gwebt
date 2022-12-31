import { IAIResponse, ICard, CardType, IGameState, AIAction } from "../types";

export class AIOpponent {
  constructor() {}

  public getAIResponse = (state: IGameState): IAIResponse => {
    const { player1, player2 } = state;

    const shouldPass = this.considerPassing(player1.passed, player1.totalScore, player2.totalScore);
    if (shouldPass) {
      return { action: AIAction.Pass };
    }

    const rankedUnits = this.rankUnits(player2.hand);

    return { action: AIAction.PlayCard, payload: rankedUnits[0] };
  };

  // Ранжирование по силе от меньшей к большей
  private rankUnits = (hand: ICard[]): ICard[] => {
    const units = hand.filter((card) => card.type === CardType.Unit);
    const totalStrength = units.reduce((score, unit) => (score += unit.strength), 0);
    units.sort((a, b) => (a.strength / totalStrength <= b.strength / totalStrength ? -1 : 1));

    return units;
  };

  // Спасовать, если спасовал противник и у тебя больше общее количество очков
  private considerPassing = (opponentPassed: boolean, opponentScore: number, ownScore: number): boolean => {
    return opponentPassed && ownScore > opponentScore;
  };
}
