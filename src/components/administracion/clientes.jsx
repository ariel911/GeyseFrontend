
import "./clientes.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

const cliente = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [clientes, setclientes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre_cliente, setNombrecliente] = useState('');
  const [usuario_acceso, setusuario_acceso] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nombre_encargado, setnombre_encargado] = useState('');
  const [rol, setRol] = useState(0);
  const [fecha_registro, setfecha_registro] = useState('');
  const [clave, setClave] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    handleGetUsers();
    handleGetRoles();
    // Función para obtener la fecha y hora actual en el formato correcto
    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // Inicializa el estado con la fecha y hora actual
    setfecha_registro(getCurrentDateTime());
  }, []);


  useEffect(() => {
    if (selectedUser) {
      document.getElementById('nombre2').value = selectedUser.nombre_cliente || '';
      document.getElementById('nombre_encargado2').value = selectedUser.nombre_encargado || '';
      document.getElementById('fecha_registro2').value = selectedUser.fecha_registro || '';
      document.getElementById('clave2').value = selectedUser.clave || '';
      document.getElementById('usuario_acceso2').value = selectedUser.usuario_acceso || '';
      document.getElementById('codigo2').value = selectedUser.codigo || '';
    }
    handleGetUsers();

  }, [selectedUser]);

  //actualizar todo eso


  const handleGetUsers = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/cliente",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setclientes(res.data.data.clientes);
  };
  const handleGetRoles = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/rol",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRoles(res.data.data.rol);
  };

  //editar

  const handleEditUser = (user) => {
    document.getElementById('nombre2').defaultValue = '';
    document.getElementById('nombre_encargado2').defaultValue = '';
    document.getElementById('fecha_registro2').defaultValue = '';
    document.getElementById('clave2').defaultValue = '';
    document.getElementById('usuario_acceso2').defaultValue = '';
    document.getElementById('codigo2').defaultValue = '';
    setSelectedUser(user)

    setSelectedUser(prevState => ({
      ...prevState,
      fecha_registro: user.fecha_registro.slice(0, 16)
    }));

  };

  const handleDarReintegrar = async (cliente) => {
    await axios({
      url: `https://backendgeyse.onrender.com/api/cliente/baja/${cliente.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        estado: 1,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetUsers();
    swal({
      title: `Cliente ${cliente.nombre_cliente} reintegrado`,
      icon: "success",
      button: "Ok",
    });
  }
  const handleDarBaja = async (cliente) => {

    // Restablecer los campos del formulario
    await axios({
      url: `https://backendgeyse.onrender.com/api/cliente/baja/${cliente.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        estado: 0,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetUsers();
    swal({
      title: `Cliente ${cliente.nombre_cliente} dado de baja`,
      icon: "success",
      button: "Ok",
    });
  }
  const handleUpdateUser = async (e) => {

    e.preventDefault();
    try {
      await axios({
        url: `https://backendgeyse.onrender.com/api/cliente/${selectedUser.id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          nombre_cliente: document.getElementById('nombre2').value,
          nombre_encargado: document.getElementById('nombre_encargado2').value,
          fecha_registro: document.getElementById('fecha_registro2').value,
          clave: document.getElementById('clave2').value,
          usuario_acceso: document.getElementById('usuario_acceso2').value,
          codigo: document.getElementById('codigo2').value
        },
      });

      // Update the user in the local state
      const updatedclientes = clientes.map((cliente) =>
        cliente.id === selectedUser.id ? { ...cliente, ...selectedUser } : cliente
      );

      setclientes(updatedclientes);
      // Close the modal
      swal({
        title: "Cliente Editado Correctamente!",
        icon: "success",
        button: "Ok",
      });
      setSelectedUser(null);
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Realizar la solicitud para agregar el cliente
    try {
      const response = await axios.post(
        'https://backendgeyse.onrender.com/api/cliente',
        {
          nombre_cliente,
          nombre_encargado,
          fecha_registro,
          clave,
          estado: 1,
          codigo,
          usuario_acceso
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Limpiar los campos del formulario
      setNombrecliente('');
      setnombre_encargado('');
      setfecha_registro('');
      setusuario_acceso('');
      setCodigo('');
      setSelectedRole(null)
      setClave('');
      setRol(0);
      handleGetUsers();
      // Llamar a la función del padre para actualizar la lista de clientes
      swal({
        title: "Cliente Agregado!",
        /* text: "Por favor, completa todos los campos requeridos", */
        icon: "success",
        button: "Ok",
      });

      // Opcional: Mostrar una notificación o mensaje de éxito
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };


  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClientes = clientes?.filter(cliente =>
    cliente?.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cliente">
      <h1 className="titu4">Clientes</h1>

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">Agregar Cliente</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">Lista de Clientes</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">Clientes de Baja</button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
          <div className='nuevoCliente d-flex'>
            <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
              <div className='row row-cols-2 row-cols-md-3 row-cols-lg-4'>
                <div className="mb-3 col">
                  <label htmlFor="nombre" className="form-label">Cliente</label>
                  <input type="text" className="form-control" id="nombre" value={nombre_cliente} onChange={(e) => setNombrecliente(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="nombre_encargado" className="form-label">Encargado</label>
                  <input type="text" className="form-control" id="nombre_encargado" value={nombre_encargado} onChange={(e) => setnombre_encargado(e.target.value)} required />
                </div>
                <div className='mb-3 col'>
                  <label htmlFor="recipient-name" className="form-label">Fecha Registro</label>
                  <input type="datetime-local" className="form-control" value={fecha_registro} onChange={(e) => setfecha_registro(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="usuario_acceso" className="form-label">Usuario</label>
                  <input type="text" className="form-control " id="usuario_acceso" value={usuario_acceso} onChange={(e) => setusuario_acceso(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="clave" className="form-label">Password</label>
                  <input type="text" className="form-control" id="clave" value={clave} onChange={(e) => setClave(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="codigo" className="form-label">Codigo</label>
                  <input type="text" className="form-control" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                </div>
              </div>
              <div className="botones">
                <div>
                  <button type="submit" className="btn btn-primary botoncliente">Agregar</button>
                </div>

              </div>
            </form>
          </div>
        </div>

        <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">

          <form className="d-flex buscador" role="search">
            <input
              type="text"
              placeholder="Buscar por nombre de cliente..."
              value={searchTerm}
              onChange={handleChange}
              className="form-control me-2"
            />
          </form>
          <div className="b">
            <div className="table table-responsive tablaCliente">
              <table className="table table-sm">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Nº</th>
                    <th scope="col">Cod. Cliente</th>
                    <th scope="col">Cliente</th>
                    <th scope="col">Encargado</th>
                    <th scope="col">Registro</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes?.map((cliente, index) => cliente.estado == 1 && (
                    <tr key={cliente.id}>
                      <td>{index + 1}</td>
                      <td>{cliente?.codigo}</td>
                      <td>{cliente.nombre_cliente}</td>
                      <td>{cliente.nombre_encargado}</td>
                      <td>{cliente.fecha_registro.slice(0, 10)}</td>
                      <td className="accion">
                        <button className='btn btn-primary boton' data-bs-toggle="modal" data-bs-target="#modalEdit" data-bs-whatever="@mdo" onClick={() => handleEditUser(cliente)}>Editar</button>
                        <button className='btn btn-danger boton' onClick={() => handleDarBaja(cliente)}>Baja</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">

          <div className="table table-responsive tablaCliente">
            <table className="table table-fixed">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Cod. Cliente</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Encargado</th>
                  <th scope="col">Fecha Registro</th>
                  <th scope="col">Acción</th>
                </tr>
              </thead>
              <tbody>
                {clientes?.map((cliente, index) => cliente.estado == 0 && (
                  <tr key={cliente.id}>
                    <td>{index + 1}</td>
                    <td>{cliente?.codigo}</td>
                    <td>{cliente?.nombre_cliente}</td>
                    <td>{cliente?.nombre_encargado}</td>
                    <td>{cliente?.fecha_registro.slice(0, 10)}</td>
                    <td>
                      <button className='btn btn-danger boton2' onClick={() => handleDarReintegrar(cliente)}>Reintegrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      <div className='modal fade' id="modalEdit" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Editar cliente</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre" className="col-form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre2" name="nombre" defaultValue={selectedUser?.nombre_cliente} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="usuario_acceso" className="col-form-label">Usuario acceso</label>
                  <input type="text" className="form-control" id="usuario_acceso2" name="usuario_acceso" defaultValue={selectedUser?.usuario_acceso} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="clave" className="col-form-label">Clave</label>
                  <input type="text" className="form-control" id="clave2" name="clave" defaultValue={selectedUser?.clave} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="codigo" className="col-form-label">Codigo</label>
                  <input type="text" className="form-control" id="codigo2" name="codigo" defaultValue={selectedUser?.codigo} required />
                </div>
                <div className='mb-3 col'>
                  <label htmlFor="fecha_registro" className="form-label">Fecha Registro</label>
                  <input type="datetime-local" className="form-control" id="fecha_registro2" name="fecha_registro" defaultValue={selectedUser?.fecha_registro?.slice(0, 16)} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="nombre_encargado" className="col-form-label">Nombre encargado</label>
                  <input type="text" className="form-control" id="nombre_encargado2" name="nombre_encargado" defaultValue={selectedUser?.nombre_encargado} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="submit" className="btn btn-primary" onClick={handleUpdateUser} data-bs-dismiss="modal">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default cliente;