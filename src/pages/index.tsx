import { Card, CardBody, Container, Row, Col } from 'reactstrap';
import Attributes from '../components/Attributes';
import AttrRules from '../components/AttrRules';

export default function HomePage() {
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
								<Attributes />
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</>
	);
}
