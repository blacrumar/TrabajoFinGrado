

import React from 'react'



import {Link} from 'react-router-dom';

export const Error = () => {
  return (
    <div>
        <h1>ERROR 404</h1>

        <Link to="/welcome">Volver al inicio</Link>
        
    </div>
  )
}
