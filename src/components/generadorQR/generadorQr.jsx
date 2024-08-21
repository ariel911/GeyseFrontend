
import "./generador.css";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const QRCodeComponent = () => {
  const {extintorId} = useParams();
  
  const [extintor, setExtintor] = useState(null);

  useEffect(() => {
    fetch(`https://backendgeyse.onrender.com/api/extintor/${extintorId}`)
      .then(response => response.json())
      .then(data => setExtintor(data.data))
      .catch(error => console.error('Error fetching data:', error));
  }, [extintorId]);

  if (!extintor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Detalles del Extintor</h1>
      <p>Número de Serie: {extintor.id}</p>
     {/*  <p>Tipo: {extintor.tipo}</p> */}
      <p>Ubicación: {extintor.ubicacion}</p>
      <p>Estado: {extintor.estado}</p>
    </div>
  );
};

export default QRCodeComponent;
