import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
	Table,
} from 'reactstrap';
import {
	Abbreviature,
	postAddAbbreviature,
	postDeleteAbbreviature,
	postEditAbbreviature,
} from '../services/api';
import style from './AttrDictionary.module.scss';

export default function AttrDictionary({ abbreviatures, toggleEdit, serverReload }: any) {
	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		const abbrev = abbreviatures?.find((abb: Abbreviature) => abb.id == id);
		window.message({
			text: `Esta seguro que desea eliminar la abreviatura ${abbrev?.abbreviature} (${abbrev?.description})?`,
			onAction: (accept: any) => {
				if (accept) {
					postDeleteAbbreviature(id).then((res) => {
						serverReload('all');
					});
				}
			},
		});
	};

	return (
		<>
			<Table size="sm" striped hover className={style.tableFixed}>
				<thead>
					<tr>
						<th>Abreviatura</th>
						<th>Nombre</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{abbreviatures?.map((e: Abbreviature) => (
						<tr key={`abbrev-${e.id}`}>
							<td>{e.abbreviature}</td>
							<td>{e.name}</td>
							<td>
								<div className="text-right">
									<Button
										data-id={e.id}
										outline
										size="sm"
										color="primary"
										className={style.action}
										onClick={toggleEdit}
									>
										<FontAwesomeIcon icon={faPencil} size="xs" />
									</Button>
									<Button
										data-id={e.id}
										outline
										size="sm"
										color="danger"
										className={style.action}
										onClick={handleDelete}
									>
										<FontAwesomeIcon icon={faTrash} size="xs" />
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export interface IEditModal {
	open: boolean;
	data?: {
		id: number;
		abbreviature?: string;
		description?: string;
	};
}

export function AbbrevEdit({ open, data, toggle }: any) {
	const [alert, setAlert] = useState<string | null>(null!);
	const [isNew, setIsNew] = useState(true);
	const [fields, setFields] = useState({ id: 0, name: '', abbreviature: '', description: '' });
	const [state, setState] = useState<any>({ fieldErrors: {} });

	useEffect(() => {
		setState({ ...state, fieldErrors: {} });
		setAlert(null!);
		setIsNew(!data);
		if (data) {
			setFields(data);
		} else {
			setFields({ id: 0, name: '', abbreviature: '', description: '' });
		}
	}, [data]);

	const handleSave = () => {
		const errors: any = {};
		if (fields.abbreviature?.length < 2) {
			errors.abbreviature = 'La abreviatura es muy corta';
		}
		if (fields.name?.length < 2) {
			errors.name = 'La descripción es demasiada corta';
		}

		if (Object.keys(errors).length) {
			setState({ ...state, fieldErrors: errors });
		} else {
			let postService = null;
			if (isNew) postService = postAddAbbreviature;
			else postService = postEditAbbreviature;

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
		let value = event?.target.value;
		//clear error state
		setState({ ...state, fieldErrors: { ...state.fieldErrors, [name]: undefined } });
		// update fields
		setFields({ ...fields, [name]: value });
	};

	const errors = state.fieldErrors;
	return (
		<Modal isOpen={open} toggle={toggle} unmountOnClose centered>
			<ModalHeader toggle={toggle}>
				{isNew ? 'Ingresa los datos de la nueva abreviatura' : 'Edicion de abreviatura'}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col>
						{alert && <Alert color="danger">{alert}</Alert>}
						<FormGroup>
							<Label>Abreviatura</Label>
							<Input
								type="text"
								data-name="abbreviature"
								value={fields.abbreviature}
								onChange={handleChange}
								invalid={!!errors.abbreviature}
							/>
							<FormFeedback>{errors.abbreviature}</FormFeedback>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormGroup>
							<Label>Nombre</Label>
							<Input
								type="text"
								data-name="name"
								value={fields.name}
								onChange={handleChange}
								invalid={!!errors.name}
							/>
							<FormFeedback>{errors.name}</FormFeedback>
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
