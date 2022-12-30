import React from "react";
import "./Row.scss";
import Card from "./Card";
import { Player, ICard } from "../types";
import { sortByStrength } from "../helpers";

interface IRowProps {
  cards: ICard[];
  player: Player;
}

class Row extends React.Component<IRowProps, {}> {
  calculateScore(): number {
    return this.props.cards.reduce((score, card) => (score += card.strength), 0);
  }

  render() {
    return (
      <div className="Row">
        <div className={`Score flex-centered ${this.props.player}`}>{this.calculateScore()}</div>
        <div className="Cards flex-centered">
          {sortByStrength(this.props.cards).map((card, index) => (
            <Card key={index} card={card} playable={false} />
          ))}
        </div>
      </div>
    );
  }
}

export default Row;
