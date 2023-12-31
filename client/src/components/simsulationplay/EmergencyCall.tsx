import React, { useState, useEffect } from 'react';
// import { Button } from '@material-tailwind/react';
import { useRecoilValue } from 'recoil';
import api from '../../api';
import Scene1page from './Scene1/Scene1page';
import Scene2page from './Scene2/Scene2page';
import Scene3page from './Scene3/Scene3page';
import Scene4page from './Scene4/Scene4page';
import Scene5page from './Scene5/Scene5page';
import Intro from '../../assets/intro.mp4';
import { userEmail } from '../../store/RecoilState';
import bgMusic from '../../assets/music/simulation_music.mp3';
// import edMusic from '../../assets/music/ending_music.mp3';

function EmergencyCall() {
	document.body.style.overflow = 'hidden';
	// 시뮬레이션 씬 저장하기
	const [status, setStatus] = useState(0);

	// 멤버 이메일 가져오기
	const memberEmail = useRecoilValue(userEmail);

	// 인트로 불러오기.
	const fetchData = async () => {
		try {
			await api.get('/contents?type=11&num=0');
		} catch (e) {
			console.log(e);
		}
	};

	const [socket, setSocket] = useState<WebSocket | null>(null);

	useEffect(() => {
		fetchData();

		const newSocket = new WebSocket('wss://k9c203.p.ssafy.io:17777');
		// const newSocket = new WebSocket('ws://localhost:7777');

		newSocket.onopen = () => {
			console.log('WebSocket connection established.');
			setSocket(newSocket);

			// 소켓 열릴 때, 이메일 보내기
			const handShake = {
				type: 'web',
				email: memberEmail,
			};
			newSocket.send(JSON.stringify(handShake));
		};

		// 소켓에서 이벤트 발생 시 event.data.type이 page라면 페이지 넘기라는 신호
		newSocket.onmessage = (event) => {
			const eventMessage = JSON.parse(event.data);
			if (eventMessage.type === 'page') {
				setStatus(eventMessage.content);
			}
		};

		newSocket.onclose = () => {
			console.log('WebSocket connection closed.');
		};

		return () => {
			newSocket.close();
		};
	}, []);

	// Audio 객체를 상태로 관리
	const [audio] = useState(new Audio(bgMusic));

	useEffect(() => {
		// status 값에 따라 음악 재생 제어
		if (status >= 0 && status <= 4) {
			audio.volume = 0.5;
			audio.play().catch((error) => console.log('자동 재생 실패:', error));
		} else {
			audio.pause();
			audio.currentTime = 0; // 재생 위치를 처음으로 되돌림
		}
	}, [status, audio]);

	const sendKeypadMessage = () => {
		const message = {
			type: 'narr',
			content: 0,
		};
		if (socket) {
			socket.send(JSON.stringify(message));
		}
	};

	// const sendNextPageMessage = () => {
	// 	const message = {
	// 		type: 'page',
	// 		content: status + 1,
	// 	};
	// 	if (socket) {
	// 		socket.send(JSON.stringify(message));
	// 	}
	// };

	return (
		<>
			{/* <div style={{ position: 'absolute', zIndex: '9999' }}> */}
			{/* <Button onClick={sendNextPageMessage}> 다음 페이지 이동 </Button> */}
			{/* <Button onClick={sendKeypadMessage}> 인트로 끝남 </Button> */}
			{/* </div> */}
			{/* <Button onClick={sendKeypadMessage}> 인트로 끝남 </Button> */}
			{/* 1번부터 5번씬 차례대로 status에 따라 */}
			{status === 0 && (
				<video width="100%" height="auto" autoPlay onEnded={sendKeypadMessage}>
					<source src={Intro} type="video/mp4" />
					<track kind="captions" />
				</video>
			)}
			{status === 1 && <Scene1page />}
			{status === 2 && <Scene2page setStatus={setStatus} />}
			{status === 3 && <Scene3page />}
			{status === 4 && <Scene4page />}
			{status === 5 && <Scene5page />}
		</>
	);
}

export default EmergencyCall;
