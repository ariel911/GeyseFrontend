import React from 'react';

const Locations = () => {
  const locations = [
    {
      city: 'SUCRE',
      address: 'Alborada 7ma etapa Mz 721 Villa 13',
      services: 'Servicios de recarga de extintores, venta de equipos de emergencia, monitoreos ocupacionales',
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d12976.300263903291!2d-65.30397416016982!3d-19.011637378395957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDAwJzQzLjgiUyA2NcKwMTgnNDcuMCJX!5e0!3m2!1ses!2sbo!4v1720294339069!5m2!1ses!2sbo'
    },
    {
      city: 'POTOSÍ',
      address: 'Km 12.5 Via Daule Plaza Milán',
      services: 'Servicios de recarga de extintores, venta de equipos de emergencia, monitoreos ocupacionales',
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d12976.300263903291!2d-65.30397416016982!3d-19.011637378395957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDAwJzQzLjgiUyA2NcKwMTgnNDcuMCJX!5e0!3m2!1ses!2sbo!4v1720294339069!5m2!1ses!2sbo'
    },
    {
      city: 'LA PAZ',
      address: 'Dirección de la nueva sucursal',
      services: 'Descripción de los servicios de la nueva sucursal',
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d12976.300263903291!2d-65.30397416016982!3d-19.011637378395957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDAwJzQzLjgiUyA2NcKwMTgnNDcuMCJX!5e0!3m2!1ses!2sbo!4v1720294339069!5m2!1ses!2sbo'
    }
  ];

  return (
    <section className="local">
      <div className="container w-50 m-auto text-center" id="local">
        <h1 className="fs-2 border-bottom border-3">Nuestras <span className="text-primary">Sucursales</span>.</h1>
      </div>
      <div className="container">
        <div className="row">
          {locations.map((location, index) => (
            <div className="col-lg-6 col-md-6 col-sm-12 p-2" key={index}>
              <h3 className="text-primary fs-5">{location.city}</h3>
              <p>{location.address}</p>
              <p>{location.services}</p>
              <iframe
                src={location.mapSrc}
                width="350"
                height="250"
                style={{ border: 0, margin: '0 auto' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Locations;
