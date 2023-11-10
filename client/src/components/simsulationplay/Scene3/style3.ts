/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import background from '../../../assets/images/background.png';
import background2 from '../../../assets/images/background2.png';

export const Scene3Wrapper = styled.div`
	.background-image {
		background-image: url(${background});
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		width: 100%;
		height: 100vh;
	}
	.background-image2 {
		background-image: url(${background2});
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		width: 100%;
		height: 100vh;
	}
	.zoomed {
		transform: scale(2); /* 원하는 확대 비율을 지정 */
		transition: transform 1s; /* 원하는 애니메이션 시간을 지정 */
		transform-origin: 60% 80%;
	}
`;
