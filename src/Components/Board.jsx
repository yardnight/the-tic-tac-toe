import Square from "./Square";
import React from "react";

class Board extends React.Component {
	isWinnerSquare(i) {
		if (
			this.props.isWinner &&
			this.props.winner.winnerLine.findIndex((item) => item === i) !== -1
		) {
			return true;
		} else {
			return null;
		}
	}

	renderSquare(i, uniq) {
		return (
			<Square
				winner={this.isWinnerSquare(i)}
				key={uniq}
				value={this.props.squares[i]}
				onClick={() => this.props.onClick(i)}
			/>
		);
	}

	render() {
		return (
			<div>
				{Array(3)
					.fill(null)
					.map((row, indexRow) => {
						return (
							<div key={indexRow} className="boardRow">
								{Array(3)
									.fill(null)
									.map((col, indexCol) => {
										return this.renderSquare(
											indexRow * 3 + indexCol,
											indexCol
										);
									})}
							</div>
						);
					})}
			</div>
		);
	}
}

export default Board;
