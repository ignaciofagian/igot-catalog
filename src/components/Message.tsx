/* eslint-disable no-debugger */
import { useState, forwardRef, useImperativeHandle } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

export enum MessageType {
	Default = 'Default',
	Warning = 'Warning',
}
export interface MessageProps {
	title?: string;
	text?: string;
	onAction?(props: any): any | null;
	onClose?(): void;
	type: MessageType;
}

const defaultProps = {
	type: MessageType.Default,
	title: 'Alerta',
};

const Message = forwardRef((_, ref) => {
	const [open, setOpen] = useState(false);
	const [isClosing, setIsClosing] = useState<boolean>(false);
	const [state, setState] = useState<MessageProps>(defaultProps);

	useImperativeHandle(ref, () => ({
		show: (props: MessageProps | string) => {
			if (typeof props === 'string') {
				setState({ ...defaultProps, text: props });
			} else {
				setState({ ...defaultProps, ...props });
			}
			// if open same modal too fast require wait transition on close ends
			const delay = isClosing ? 250 : 1;
			setTimeout(() => setOpen(true), delay);
		},
	}));

	const handleResponse = (result: any) => {
		if (state.onAction) {
			state.onAction(result);
		}
		setOpen(false);
		setIsClosing(true);
	};

	const handleClose = () => {
		setIsClosing(false);
		if (state.onClose) {
			state.onClose();
		}
	};

	return (
		<Modal
			isOpen={open}
			unmountOnClose
			onClosed={handleClose}
			modalTransition={{ timeout: 200 }}
			toggle={() => handleResponse(false)}
			className={clx[state.type]?.modal}
		>
			<ModalHeader toggle={() => handleResponse(false)}>{state.title}</ModalHeader>
			<ModalBody>
				<p className="text-break">{state.text}</p>
			</ModalBody>
			<ModalFooter>
				<Button color="light" onClick={() => handleResponse(false)}>
					Close
				</Button>
				{state.onAction && (
					<Button color={clx[state.type]?.btn} onClick={() => handleResponse(true)}>
						Confirm
					</Button>
				)}
			</ModalFooter>
		</Modal>
	);
});

const clx = {
	Default: { modal: '', btn: 'primary' },
	Warning: { modal: 'modal-warning', btn: 'warning' },
};

export default Message;
