import React from "react";
import "./Game.scss";
import { defaultState } from "../data";
import { IGameState, Player, ICard, GameMode } from "../types";
import Consts from "../Consts";
import Card from "./Card";
import Row from "./Row";
import { sortByStrength } from "../helpers";
import { playAI } from "../AI/index";

interface IGameProps {
  defaultState: IGameState;
}

class Game extends React.Component<IGameProps, IGameState> {
  constructor(props: IGameProps) {
    super(props);

    this.state = defaultState;

    this.playCard = this.playCard.bind(this);
    this.initGame = this.initGame.bind(this);
  }

  componentDidMount(): void {
    this.initGame();
  }

  componentDidUpdate(): void {
    const isOver = this.checkGameOver();

    if (!isOver && this.state.gameMode === GameMode.Single && this.state.activePlayer === "player2") {
      const card = playAI(this.state.player2);
      setTimeout(() => this.playCard("player2", card), Consts.AI_TIMEOUT);
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
    console.log("playCard", player, card);
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

    return this.state[nextPlayer].hand.length > 0 ? nextPlayer : player;
  }

  checkGameOver(): boolean {
    if (this.state.gameOver) return true;
    if (this.state.player1.hand.length + this.state.player2.hand.length > 0) return false;

    let message: string;
    if (this.state.player1.totalScore > this.state.player2.totalScore) {
      message = `Игра завершена. Победил ${this.state.player1.name}`;
    } else if (this.state.player1.totalScore < this.state.player2.totalScore) {
      message = `Игра завершена. Победил ${this.state.player2.name}`;
    } else {
      message = "Игра завершена в ничью";
    }

    const updatedState = { ...this.state }; // посмотреть setState
    updatedState.message = message;
    updatedState.gameOver = true;
    this.setState(updatedState);

    return true;
  }

  render() {
    const { player1, player2, activePlayer, message } = this.state;

    return (
      <div className="Game">
        <div className="PlayerInfoContainer">
          <div className="PlayerInfo">
            <div className="PlayerAvatar"></div>

            <div className="PlayerDetails">
              <div className="PlayerName">{player2.name}</div>
              <div className="PlayerFraction">{player2.fraction}</div>
            </div>

            <div className="PlayerStatus flex-centered">{player2.hand.length}</div>
            <div className="PlayerScore flex-centered">{player2.totalScore}</div>
          </div>
          <div className="Log flex-centered">{message}</div>
          <div className="PlayerInfo">
            <div className="PlayerAvatar"></div>
            <div className="PlayerDetails">
              <div className="PlayerName">{player1.name}</div>
              <div className="PlayerFraction">{player1.fraction}</div>
            </div>
            <div className="PlayerStatus flex-centered">{player1.hand.length}</div>
            <div className="PlayerScore flex-centered">{player1.totalScore}</div>
          </div>
        </div>
        <div className="BattlefieldContainer">
          <div className={`Hand Hand--player2 ${this.state.activePlayer === "player2" ? "active" : ""}`}>
            {this.state.player2.hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                player="player2"
                playable={activePlayer === "player2"}
                playCard={this.playCard}
              />
            ))}
          </div>
          <Row cards={player2.battlefield.siege} player="player2" />
          <Row cards={player2.battlefield.range} player="player2" />
          <Row cards={player2.battlefield.melee} player="player2" />
          <Row cards={player1.battlefield.melee} player="player1" />
          <Row cards={player1.battlefield.range} player="player1" />
          <Row cards={player1.battlefield.siege} player="player1" />
          <div className={`Hand Hand--player1 ${this.state.activePlayer === "player1" ? "active" : ""}`}>
            {this.state.player1.hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                player="player1"
                playable={activePlayer === "player1"}
                playCard={this.playCard}
              />
            ))}
          </div>
        </div>
        <div className="DecksContainer">
          <div className="DeckContainer">
            <div className="Discard flex-centered">{player2.discard.length}</div>
            <div className="Deck flex-centered">{player2.deck.length}</div>
          </div>
          {this.state.gameOver && (
            <div className="Controls">
              <button onClick={this.initGame}>Начать игру</button>
            </div>
          )}
          <div className="DeckContainer">
            <div className="Discard flex-centered">{player1.discard.length}</div>
            <div className="Deck flex-centered">{player1.deck.length}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
