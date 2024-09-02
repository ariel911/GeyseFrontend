import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './main.css';
import img from '../../assets/user.png'
import axios from 'axios';
const Login = () => {
  const navigate = useNavigate();
  const [usuarioAcceso, setUsuarioAcceso] = useState('');
  const [clave, setClave] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);



  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!usuarioAcceso.includes('@')) {
        const res = await axios({
          url: "https://backendGeyse.onrender.com/auth/loginCliente",
          method: 'POST',
          data: {
            usuario_acceso: usuarioAcceso,
            clave: clave
          }
        });
        console.log("resdata",res.data.data)
        if (res.data.data) {
          setIsAuthenticated(true);
          
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("idCliente", res.data.data.cliente.id);
          navigate('/pagina/extintoresQr');
        } else {
          setError('Usuario o clave incorrectos');
        }
      } else {

        const res = await axios({
          url: "https://backendGeyse.onrender.com/auth/login",
          method: 'POST',
          data: {
            correo: usuarioAcceso,
            clave: clave
          }
        });
        if (res.data.data) {
          setIsAuthenticated(true);
          console.log("usuario:", res.data.data)
          localStorage.setItem("token", res.data.data.token);
          localStorage.setItem("idCliente", res?.data?.data?.usuario?.id);
          localStorage.setItem("usuarioId", res?.data?.data?.usuario?.id);
         
          navigate('/pagina/extintoresQr');
          //guardar localstorage para poder habilitar opcion para agregar inspecciones
        }
      }



    } catch (err) {
      console.error('Error fetching clientes:', err);
      setError('Error al iniciar sesión');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card mt-5">
              <div className="card-body">
                <h2 className="text-center">Login</h2>
                <div className='text-center mb-4'>
                  <img
                    src={img}
                    className='img-fluid'
                    alt='user icon'
                    style={{ maxWidth: '150px' }}
                  />
                </div>
                {error && <p className="text-danger">{error}</p>}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="usuarioAcceso" className="form-label">Usuario de Acceso</label>
                    <input
                      type="text"
                      className="form-control"
                      id="usuarioAcceso"
                      value={usuarioAcceso}
                      onChange={(e) => setUsuarioAcceso(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="clave" className="form-label">Clave</label>
                    <input
                      type="password"
                      className="form-control"
                      id="clave"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Ingresar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="row">
        <div className="col text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="mt-3">Cargando...</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
