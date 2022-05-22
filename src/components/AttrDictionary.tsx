import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
	Table,
} from 'reactstrap';
import { Abbreviature, getAbbreviatureList } from '../services/api';
import style from './AttrDictionary.module.scss';

export default function AttrDictionary() {
	const [editModal, setEditModal] = useState<IEditModal>({ open: false });
	const [abbreviatures, setAbbreviatures] = useState<Abbreviature[] | null>(null);

	useEffect(() => {
		getAbbreviatureList().then((abbs: Abbreviature[]) => setAbbreviatures(abbs));
	}, []);

	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		console.log(id);
	};

	const handleToggleEdit = (event?: any) => {
		const id = +event?.currentTarget.getAttribute('data-id');
    debugger;
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
		name?: string;
	};
}

function AbbrevEdit({ open, data, toggle }: any) {
	const [isNew, setIsNew] = useState(true);
	const [state, setState] = useState<any>({ id: 0, abbreviature: '', description: '' });

	useEffect(() => {
		setIsNew(!data);
		if (data) {
			setState(data);
		}
	}, [data]);

	const handleSave = () => {
		toggle();
	};

	const handleChange = (event: any) => {
		const name = event?.currentTarget.getAttribute('data-name');
		const value = event?.target.value;
		setState({ ...state, [name]: value });
	};

	return (
		<Modal isOpen={open} toggle={toggle} unmountOnClose centered>
			<ModalHeader toggle={toggle}>
				{isNew ? 'Ingresa los datos de la nueva abreviatura' : 'Edicion de abreviatura'}
			</ModalHeader>
			<ModalBody>
				<Row>
					<Col>
						<Label>Abreviatura</Label>
						<Input
							data-name="abbreviature"
							type="text"
							value={state.abbreviature}
							onChange={handleChange}
						/>
					</Col>
				</Row>
				<Row>
					<Col>
						<Label>Descripcion</Label>
						<Input
							data-name="description"
							type="text"
							value={state.description}
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
