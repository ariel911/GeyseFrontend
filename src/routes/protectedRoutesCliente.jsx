import React from 'react'
import { Navigate,Outlet } from 'react-router-dom'

const ProtectedRoutesCliente = () => {

    let isLogged =localStorage.getItem("idCliente")
    //console.log(isLogged.data.data.data)

    if(!isLogged){
       return <Navigate to="/pagia/login" />
    }
  return (
    <Outlet />//dar acceso a todas las rutas que estan envueltas por protectedRoutes
  )
}

export default ProtectedRoutesCliente
