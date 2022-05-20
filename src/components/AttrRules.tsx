import { List, ListInlineItem, Card, CardBody, CardTitle } from 'reactstrap';
import AttrDictionary from './AttrDictionary';

export default function AttrRules() {
	return (
		<Card body>
			<CardTitle tag="h5">Reglas de codificacion</CardTitle>
			<List type="disc">
				<li>Reducir el nombre del atributo a un maximo de 3 palabras</li>
				<li>Reemplazar las palabras con las abreviaturas reservadas</li>
				<li>Si el nombre es menor a 10 caracteres no sufre modificaciones</li>
			</List>
			<div className="mb-2" />
			<AttrDictionary />
		</Card>
	);
}