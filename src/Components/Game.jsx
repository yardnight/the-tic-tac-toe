import React from "react";
import Board from "./Board";
import History from "./History";
import MyModal from "./UI/MyModal/MyModal";
import SvgLogo from "../assets/logo.svg";

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
					position: { row: null, col: null },
					isActivate: false,
				},
			],
			stepNumber: 0,
			isExNext: true,
			isReverse: false,
			modal: false,
		};
	}

	clean() {
		this.state.history.map((h) => (h.isActivate = false));
	}

	jumpTo(step) {
		this.clean();
		const act = (step) => {
			this.state.history[step].isActivate = true;
		};
		// console.log(this.state.history);
		this.setState(
			{
				stepNumber: step,
				isExNext: step % 2 === 0,
				modal: false,
			},
			act(step)
		);
	}
	reverse() {
		this.setState({
			isReverse: !this.state.isReverse,
		});
	}

	showModal() {
		this.setState({
			modal: !this.state.modal,
		});
	}

	handleClick(i) {
		this.clean();
		function stepPosition(i) {
			const posMark = { row: null, col: null };
			let rowSqr;
			let colSqr;

			//define the row
			if (i < 3) {
				rowSqr = 1;
			} else if (i < 6) {
				rowSqr = 2;
			} else {
				rowSqr = 3;
			}
			//define the column
			if (i % 3 === 0) {
				colSqr = 1;
			} else if ((i - 1) % 3 === 0) {
				colSqr = 2;
			} else if ((i - 2) % 3 === 0) {
				colSqr = 3;
			}
			posMark.row = rowSqr;
			posMark.col = colSqr;
			return posMark;
		}

		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.isExNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
					position: stepPosition(i),
					isActivate: true,
				},
			]),
			stepNumber: history.length,
			isExNext: !this.state.isExNext,
		});
	}

	render() {
		let history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);
		let result;
		winner === null ? (result = false) : (result = true);

		// console.log(winner.winnerLine); // [1,2,3]

		let moves = history.map((step, move) => {
			// console.log(step)
			const desc = move
				? "Go to move #" +
				  move +
				  " > R: " +
				  step.position.row +
				  " C: " +
				  step.position.col
				: "Go to the game start";
			// const active = move === this.state.stepNumber ? "active" : "";
			const active =
				this.state.history[move].isActivate === true ? "active" : "";
			return (
				<li key={move}>
					<button
						className={active + " " + "mybutton"}
						onClick={() => this.jumpTo(move)}
					>
						{desc}
					</button>
				</li>
			);
		});
		let orderedMoves;
		!this.state.isReverse
			? (orderedMoves = moves)
			: (orderedMoves = moves.reverse());

		let status;
		if (result) {
			status = "Winner: " + winner.winnerName;
		} else if (!result && this.state.stepNumber === 9) {
			status = "Draw! Come again!";
		} else {
			status = "Next player: " + (this.state.isExNext ? "X" : "O");
		}
		// const [modal, setModal] = useState(false);
		return (
			<div className="game">
				<div className="gameBoard">
					<Board
						isWinner={result}
						winner={winner}
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="gameInfo">
					<div className="status">{status}</div>
					<button
						className="history"
						onClick={() => this.showModal()}
					>
						Game History
					</button>
					<div className="title">the Tic-Tac-Toe</div>
					<img src={SvgLogo} alt="logo" width="320" />
					<MyModal
						visible={this.state.modal}
						setVisible={() => this.showModal()}
					>
						<div className="options">
							<button
								className="reverse"
								onClick={() => this.reverse()}
							>
								Reverse
							</button>
							<History
								list={orderedMoves}
								showModal={this.showModal}
							/>
						</div>
					</MyModal>
				</div>
			</div>
		);
	}
}

export default Game;
function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (
			squares[a] &&
			squares[a] === squares[b] &&
			squares[a] === squares[c]
		) {
			return { winnerName: squares[a], winnerLine: lines[i] };
		}
	}
	return null;
}
