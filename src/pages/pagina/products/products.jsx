import React from 'react';
import exintores from "../img/extintores.png"
import senales from "../img/senales2.png"
import equipo from "../img/equipo.webp"
const Products = () => {
  return (
    <section className="productos">
      <div className="container w-50 m-auto text-center" id="producto">
        <h1 className=" fs-2 border-bottom border-3">Nuestros <span className="text-primary">Productos</span>.</h1>
      </div>
      <div className="container d-flex justify-content-center w-75 p-5">
        <div className="row justify-content-center" id="fila-productos">
          <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
            <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
              <img src={exintores} className="card-img-top" alt="..." height={150} />
              <div className="card-body">
                <h5 className="card-title">Extintores</h5>
                <p className="card-text">Venta de todo tipo de extintores.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
            <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
              <img src={senales} className="card-img-top" alt="..." height={150}  />
              <div className="card-body">
                <h5 className="card-title">Señales</h5>
                <p className="card-text">Señales de seguridad, para evacuación, emergencias.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
            <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
              <img src={equipo} className="card-img-top" alt="..." height={150} />
              <div className="card-body">
                <h5 className="card-title">Equipos de Emergencia</h5>
                <p className="card-text">Venta de equipos de emergencia.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Products;