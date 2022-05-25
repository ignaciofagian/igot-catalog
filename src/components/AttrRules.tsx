import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { List, Card, CardTitle, Button } from 'reactstrap';
import { Abbreviature, getAbbreviatureList } from '../services/api';
import { store } from '../utils/attrCalculator';
import AttrDictionary, { AbbrevEdit } from './AttrDictionary';
import { IEditModal } from './AttrEdit';

export default function AttrRules({ serverReload, abbreviatures }: any) {
	const [editModal, setEditModal] = useState<IEditModal>({ open: false });

	useEffect(() => {
		serverReload('abbreviatures');
	}, []);

	useEffect(() => {
		store.abbreviatures = abbreviatures;
	}, [abbreviatures]);

	const handleToggleEdit = (event?: any) => {
		const id = +event?.currentTarget.getAttribute('data-id');
		if (id) {
			const abbrev = abbreviatures?.find((abb: Abbreviature) => abb.id === id);
			setEditModal({ open: true, data: abbrev });
		} else {
			serverReload('all');
			setEditModal({ open: !editModal.open });
		}
	};

	return (
		<Card body>
			<CardTitle tag="h5">
				<div className="d-flex">
					<div className="flex-grow-1">Reglas de codificacion </div>
					<Button outline size="sm" color="primary" onClick={handleToggleEdit}>
						<FontAwesomeIcon icon={faPlus} className="me-1" />
						Agregar nueva
					</Button>
				</div>
			</CardTitle>
			<List type="disc">
				<li>Reducir el nombre del atributo a un maximo de 3 palabras</li>
				<li>Reemplazar las palabras con las abreviaturas reservadas</li>
				<li>Si el nombre es menor a 10 caracteres no sufre modificaciones</li>
			</List>
			<div className="mb-1" />
			<AttrDictionary
				abbreviatures={abbreviatures}
				toggleEdit={handleToggleEdit}
				serverReload={serverReload}
			/>
			<AbbrevEdit toggle={handleToggleEdit} {...editModal} />
		</Card>
	);
}
