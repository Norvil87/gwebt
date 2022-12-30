import React from "react";
import "./Card.scss";
import { ICard } from "../types";

interface ICardProps {
  card: ICard;
  playable: boolean;
  player?: string;
  playCard?: (player: string, card: ICard) => void;
}

interface ICardState {}

class Card extends React.Component<ICardProps, ICardState> {
  constructor(props: ICardProps) {
    super(props);
    this.playCard = this.playCard.bind(this);
  }

  playCard() {
    const { player, card, playable, playCard } = this.props;
    playCard && playable && playCard(player, card);
  }

  render() {
    const { playable, card } = this.props;

    return (
      <div
        style={{ cursor: playable ? "pointer" : "not-allowed" }}
        className={`Card ${card.name}-card`}
        onClick={this.playCard}
      ></div>
    );
  }
}

export default Card;
