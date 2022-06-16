import { useEffect, useState } from 'react';
import { Attribute, getAttributeList } from '../services/api';
import { store } from '../utils/attrCalculator';
import AttrEdit, { IEditModal } from './AttrEdit';
import AttrSuggest from './AttrSuggest';
import AttrTable from './AttrTable';

export default function Attributes({ attributes, serverReload }: any) {
	const [editModal, setEditModal] = useState<IEditModal>({ open: false });
	const [tglTable, setTglTable] = useState(false);
	const [state, setState] = useState({
		text: '',
	});

	useEffect(() => {
		serverReload('attributes');
	}, []);

	useEffect(() => {
		store.attributes = attributes;
	}, [attributes]);

	const handleOnChange = (e: any) => {
		setState({ ...state, text: e });
	};

	const toggleTable = (toggle?: boolean) => {
		setTglTable(!!toggle);
	};

	const handleToggleEdit = (event?: any, initialText?: string) => {
		const id = +event?.currentTarget.getAttribute('data-id');
		if (id) {
			const attr = attributes?.find((attr: any) => attr.id === id);
			setEditModal({ open: true, data: attr });
		} else {
			const customData: any = {};
			if (!editModal.open) {
				if (initialText) {
					customData.name = initialText;
				}
			} else {
				serverReload('attributes');
			}

			setEditModal({ open: !editModal.open, data: customData });
		}
	};

	return (
		<>
			<AttrSuggest
				value={state.text}
				toggleTable={toggleTable}
				onChange={handleOnChange}
				toggleEdit={handleToggleEdit}
			/>
			<AttrTable
				attributes={attributes}
				toggled={tglTable}
				toggleEdit={handleToggleEdit}
				serverReload={serverReload}
			/>
			<AttrEdit toggle={handleToggleEdit} {...editModal} />
		</>
	);
}
