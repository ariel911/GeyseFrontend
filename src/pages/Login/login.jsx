import './login.css';
import { useState } from 'react';
import axios from 'axios';
import img from '../../assets/user.png'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../../components/error/error'; // Adjust the path accordingly

function Login({ addToken, addUsuario }) {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    correo: "",
    clave: ""
  });
  
  const [token, setToken] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let newDatos = { ...datos, [name]: value };
    setDatos(newDatos);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!e.target.checkValidity()) {
        console.log("Formulario no válido");
      } else {
        const res = await axios({
          url: "https://backendGeyse.onrender.com/auth/login",
          method: 'POST',

          data: datos
        });

        setToken(res.data.data.token);
        addToken(res.data.data.token);
        addUsuario(res.data.data.usuario);

        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("nombre", res.data.data.usuario.nombre_usuario);
        localStorage.setItem("id", res.data.data.usuario.id);
        localStorage.setItem("Rol", res.data.data.usuario.rol.nombre_rol);

        navigate("/homeInicio");
        console.log("logeaste");
      }
    } catch (error) {
      setError("Acceso inválido. Por favor, inténtelo otra vez.");
    }
  }

  return (
    <div className='container'>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card mt-5">
            <div className="card-body">
              <h1 className="text-center">INICIAR SESIÓN</h1>
              <div className='text-center mb-4'>
                <img
                  src={img}
                  className='img-fluid'
                  alt='user icon'
                  style={{ maxWidth: '150px' }}
                />
              </div>

              {error && <ErrorMessage message={error} />}

              <form className="needs-validation" onSubmit={handleSubmit} noValidate>
                <div className="form-group was-validated mb-3">
                  <label className="form-label" htmlFor="email">Correo</label>
                  <input 
                    className="form-control" 
                    type="email" 
                    name='correo' 
                    onChange={handleInputChange} 
                    value={datos.correo} 
                    id="email" 
                    required 
                  />
                  <div className="invalid-feedback">
                    Por favor ingresa tu direccion de correo
                  </div>
                </div>
                <div className="form-group was-validated mb-4">
                  <label className="form-label" htmlFor="clave">Contraseña</label>
                  <input 
                    className="form-control" 
                    type="password" 
                    onChange={handleInputChange} 
                    name='clave' 
                    value={datos.clave} 
                    id="clave" 
                    required 
                  />
                  <div className="invalid-feedback">
                    Por favor ingresa tu contraseña
                  </div>
                </div>

                <div className='d-grid'>
                  <input className="btn btn-primary" type="submit" value="INGRESAR" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
