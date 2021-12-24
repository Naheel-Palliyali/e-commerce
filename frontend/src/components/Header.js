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
              <Link
                to='/login'
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.6,
                  marginLeft: '24px',
                }}
              >
                {user} Sign in
              </Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
