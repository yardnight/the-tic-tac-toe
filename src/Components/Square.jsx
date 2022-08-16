import React from "react";

const Square = (props) => {
	return (
		<button
			className={props.winner ? "square gold" : "square"}
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
};

export default Square;
