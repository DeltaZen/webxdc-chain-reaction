// import * as React from 'react'
import PropTypes from 'prop-types'
import React from 'react'

const Ball = ({ color, clicksToBlow, className }) => {
  const ballStyle = {
    'background': `radial-gradient(circle at 30% 30%, ${color}, black)`,
    '--color': color,
  } as React.CSSProperties

  let classes = 'ball'
  if (!className) {
    if (clicksToBlow === 1)
      classes += ' shaking-more third-ball'

    else if (clicksToBlow === 2)
      classes += ' shaking second-ball'
  }
  else {
    classes += ` ${className}`
  }

  return (
    <figure
      className={classes}
      style={ballStyle}
    />
  )
}

Ball.propTypes = {
  color: PropTypes.string,
  clicksToBlow: PropTypes.number,
  className: PropTypes.string,
}

export default Ball
