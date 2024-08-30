import React from 'react';
import logo from '../img/logo.png';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import '../main.css'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light p-3 fixed-top  " id="menu">
      <div className="container d-flex justify-content-between align-items-center ">
        <a className="navbar-brand" href="#carouselExample">
          <img src={logo} alt="Logo" height="70" width="180" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link" aria-current="page" href="#carouselExample">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#servicio">Servicios</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#producto">Productos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#local">Sucursales</a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pagina/login">Mis Extintores</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#seccion-contacto">Contactos</a>
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
