import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { Button, Table } from 'reactstrap';
import { Attribute, getAttributeList } from '../services/api';
import style from './AttrTable.module.scss';

export default function AttrTable({ attributes,  toggled, toggleEdit }: any) {
	const handleEdit = (event: any) => {
		toggleEdit(event);
	};

	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		console.log(id);
	};

	return (
		<div className="mt-3">
			<Table
				size="sm"
				striped
				hover
				className={classNames(style.tableFixed, { [style.toggled]: !toggled })}
			>
				<thead>
					<tr>
						<th>Atributo</th>
						<th>Nombre</th>
						<th>Descripcion</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{attributes?.map((e: Attribute) => (
						<tr key={e.id}>
							<td className={style.attribute}>{e.attribute}</td>
							<td>{e.name}</td>
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
		</div>
	);
}

function AttrEdit() {}
