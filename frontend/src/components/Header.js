import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faShoppingCart, faUser)

const cart = <FontAwesomeIcon icon={faShoppingCart} />
const user = <FontAwesomeIcon icon={faUser} />

const Header = () => {
  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Navbar.Brand>Shop</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav style={{ marginLeft: 'auto' }} navbarScroll>
              <Nav.Link>
                <Link
                  to='/cart'
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    opacity: 0.6,
                  }}
                >
                  {cart} Cart
                </Link>
              </Nav.Link>
              <Nav.Link>
                <Link
                  to='/login'
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    opacity: 0.6,
                  }}
                >
                  {user} Sign in
                </Link>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
