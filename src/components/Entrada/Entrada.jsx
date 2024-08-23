
import axios from 'axios';
import { useState, useEffect } from 'react';
import './Entrada.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faFolder, faMoneyBillTrendUp, faDumbbell } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import Export from '../../components/export/export';

const Entrada = () => {
  /* const token = localStorage.getItem('token'); */
  const [extintores, setextintores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);


  const [sucursales, setSucursales] = useState([]);
  const [inspeccions, setinspeccions] = useState([]);
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    handleGetClientes();
    handleGetServicios();
    handleSucursales();
    handleinspeccions();
    handleextintors();
    handleGetServicios();
  }, []);
  const handleGetClientes = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/cliente",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setClientes(res.data.data.clientes);
  };
  const handleGetServicios = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/servicio",
      method: "GET",
      headers: {
      Authorization: `Bearer ${token}`,
    },  
    });
    setServicios(res.data.data.servicio);
  };

  const handleSucursales = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/sucursal",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setSucursales(res.data.data.sucursal);

  };
  const handleextintors = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/extintor",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setextintores(res.data.data.extintor);

  };
  const handleinspeccions = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/inspeccion",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setinspeccions(res.data.data.inspeccion);

  };
  // Inicializar contadores
  let activos = 0;
  let inactivos = 0;

  // Iterar sobre el array de extintores y contar los activos e inactivos
  extintores.forEach(extintor => {
    if (extintor.estado === 1) {
      activos++;
    } else {
      inactivos++;
    }
  });
  const clasificacion = {
    CO2: [],
    PQS: [],
    K: [],
    OTROS: []
  };

// Clasificar los extintores activos por tipo y contar el total de activos
let totalActivos = 0;

extintores.forEach(extintor => {
    if (extintor.estado === 1) {
        totalActivos++;
        const tipo = extintor.tipo.nombre_tipo.toUpperCase();
        if (clasificacion[tipo]) {
            clasificacion[tipo].push(extintor);
        } else {
            clasificacion.OTROS.push(extintor);
        }
    }
});
  // Calcular porcentajes
  const porcentajes = {
    CO2: (clasificacion.CO2.length / totalActivos) * 100,
    PQS: (clasificacion.PQS.length / totalActivos) * 100,
    K: (clasificacion.K.length / totalActivos) * 100,
    OTROS: (clasificacion.OTROS.length / totalActivos) * 100
  };
  return (
    <div className='contenidoEntrada'>
      <div className="tarjetas">
        <div className="tarjeta tarjeta1">
          <div className='grafico'>
            <FontAwesomeIcon className='icone' icon={faMoneyBillTrendUp} size="lg" style={{ color: "#ffffff", }} />
          </div>
          <div className='texto1'>
            <span>Extintores</span>
            <h2>{extintores.length}</h2>
          </div>
        </div>
        <div className="tarjeta tarjeta2">
          <div className='grafico'>
            <FontAwesomeIcon className='icone' icon={faUsers} size="lg" style={{ color: "#ffffff", }} />
          </div>
          <div className='texto1'>
            <span>Clientes</span>
            <h2>{clientes.length}</h2>
          </div>
        </div>
        <div className="tarjeta tarjeta3">
          <div className='grafico'>
            <FontAwesomeIcon className='icone' icon={faUsers} size="lg" style={{ color: "#ffffff", }} />
          </div>
          <div className='texto1'>
            <span>Sucursales</span>
            <h2>{sucursales.length}</h2>
          </div>
        </div>
        <div className="tarjeta tarjeta4">
          <div className='grafico'>
            <FontAwesomeIcon className='icone' icon={faUsers} size="lg" style={{ color: "#ffffff", }} />
          </div>
          <div className='texto1'>
            <span>Servicios</span>
            <h2>{servicios.length}</h2>
          </div>
        </div>


      </div>

      <div className='estadisticas'>
        <div className='barras'>
          <h3 >Estadisticas</h3>

          <h4>Extintores</h4>   <br />
          <div className='textoExtintores'>
            <span className='totalExtintores'>Total:{extintores.length}</span>
            <span className='activosExtintores'>Activos:{activos}</span>
            <span className='inactivosExtintores'>Inactivos:{inactivos}</span>
          </div>

          <div className='barra'>
            <div className='textoBarra'>
              <p>Tipo CO2</p>
              <p>{porcentajes.CO2.toFixed(2)}%</p>
            </div>
            <div className='progressBar'>
              <div style={{
                height: "100%",
                width: `${porcentajes.CO2.toFixed(2)}%`,
                backgroundColor: "rgba(56, 104, 208, 0.5)",
                transition: "width 0.5s",
                borderRadius: "15px",

              }}>
              </div>
            </div>

          </div>
          <div className='barra'>
            <div className='textoBarra'>
              <p>Tipo K</p>
              <p>{porcentajes.K.toFixed(2)}%</p>
            </div>
            <div className='progressBar'>
              <div style={{
                height: "100%",
                width: `${porcentajes.K.toFixed(2)}%`,
                backgroundColor: "rgba(56, 104, 208, 0.5)",
                transition: "width 0.5s",
                borderRadius: "15px"
              }}>
              </div>
            </div>

          </div>
          <div className='barra'>
            <div className='textoBarra'>
              <p>Tipo PQS</p>
              <p>{porcentajes.PQS.toFixed(2)}%</p>
            </div>
            <div className='progressBar'>
              <div style={{
                height: "100%",
                width: `${porcentajes.PQS.toFixed(2)}%`,
                backgroundColor: "rgba(56, 104, 208, 0.5)",
                transition: "width 0.5s",
                borderRadius: "15px"
              }}>
              </div>
            </div>

          </div>
          <div className='barra'>
            <div className='textoBarra'>
              <p>Otros</p>
              <p>{porcentajes.OTROS.toFixed(2)}%</p>
            </div>
            <div className='progressBar'>
              <div style={{
                height: "100%",
                width: `${porcentajes.OTROS.toFixed(2)}%`,
                backgroundColor: "rgba(56, 104, 208, 0.5)",
                transition: "width 0.5s",
                borderRadius: "15px"
              }}>
              </div>
            </div>

          </div>
          <div>
              <Export/>
          </div>
        </div>
      </div>

    </div>

  )
}

export default Entrada
