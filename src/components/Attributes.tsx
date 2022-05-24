import { useEffect, useState } from 'react';
import { Attribute, getAttributeList } from '../services/api';
import AttrEdit, { IEditModal } from './AttrEdit';
import AttrSuggest from './AttrSuggest';
import AttrTable from './AttrTable';

export default function Attributes() {
	const [attributes, setAttributes] = useState<Attribute[] | null>(null);
	const [editModal, setEditModal] = useState<IEditModal>({ open: false });
	const [tglTable, setTglTable] = useState(false);
	const [state, setState] = useState({
		text: '',
	});

  useEffect(() => {
		serverAttributes();
	}, []);

	const serverAttributes = () => {
		return getAttributeList().then((attrs: Attribute[]) => setAttributes(attrs));
	};

	useEffect(() => {
		getAttributeList().then((attrs: Attribute[]) => setAttributes(attrs));
	}, []);

	const handleOnChange = (e: any) => {
		setState({ ...state, text: e });
	};

	const toggleTable = (toggle?: boolean) => {
		setTglTable(!!toggle);
	};

	const handleToggleEdit = (event?: any) => {
		const id = +event?.currentTarget.getAttribute('data-id');
		if (id) {
			const attr = attributes?.find((attr: any) => attr.id === id);
			setEditModal({ open: true, data: attr });
		} else setEditModal({ open: !editModal.open });
	};

	return (
		<>
			<AttrSuggest value={state.text} toggleTable={toggleTable} onChange={handleOnChange} />
			<AttrTable attributes={attributes} toggled={tglTable} toggleEdit={handleToggleEdit} />
			<AttrEdit toggle={handleToggleEdit} {...editModal} />
		</>
	);
}
