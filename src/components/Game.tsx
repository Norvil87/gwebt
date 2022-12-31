import React from "react";
import { defaultState } from "../data";
import { IGameState, Player, ICard, IAIResponse, GameMode, AIAction } from "../types";
import Consts from "../Consts";
import Battlefield from "./Battlefield";
import { sortByStrength } from "../helpers";
import { AIOpponent } from "../AI/index";

interface IGameProps {
  defaultState: IGameState;
}

class Game extends React.Component<IGameProps, IGameState> {
  opponent: AIOpponent;

  constructor(props: IGameProps) {
    super(props);

    this.state = defaultState;
    if (defaultState.gameMode === GameMode.Single) {
      this.opponent = new AIOpponent();
    }

    this.playCard = this.playCard.bind(this);
    this.initGame = this.initGame.bind(this);
    this.pass = this.pass.bind(this);
  }

  componentDidMount(): void {
    this.initGame();
  }

  componentDidUpdate(): void {
    const isOver = this.checkGameOver();

    if (!isOver && this.state.gameMode === GameMode.Single && this.state.activePlayer === "player2") {
      const AIResponse = this.opponent.getAIResponse(this.state);
      setTimeout(() => this.playAI(AIResponse), Consts.AI_TIMEOUT);
    }
  }

  playAI(data: IAIResponse) {
    const { action, payload } = data;

    switch (action) {
      case AIAction.PlayCard:
        this.playCard("player2", payload);
        break;

      case AIAction.Pass:
        this.pass("player2");
        break;

      default:
        return;
    }
  }

  initGame() {
    const { player1, player2 } = this.props.defaultState;

    const firsHandPl1 = [];
    const firsHandPl2 = [];
    const firstDeckPl1 = [...player1.deck];
    const firstDeckPl2 = [...player2.deck];
    for (let i = 0; i < Consts.INIT_HAND_SIZE; i++) {
      const rand1 = Math.floor(Math.random() * firstDeckPl1.length);
      const rand2 = Math.floor(Math.random() * firstDeckPl2.length);

      firsHandPl1.push(firstDeckPl1[rand1]);
      firsHandPl2.push(firstDeckPl2[rand2]);

      firstDeckPl1.splice(rand1, 1);
      firstDeckPl2.splice(rand2, 1);
    }

    const initState = JSON.parse(JSON.stringify(this.props.defaultState));

    initState.message = `Первым ходит ${player1.name}`;
    initState.player1.hand = sortByStrength(firsHandPl1);
    initState.player1.deck = firstDeckPl1;
    initState.player2.hand = sortByStrength(firsHandPl2);
    initState.player2.deck = firstDeckPl2;

    this.setState(initState);
  }

  playCard(player: Player, card: ICard) {
    const { row, strength, name } = card;
    const hand = [...this.state[player].hand];
    const battlefield = { ...this.state[player].battlefield };
    const updatedState = { ...this.state };
    battlefield[row].push(card);
    hand.splice(hand.indexOf(card), 1);
    const activePlayer = this.setActivePlayer(player);
    const message = `${this.state[player].name} сыграл ${name}. Ходит ${this.state[activePlayer].name}`;

    updatedState[player].hand = hand;
    updatedState[player].battlefield = battlefield;
    updatedState[player].totalScore += strength;
    updatedState.activePlayer = activePlayer;
    updatedState.message = message;

    this.setState(updatedState);
  }

  setActivePlayer(player: Player): Player {
    const nextPlayer = player === "player1" ? "player2" : "player1";
    const isNextPlayerPlayable = this.state[nextPlayer].hand.length > 0 && !this.state[nextPlayer].passed;

    return isNextPlayerPlayable ? nextPlayer : player;
  }

  checkGameOver(): boolean {
    const { gameOver, player1, player2 } = this.state;
    if (gameOver) return true;

    const canNotProceed =
      (player1.passed && player2.passed) ||
      (player1.hand.length === 0 && player2.passed) ||
      (player2.hand.length === 0 && player1.passed) ||
      player1.hand.length + player2.hand.length === 0;

    if (canNotProceed) {
      let message: string;
      if (player1.totalScore > player2.totalScore) {
        message = `Игра завершена. Победил ${player1.name}`;
      } else if (player1.totalScore < player2.totalScore) {
        message = `Игра завершена. Победил ${player2.name}`;
      } else {
        message = "Игра завершена в ничью";
      }

      const updatedState = { ...this.state }; // посмотреть setState
      updatedState.message = message;
      updatedState.gameOver = true;
      this.setState(updatedState);

      return true;
    }

    return false;
  }

  pass(playerName: Player) {
    const updatedState = { ...this.state };
    updatedState[playerName].passed = true;
    updatedState.activePlayer = playerName === "player1" ? "player2" : "player1";
    updatedState.message = `${playerName} спасовал`;

    this.setState(updatedState);
  }

  render() {
    const { player1, player2, activePlayer, message, gameOver, gameMode } = this.state;

    return (
      <Battlefield
        player1={player1}
        player2={player2}
        activePlayer={activePlayer}
        message={message}
        gameOver={gameOver}
        gameMode={gameMode}
        initGame={this.initGame}
        pass={this.pass}
        playCard={this.playCard}
      />
    );
  }
}

export default Game;
