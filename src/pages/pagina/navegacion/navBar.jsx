import React, { useState } from 'react';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const closeNavbar = () => {
    setIsCollapsed(true);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light p-3 fixed-top " id="menu">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand" href="#carouselExample">
          <img src={logo} alt="Logo" height="70" width="180" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#carouselExample" onClick={closeNavbar}>Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#servicio" onClick={closeNavbar}>Servicios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#producto" onClick={closeNavbar}>Productos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#local" onClick={closeNavbar}>Sucursales</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pagina/login" onClick={closeNavbar}>Mis Extintores</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#seccion-contacto" onClick={closeNavbar}>Contactos</a>
            </li>
            {/* <li className="nav-item">
              <Link className="btn btn-primary" to="/login">Login</Link> 
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
