import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'

library.add(
    faStar,
    faStarHalfAlt,
    farStar
  );

const starFull = <FontAwesomeIcon color='orange' icon={faStar} />
const starHalf = <FontAwesomeIcon color='orange' icon={faStarHalfAlt} />
const star = <FontAwesomeIcon color='orange' icon={farStar} />

const Rating = ({ value, text }) => {
    return (
        <div className='rating'>
            <span>
                { value >= 1
                        ? starFull
                        : value >= 0.5
                        ? starHalf
                        : star
                }
            </span>
            <span>
                { value >= 2
                        ? starFull
                        : value >= 1.5
                        ? starHalf
                        : star
                }
            </span>
            <span>
                { value >= 3
                        ? starFull
                        : value >= 2.5
                        ? starHalf
                        : star
                }
            </span>
            <span>
                { value >= 4
                        ? starFull
                        : value >= 3.5
                        ? starHalf
                        : star
                }
            </span>
            <span>
                { value >= 5
                        ? starFull
                        : value >= 4.5
                        ? starHalf
                        : star
                }
            </span>
            
            <span className='count'>{ text && text }</span>
        </div>
    )
}

Rating.propTypes = {
    value: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
}

export default Rating
