import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap'

const Header = () => {
    return (
        <header>
            <Navbar bg="dark" variant='dark' expand="lg" collapseOnSelect>
            <Container>
                <Navbar.Brand href="/">Shop </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                <Nav
                    style={{ marginLeft: 'auto' }}
                    navbarScroll
                >
                    <Nav.Link href="/cart"><i className='fas fa-shopping-cart' />Cart</Nav.Link>
                    <Nav.Link href="/login">Sign in</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
            </Navbar>
        </header>
    )
}

export default Header