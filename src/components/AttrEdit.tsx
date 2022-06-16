import { useEffect, useState } from 'react';
import {
	Alert,
	Button,
	Col,
	FormFeedback,
	FormGroup,
	Input,
	Label,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row,
	Spinner,
} from 'reactstrap';
import { postAddAttribute, postEditAttribute } from '../services/api';
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
	const [alert, setAlert] = useState<string | null>(null!);
	const [state, setState] = useState<any>({ loadingAttr: false, errors: null, fieldErrors: {} });
	const [fields, setFields] = useState<any>({ id: 0, attribute: '', name: '', description: '' });

	useEffect(() => {
		setAlert(null!);
		setState({ ...state, fieldErrors: {} });
		setIsNew(!data?.id);
		const nextData = Object.assign({ id: 0, attribute: '', name: '', description: '' }, data ?? {});
		if (!data?.id && data?.name) {
			const attrResult: AttrResult = calculate(data?.name);
			if (attrResult.status === 200) {
				const currentAttr = attrResult.parts?.map((e: AttrParts) => e.current).join('');
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
		setFields(nextData);
	}, [data]);

	const handleSave = () => {
		const errors: any = {};
		if (fields.name?.length < 2) {
			errors.name = 'El nombre es demasiado corto';
		}
		if (fields.description?.length < 2) {
			errors.description = 'La descripción es demasiada corta';
		}

		if (Object.keys(errors).length) {
			setState({ ...state, fieldErrors: errors });
		} else {
			let postService = null;
			if (isNew) postService = postAddAttribute;
			else postService = postEditAttribute;

			postService(fields).then(async (res: any) => {
				if (res.status === 200) {
					toggle();
				} else {
					setAlert(res.description);
				}
			});
		}
	};

	const handleChange = (event: any) => {
		const name = event?.currentTarget.getAttribute('data-name');
		const value = event?.target.value;
		const customFields: any = {};
		if (name === 'name') {
			const attrResult: AttrResult = calculate(value);
			if (attrResult.status === 200) {
				const currentAttr = attrResult.attribute;
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
		//clear error state
		setState({ ...state, fieldErrors: { ...state.fieldErrors, [name]: undefined } });
		// update field state
		setFields({ ...fields, [name]: value, ...customFields });
	};

	const errors = state.fieldErrors;
	return (
		<Modal isOpen={open} toggle={toggle} unmountOnClose centered>
			<ModalHeader toggle={toggle}>
				{isNew ? 'Ingresa los datos del atributo a agregar' : 'Edicion de atributo'}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col>
						{alert && <Alert color="danger">{alert}</Alert>}
						<FormGroup>
							<Label>Nombre (Max. 10 palabras)</Label>
							<Input
								type="text"
								invalid={!!errors.name}
								data-name="name"
								value={fields.name}
								onChange={handleChange}
							/>
							<FormFeedback>{errors.name}</FormFeedback>
						</FormGroup>
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
						<FormGroup>
							<Label>Descripción</Label>
							<Input
								type="text"
								data-name="description"
								invalid={!!errors.description}
								value={fields.description}
								onChange={handleChange}
							/>
							<FormFeedback>{errors.description}</FormFeedback>
						</FormGroup>
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
