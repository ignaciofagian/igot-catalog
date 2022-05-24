import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import {
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
	getAbbreviatureList,
	postAddAbbreviature,
	postDeleteAbbreviature,
	postEditAbbreviature,
} from '../services/api';
import { store } from '../utils/attrCalculator';
import style from './AttrDictionary.module.scss';

export default function AttrDictionary() {
	const [editModal, setEditModal] = useState<IEditModal>({ open: false });
	const [abbreviatures, setAbbreviatures] = useState<Abbreviature[] | null>(null);

	useEffect(() => {
		serverAbbreviatures();
	}, []);

	useEffect(() => {
		store.abbreviatures = abbreviatures;
	}, [abbreviatures]);

	const serverAbbreviatures = () => {
		return getAbbreviatureList().then((abbs: Abbreviature[]) => setAbbreviatures(abbs));
	};

	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		const abbrev = abbreviatures?.find((abb: Abbreviature) => abb.id == id);
		window.message({
			text: `Esta seguro que desea eliminar la abreviatura ${abbrev?.abbreviature} (${abbrev?.description})?`,
			onAction: (accept: any) => {
				if (accept) {
					postDeleteAbbreviature(id).then((res) => {
						serverAbbreviatures();
					});
				}
			},
		});
	};

	const handleToggleEdit = (event?: any) => {
		const id = +event?.currentTarget.getAttribute('data-id');
		if (id) {
			const abbrev = abbreviatures?.find((abb: Abbreviature) => abb.id === id);
			setEditModal({ open: true, data: abbrev });
		} else setEditModal({ open: !editModal.open });
	};

	return (
		<>
			<Table size="sm" striped hover className={style.tableFixed}>
				<thead>
					<tr>
						<th>Abreviatura</th>
						<th>Descripción</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{abbreviatures?.map((e: Abbreviature) => (
						<tr key={e.id}>
							<td>{e.abbreviature}</td>
							<td>{e.description}</td>
							<td>
								<div className="text-right">
									<Button
										data-id={e.id}
										outline
										size="sm"
										color="primary"
										className={style.action}
										onClick={handleToggleEdit}
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
			<AbbrevEdit toggle={handleToggleEdit} {...editModal} />
		</>
	);
}

interface IEditModal {
	open: boolean;
	data?: {
		id: number;
		abbreviature?: string;
		description?: string;
	};
}

function AbbrevEdit({ open, data, toggle }: any) {
	const [isNew, setIsNew] = useState(true);
	const [fields, setFields] = useState({ id: 0, abbreviature: '', description: '' });
	const [state, setState] = useState<any>({ fieldErrors: {} });

	useEffect(() => {
		setState({ ...state, fieldErrors: {} });
		setIsNew(!data);
		if (data) {
			setFields(data);
		}
	}, [data]);

	const handleSave = () => {
		const errors: any = {};
		if (fields.abbreviature?.length < 2) {
			errors.abbreviature = 'La abreviatura es demasiada corto';
		}
		if (fields.description?.length < 2) {
			errors.description = 'La descripcion es demasiada corto';
		}

		if (Object.keys(errors).length) {
			setState({ ...state, fieldErrors: errors });
		} else {
			let postService = null;
			if (isNew) postService = postAddAbbreviature;
			else postService = postEditAbbreviature;

			postService(fields).then(async (res) => {
				toggle();
			});
		}
	};

	const handleChange = (event: any) => {
		const name = event?.currentTarget.getAttribute('data-name');
		const value = event?.target.value;
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
						<FormGroup>
							<Label>Abreviatura</Label>
							<Input
								type="text"
								data-name="abbreviature"
								value={fields.abbreviature}
								onChange={handleChange}
							/>
							<FormFeedback>{errors.abbreviature}</FormFeedback>
						</FormGroup>
					</Col>
				</Row>
				<Row>
					<Col>
						<FormGroup>
							<Label>Descripcion</Label>
							<Input
								type="text"
								data-name="description"
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
