import { useState, useEffect } from 'react';
import NavBar2 from '../../components/navBar/NavBar2';
import ImgPerfil from '../../components/imgPerfil/imgPerfil';
import './Home.css'
import logo from "../../assets/logo.png";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faDumbbell } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
const Home = ({ componente }) => {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('Rol');


  return (

    <>
      <div className='barraSup'>
        {/* <img src={logo} className='logo' /> */}
        <div className='imgPerfil'>
          <ImgPerfil />
          <div className='nombres'>
            <p className='span1'>{nombre}</p>
            <p className='span2'>{rol}</p>
          </div>

        </div>
        <Link to={'/homeInicio'}>
          <div className='geyseImagen'>
            <img src={logo} className='logoGeyse' />
          </div>
        </Link>
        <label htmlFor="nav_check" className='barraMenu' >

          <FontAwesomeIcon className='faBars ' icon={faBars} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
        </label>

      </div>
      <div className='centro'>
        <input type="checkbox" id='nav_check' hidden />

        <NavBar2 brand={['Inicio', 'Administración', 'Servicios', 'Inspecciones', 'Extintores','Reportes', 'Página','Cerrar sesión']} />
       
        {componente}

      </div>

    </>


  )
}

export default Home
