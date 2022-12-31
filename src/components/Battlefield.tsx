import React from "react";
import "./Battlefield.scss";
import { Player, IPlayerState, ICard, GameMode } from "../types";
import Card from "./Card";
import Row from "./Row";

interface IBattlefieldProps {
  player1: IPlayerState;
  player2: IPlayerState;
  activePlayer: Player;
  message: string;
  gameOver: boolean;
  gameMode: GameMode;
  initGame: () => void;
  pass: (playerName: Player) => void;
  playCard: (player: Player, card: ICard) => void;
}

class Battlefield extends React.Component<IBattlefieldProps, {}> {
  render() {
    const { player1, player2, activePlayer, message, gameOver, gameMode, initGame, pass, playCard } = this.props;

    return (
      <div className="Game">
        <div className="PlayerInfoContainer">
          <div className="PlayerInfo">
            <div className="PlayerAvatar"></div>
            <div className="PlayerDetails">
              <div className="PlayerName">{player2.name}</div>
              <div className="PlayerFraction">{player2.fraction}</div>
            </div>
            <div>
              <div className="flex-centered">
                <div className="PlayerStatus flex-centered">{player2.hand.length}</div>
                <div className="PlayerScore flex-centered">{player2.totalScore}</div>
              </div>
              <div>
                {gameMode === GameMode.Multi && (
                  <button
                    className="passButton passButton--player2"
                    disabled={player2.passed || activePlayer !== "player2"}
                    onClick={() => pass("player2")}
                  >
                    Спасовать
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="Log flex-centered">{message}</div>

          <div className="PlayerInfo">
            <div className="PlayerAvatar"></div>
            <div className="PlayerDetails">
              <div className="PlayerName">{player1.name}</div>
              <div className="PlayerFraction">{player1.fraction}</div>
            </div>
            <div>
              <div className="flex-centered">
                <div className="PlayerStatus flex-centered">{player1.hand.length}</div>
                <div className="PlayerScore flex-centered">{player1.totalScore}</div>
              </div>
              <div>
                <button
                  className="passButton passButton--player1"
                  disabled={player1.passed || activePlayer !== "player1"}
                  onClick={() => pass("player1")}
                >
                  Спасовать
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="BattlefieldContainer">
          <div className={`Hand Hand--player2 ${activePlayer === "player2" ? "active" : ""}`}>
            {player2.hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                player="player2"
                playable={activePlayer === "player2"}
                playCard={playCard}
              />
            ))}
          </div>
          <Row cards={player2.battlefield.siege} player="player2" />
          <Row cards={player2.battlefield.range} player="player2" />
          <Row cards={player2.battlefield.melee} player="player2" />
          <Row cards={player1.battlefield.melee} player="player1" />
          <Row cards={player1.battlefield.range} player="player1" />
          <Row cards={player1.battlefield.siege} player="player1" />
          <div className={`Hand Hand--player1 ${activePlayer === "player1" ? "active" : ""}`}>
            {player1.hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                player="player1"
                playable={activePlayer === "player1"}
                playCard={playCard}
              />
            ))}
          </div>
        </div>

        <div className="DecksContainer">
          <div className="DeckContainer">
            <div className="Discard flex-centered">{player2.discard.length}</div>
            <div className="Deck flex-centered">{player2.deck.length}</div>
          </div>
          {gameOver && (
            <div className="Controls">
              <button onClick={initGame}>Начать игру</button>
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

export default Battlefield;
