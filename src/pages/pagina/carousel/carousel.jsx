import React from 'react';
import c1 from "../img/extintore.webp";
import c2 from "../img/SISTEMACONTRAINCENDIO2.jpg";
import c3 from "../img/elaboracion de programas de seguridad.jpg";

const Carousel = () => {
  return (
    <div id="carouselExample" className="carousel slide mt-5" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active" data-bs-interval="3000">
          <img src={c1} className="d-block w-100 img-fluid" alt="Imagen 1" />
        </div>
        <div className="carousel-item" data-bs-interval="3000">
          <img src={c2} className="d-block w-100 img-fluid" alt="Imagen 2" />
        </div>
        <div className="carousel-item" data-bs-interval="3000">
          <img src={c3} className="d-block w-100 img-fluid" alt="Imagen 3" />
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Carousel;