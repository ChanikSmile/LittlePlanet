/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

export const NavBarWrapper = styled.div`
	.nav-container {
		/* font-family: 'GowunDodum-Regular'; */
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: white;
		padding: 0rem 2rem;
		color: black;
	}

	.nav-container h1 {
		font-size: 1.5vw;
	}

	.nav-container ul {
		list-style: none;
		display: flex;
		gap: 1rem;
	}

	.nav-container li {
		cursor: pointer;
		transition: color 0.3s ease;
		margin: 2rem;
		font-size: 1.5vw;
	}

	.nav-container li:hover {
		color: #188eb7;
	}

	.main_logo img {
		width: 100px;
		height: auto;
	}
`;
