import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ keyword, title, description }) => {
  return (
    <Helmet>
      <meta charset='utf-8' />
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keyword} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: 'Welcome to SHOP',
  description: 'We sell the best products for irresistible prices',
  keywords: 'electronics, buy electronics, cheap electronics',
}

export default Meta
