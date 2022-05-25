import { useState } from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import Attributes from '../components/Attributes';
import AttrRules from '../components/AttrRules';
import { Abbreviature, Attribute, getAbbreviatureList, getAttributeList } from '../services/api';

export default function HomePage() {
	const [abbreviatures, setAbbreviatures] = useState<Abbreviature[] | null>(null);
	const [attributes, setAttributes] = useState<Attribute[] | null>(null);

	const serverAttributes = () => {
		return getAttributeList().then((attrs: Attribute[]) => setAttributes(attrs));
	};

	const serverAbbreviatures = () => {
		return getAbbreviatureList().then((abbs: Abbreviature[]) => setAbbreviatures(abbs));
	};

	const serverReload = (type: 'all' | 'abbreviatures' | 'attributes') => {
		if (type === 'all' || type === 'abbreviatures') {
			serverAbbreviatures();
		}
		if (type === 'all' || type === 'attributes') {
			serverAttributes();
		}
	};
	return (
		<>
			<Container>
				<Row>
					<Col lg="4">
						<AttrRules serverReload={serverReload} abbreviatures={abbreviatures} />
					</Col>
					<Col lg="8">
						<Card>
							<CardBody>
								<Attributes serverReload={serverReload} attributes={attributes} />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
