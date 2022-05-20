import {
	Collapse,
	Nav,
	Navbar,
	NavbarBrand,
	NavbarText,
	NavbarToggler,
	NavItem,
	NavLink,
} from 'reactstrap';

export default function Layout({ children }: any) {
	return (
		<div>
			<AppNavBar />
			{children}
		</div>
	);
}

function AppNavBar() {
	return (
		<div className="mb-3">
			<Navbar color="primary" expand="md" dark className="pt-1 pb-1">
				<NavbarBrand href="/">Catalogo</NavbarBrand>
				<NavbarToggler onClick={function noRefCheck() {}} />
				<Collapse navbar>
					<Nav className="me-auto" navbar>
						<NavItem>
							<NavLink href="/">Atributos</NavLink>
						</NavItem>
					</Nav>
					<NavbarText>SIT</NavbarText>
				</Collapse>
			</Navbar>
		</div>
	);
}
