import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Typography, Button, Alert } from '@material-tailwind/react';
import { PhoneArrowUpRightIcon, SparklesIcon } from '@heroicons/react/24/outline';
import Button1 from 'components/common/Button';
import SimulationChat from 'components/simsulationplay/SimulationChat';
import { useRecoilValue } from 'recoil';
import { userEmail } from 'store/RecoilState';
import { CallGPT } from '../../gpt/gpt';
import { SeqThreeWrapper } from './style';

interface ISeqThreeProps {
	setStep: Dispatch<SetStateAction<number>>;
	setStatus: Dispatch<SetStateAction<number>>;
}

function SeqThree(props: ISeqThreeProps) {
	const { setStep, setStatus } = props;

	const [socket, setSocket] = useState<WebSocket | null>(null);

	const [alert, setAlert] = useState(true);

	// 사용자 음성 받아오기
	const [text, setText] = useState('');
	const [isWrong, setIsWrong] = useState(false);

	const [location, setLocation] = useState(true);

	const memberEmail = useRecoilValue(userEmail);

	useEffect(() => {
		// 소켓 연결 부분(ip주소 및 배포주소)
		const newSocket = new WebSocket('wss://k9c203.p.ssafy.io:17777');
		// const newSocket = new WebSocket('ws://192.168.100.36:7777');
		// const newSocket = new WebSocket('ws://192.168.100.38:7777');
		// const newSocket = new WebSocket('ws://localhost:7777');

		newSocket.onopen = () => {
			setSocket(newSocket);
			const handshake = {
				type: 'web',
				email: memberEmail,
			};
			newSocket.send(JSON.stringify(handshake));
		};

		// 받아온 메시지는 사용자 답변의 정답 여부
		newSocket.onmessage = (event) => {
			console.log(event.data);
		};

		newSocket.onclose = () => {
			console.log('WebSocket connection closed.');
		};

		const narr = setTimeout(() => {
			setAlert(false);
			newSocket.send(JSON.stringify({ type: 'narr', content: 2 }));
		}, 3000);

		return () => {
			newSocket.close();
			clearTimeout(narr);
		};
	}, []);

	useEffect(() => {
		console.log('GPT의 텍스트가 변경됬습니다.');
		if (text) {
			const prompt = {
				role: 'user',
				content: `1. [GOAL] : Let the firefighters know where you are. 2. [FIREFIGTER'S QUESTION] : 학생, 지금 어디에요? 3. [CHILD'S ANSWER] : ${text} ## Use the output in the JSON format. ##`,
			};
			CallGPT(prompt)
				.then((isAnswer) => {
					if (isAnswer) {
						const message = {
							type: 'page',
							content: 3,
						};
						socket?.send(JSON.stringify(message));
					} else {
						const message = {
							type: 'wrong',
						};
						setIsWrong(true);
						setText('');
						socket?.send(JSON.stringify(message));
					}
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}, [text]);

	console.log(text);

	console.log(isWrong);

	const testClick = () => {
		setStatus(3);
		setStep(4);
	};

	const changeLocation = () => {
		setLocation((prev) => !prev);
	};

	return (
		<SeqThreeWrapper>
			<Button onClick={changeLocation}>장소바꾸기</Button>
			<Button1 text="테스트버튼입니다." handleClick={() => testClick()} />
			{alert && (
				<div className="alert-container">
					<Alert>
						<Typography variant="h3">확인한 위치를 소방관에게 알려줘!</Typography>
					</Alert>
				</div>
			)}
			{!alert && !isWrong && <SimulationChat chatNumber={text ? 2 : 1} text={text || '거기 위치가 어디인가요?'} />}
			{isWrong && (
				<div className="wrong-container">
					<Alert className="flex justify-center" variant="gradient" open={isWrong} onClose={() => setIsWrong(false)}>
						<div className="flex flex-row m-3">
							<SparklesIcon className="w-10 h-10 mr-2" color="yellow" />
							<Typography variant="h3">이렇게 말해볼까?</Typography>
						</div>
						{location ? (
							<div className="flex flex-row items-center">
								<PhoneArrowUpRightIcon className="w-5 h-5 mr-2" />
								<Typography variant="h5">여기는 소행성로 203 근처에요.</Typography>
							</div>
						) : (
							<div className="flex flex-row items-center m-3">
								<PhoneArrowUpRightIcon className="w-7 h-7 mr-2" />
								<Typography variant="h5">여기는 삼성스토어 소행성지점 근처에요.</Typography>
							</div>
						)}
					</Alert>
				</div>
			)}
		</SeqThreeWrapper>
	);
}

export default SeqThree;
