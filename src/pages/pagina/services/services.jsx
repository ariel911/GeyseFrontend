import React from 'react';
import servicio1 from '../img/elaboracion de programas de seguridad2.jpg';
import servicio2 from '../img/segundaimagen.jpg';
import servicio3 from '../img/tipos extintores.jpg';
import servicio4 from '../img/MONITOREO.jpg';
import servicio5 from '../img/SISTEMACONTRAINCENDIO.jpg';

const Services = () => {
  const servicios = [
    { img: servicio1, title: 'Elaboración de programas de seguridad y salud en el trabajo PSST' },
    { img: servicio2, title: 'Capacitaciones', description: 'Manejo de extintores, primeros auxilios, evacuación.' },
    { img: servicio3, title: 'Recarga y mantenimiento de extintores' },
    { img: servicio4, title: 'Monitoreos Ocupacionales y Ambientales', description: 'Ruido, Iluminación, Ventilación, Calidad de Aire en interiores y exteriores, éstres térmico.' },
    { img: servicio5, title: 'Implementación de Sistemas Contra Incendios', description: 'Extintores y Alarmas contra Incendios.' }
  ];

  return (
    <section className="w-100 servicios" id="servicio">
      <div className="d-flex flex-column justify-content-center align-items-center pt-1 text-center w-50 m-auto" id="intro">
        <h1 className="fs-2 border-bottom border-3">Nuestros <span className="text-primary">Servicios</span>.</h1>
      </div>
      <div className="container mb-5 d-flex justify-content-center w-75">
        <div className="row justify-content-center" id="fila-servicios">
          {servicios.map((servicio, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center my-4" key={index}>
              <div className="card d-flex align-items-center text-center" style={{ width: '18rem' }}>
                <img src={servicio.img} className="card-img-top" alt={servicio.title} />
                <div className="card-body">
                  <h5 className="card-title">{servicio.title}</h5>
                  {servicio.description && <p className="card-text">{servicio.description}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
