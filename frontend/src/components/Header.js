import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { logout } from '../actions/userActions'

library.add(faShoppingCart, faUser)

const cart = <FontAwesomeIcon icon={faShoppingCart} />
const user = <FontAwesomeIcon icon={faUser} />

const Header = () => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const logoutHandler = () => {
    dispatch(logout())
  }

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
              <Nav.Link
                href='/cart'
                style={{
                  textDecoration: 'none',
                  color: 'white',
                  opacity: 0.6,
                }}
              >
                {cart} Cart
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <NavDropdown.Item>
                    <Link to='/profile'>Profile</Link>
                  </NavDropdown.Item>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link
                  href='/login'
                  style={{
                    textDecoration: 'none',
                    color: 'white',
                    opacity: 0.6,
                    marginLeft: '24px',
                  }}
                >
                  {user} Sign in
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
