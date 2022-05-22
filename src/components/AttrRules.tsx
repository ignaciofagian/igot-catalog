import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, ListInlineItem, Card, CardBody, CardTitle, Button } from 'reactstrap';
import AttrDictionary from './AttrDictionary';

export default function AttrRules() {
	return (
		<Card body>
			<CardTitle tag="h5">
				<div className="d-flex">
					<div className="flex-grow-1">Reglas de codificacion </div>
					<Button outline size="sm" color="primary">
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
			<AttrDictionary />
		</Card>
	);
}
