import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { Button, Table } from 'reactstrap';
import { Abbreviature, getAbbreviatureList } from '../services/api';
import style from './AttrDictionary.module.scss';

export default function AttrDictionary() {
	const [abbreviatures, setAbbreviatures] = useState<Abbreviature[] | null>(null);

	useEffect(() => {
		getAbbreviatureList().then((abbs: Abbreviature[]) => setAbbreviatures(abbs));
	}, []);

	const handleEdit = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		console.log(id);
	};

	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		console.log(id);
	};

	return (
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
									onClick={handleEdit}
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
	);
}

function AttrEdit() {}
