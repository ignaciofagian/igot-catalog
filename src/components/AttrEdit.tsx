import { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Spinner,
} from 'reactstrap';
import { AttrParts, AttrResult, calculate } from '../utils/attrCalculator';
import style from './AttrEdit.module.scss';

export interface IEditModal {
	open: boolean;
	data?: {
		id: number;
		attribute?: string;
		name?: string;
		description?: string;
	};
}

export default function AttrEdit({ open, data, toggle }: any) {
	const [isNew, setIsNew] = useState(true);
	const [state, setState] = useState<any>({ loadingAttr: false, errors: null });
	const [fields, setFields] = useState<any>({ id: 0, abbreviature: '', description: '' });

	useEffect(() => {
		setIsNew(!data);
		if (data) {
			setFields(data);
		}
	}, [data]);

	const handleSave = () => {
		toggle();
	};

	const handleChange = (event: any) => {
		const name = event?.currentTarget.getAttribute('data-name');
		const value = event?.target.value;
		const customFields: any = {};
		if (name === 'name') {
			const attrResult: AttrResult = calculate(value);
			if (attrResult.status === 200) {
				const currentAttr = attrResult.parts?.map((e: AttrParts) => e.current).join('');
				if (currentAttr != fields.attribute) {
					customFields.attribute = '';
					setTimeout(() => {
						setState((prevState: any) => ({ ...prevState, loadingAttr: false }));
						setFields((prevFields: any) => ({
							...prevFields,
							attribute: currentAttr,
						}));
					}, 550);
					setState({ ...state, loadingAttr: true });
				}
			}
		}
		setFields({ ...fields, [name]: value, ...customFields });
	};

	return (
		<Modal isOpen={open} toggle={toggle} unmountOnClose centered>
			<ModalHeader toggle={toggle}>
				{isNew ? 'Ingresa los datos del atributo a agregar' : 'Edicion de atributo'}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col>
						<Label>Nombre (Max. 3 palabras)</Label>
						<Input data-name="name" type="text" value={fields.name} onChange={handleChange} />
					</Col>
				</Row>
				<Row>
					<Col>
						<div className={style.attribute}>
							{state.loadingAttr ? (
								<div className={style.loading}>
									<Spinner size="sm" />
									<span>Calculando atributo</span>
								</div>
							) : (
								<>
									<span>Atributo:</span> <span>{fields.attribute}</span>
								</>
							)}
						</div>
					</Col>
				</Row>
				<Row>
					<Col>
						<Label>Descripcion</Label>
						<Input
							data-name="description"
							type="text"
							value={fields.description}
							onChange={handleChange}
						/>
					</Col>
				</Row>
			</ModalBody>
			<ModalFooter>
				<Button color="light" onClick={toggle}>
					Cancelar
				</Button>
				<Button onClick={handleSave}>Guardar</Button>
			</ModalFooter>
		</Modal>
	);
}
