import { useStyletron } from 'baseui'
import React from 'react'
import logobt from '../../assets/logobt.png'
import './styles.css'

const Waves = () => {
  const [css, theme] = useStyletron()
  return (
    <div
      className={css({
        backgroundColor: theme.colors.primaryB,
        marginTop: 'auto'
      })}
    >
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        <g className="parallax">
          <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(251,83,115,0.7" />
          <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(251,83,115,0.5)" />
          <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(251,83,115,0.3)" />
          <use xlinkHref="#gentle-wave" x="48" y="7" fill="#F65275" />
        </g>
      </svg>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '6vh',
          backgroundColor: '#F65275',
          width: '100%'
        })}
      >
        <img src={logobt} alt="Logo" width={100} height={16.27} />
      </div>
    </div>
  )
}

export default Waves