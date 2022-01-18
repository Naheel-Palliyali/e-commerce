import React from 'react'
import { Pagination } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination style={{ marginTop: '24px' }}>
        {[...Array(pages).keys()].map((x) => (
          <Pagination.Item active={x + 1 === page}>
            <Link
              key={x + 1}
              to={
                !isAdmin
                  ? keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
                  : `/api/admin/products/${x + 1}`
              }
              style={{ textDecoration: 'none', color: 'darkGrey' }}
            >
              {x + 1}
            </Link>
          </Pagination.Item>
        ))}
      </Pagination>
    )
  )
}

export default Paginate
