import { useState } from 'react';
import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import AttrRules from '../components/AttrRules';
import AttrSuggest from '../components/AttrSuggest';
import AttrTable from '../components/AttrTable';

export default function HomePage() {
	const [state, setState] = useState({
		text: '',
	});

	const handleOnChange = (e: any, a: any) => {
		setState({ ...state, text: e });
	};
	return (
		<>
			<Container>
				<Row>
					<Col lg="4">
						<AttrRules />
					</Col>
					<Col lg="8">
						<Card>
							<CardBody>
								<AttrSuggest value={state.text} onChange={handleOnChange} />
                <AttrTable />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
