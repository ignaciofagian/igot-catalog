import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Message, { MessageProps } from './components/Message';

const msgRef = React.createRef();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<App />
		<Message ref={msgRef} />
	</React.StrictMode>,
);

declare global {
	interface Window {
		message: any;
	}
}

window.message = (props: MessageProps | string) => {
	if (msgRef?.current) {
		(msgRef as any).current.show(props);
	}
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
