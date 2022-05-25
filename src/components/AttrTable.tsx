import { faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { Button, Table } from 'reactstrap';
import { Attribute, getAttributeList, postDeleteAttribute } from '../services/api';
import style from './AttrTable.module.scss';

export default function AttrTable({ attributes, toggled, toggleEdit, serverReload }: any) {
	const handleEdit = (event: any) => {
		toggleEdit(event);
	};

	const handleDelete = (event: any) => {
		const id = event.currentTarget.getAttribute('data-id');
		const attr = attributes?.find((attr: Attribute) => attr.id == id);
		window.message({
			text: `Esta seguro que desea eliminar la abreviatura ${attr?.attribute} (${attr?.description})?`,
			onAction: (accept: any) => {
				if (accept) {
					postDeleteAttribute(id).then((res) => {
						serverReload('attributes');
					});
				}
			},
		});
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
						<th>Descripción</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{attributes?.map((e: Attribute) => (
						<tr key={`attr-${e.id}`}>
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
