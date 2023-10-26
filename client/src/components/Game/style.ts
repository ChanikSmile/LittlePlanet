/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

export const GameWrapper = styled.div`
	.container {
		margin: 40px 0px 40px 200px;
	}
	.game-item {
		display: flex;
		padding: 20px 20px;
	}
	.game-img img {
		width: 300px;
		height: auto;
		padding: 0px 20px 0px 20px;
	}
	.game-data {
		width: 500px;
		padding: 0px 20px 0px 20px;
	}
	.game-data p {
		padding: 0px;
		margin: 0px;
	}
	h2 {
		margin-top: 0px;
	}
	.info p {
		font-size: 2rem;
		padding: 0px 0px 0px 30px;
	}
	span.colored {
		color: #188eb7;
	}
	.btn-div-detail {
		margin: 10px;
	}
	.btn-div-play {
		margin: 10px;
	}
`;
export const GameLink = styled(NavLink)`
	text-decoration: none;
	}`;
