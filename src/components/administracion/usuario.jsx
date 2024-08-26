
import "./usuario.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import Select from 'react-select';
import React, { useRef } from 'react';
const Usuario = () => {

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedRole2, setSelectedRole2] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre_usuario, setNombreUsuario] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [fecha_registro, setfecha_registro] = useState('');
  const [clave, setClave] = useState('');
  const [nuevaClave, setNuevaClave] = useState('');
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
      document.getElementById('nombre2').value = selectedUser.nombre_usuario || '';
      document.getElementById('apellido2').value = selectedUser.apellido || '';
      document.getElementById('correo2').value = selectedUser.correo || '';
      document.getElementById('fecha_registro2').value = selectedUser.fecha_registro || '';
    }
    handleGetUsers();

  }, [selectedUser]);

  //actualizar todo eso


  const handleGetUsers = async () => {
    const res = await axios({
      url: "https://backendgeyse.onrender.com/api/usuarios",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsuarios(res.data.data.usuarios);
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
    document.getElementById('apellido2').defaultValue = '';
    document.getElementById('correo2').defaultValue = '';
    document.getElementById('fecha_registro2').defaultValue = '';

    setSelectedUser(user)

    setSelectedRole2({
      value: user.rol.id,
      label: user.rol.nombre_rol
    });
    setSelectedUser(prevState => ({
      ...prevState,
      fecha_registro: user.fecha_registro.slice(0, 16)
    }));

  };


  const handleDarReintegrar = async (usuario) => {
    await axios({
      url: `https://backendgeyse.onrender.com/api/usuarios/baja/${usuario.id}`,
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
      title: `Usuario ${usuario.nombre_usuario} reintegrado`,
      icon: "success",
      button: "Ok",
    });
  }
  const handleDarEliminar = async (usuario) => {
    await axios({
      url: `https://backendgeyse.onrender.com/api/usuarios/baja/${usuario.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        estado: 3,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetUsers();
    swal({
      title: `Usuario ${usuario.nombre_usuario} Eliminado`,
      icon: "success",
      button: "Ok",
    });
  }
  const handleDarBaja = async (usuario) => {

    // Restablecer los campos del formulario
    await axios({
      url: `https://backendgeyse.onrender.com/api/usuarios/baja/${usuario.id}`,
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
      title: `Usuario ${usuario.nombre_usuario} dado de baja`,
      icon: "success",
      button: "Ok",
    });
  }
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    console.log("nombre", selectedRole2?.label)
    console.log("nombre", selectedUser.rol)
    console.log("n1", document.getElementById('nombre2').value)
    console.log("n", document.getElementById('apellido2').value)
    console.log("n", document.getElementById('fecha_registro2').value)
    console.log("n", document.getElementById('correo2').value)

    await axios({
      url: `https://backendgeyse.onrender.com/api/usuarios/${selectedUser.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        nombre_usuario: document.getElementById('nombre2').value,
        apellido: document.getElementById('apellido2').value,
        fecha_registro: document.getElementById('fecha_registro2').value,
        correo: document.getElementById('correo2').value,
        rolId: selectedRole2?.value,
      }
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });

    // Update the user in the local state
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === selectedUser.id ? { ...usuario, ...selectedUser, rol: { ...selectedUser.rol, nombre_rol: selectedRole2.label } } : usuario
    );
    console.log("usuarios:", usuarios)
    setUsuarios(updatedUsuarios);
    console.log("usuariosDespues:", usuarios)
    // Close the modal
    setSelectedUser(null);
    setSelectedRole2(null);
    handleGetUsers();
    swal({
      title: "Usuario Editado Correctamente!",
      icon: "success",
      button: "Ok",
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizar la solicitud para agregar el usuario
    try {
      const response = await axios.post(
        'https://backendgeyse.onrender.com/api/usuarios',
        {
          nombre_usuario,
          apellido,
          correo,
          fecha_registro,
          clave,
          estado: 1,
          rolId: selectedRole.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Limpiar los campos del formulario
      setNombreUsuario('');
      setApellido('');
      setfecha_registro('');
      setSelectedRole(null)
      setCorreo('');
      setClave('');

      handleGetUsers();
      // Llamar a la función del padre para actualizar la lista de usuarios
      swal({
        title: "Usuario Agregado!",
        /* text: "Por favor, completa todos los campos requeridos", */
        icon: "success",
        button: "Ok",
      });

      // Opcional: Mostrar una notificación o mensaje de éxito
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };


  const handleChange = (selectedOption) => {
    setSelectedRole(selectedOption);
  };

  const handleChange2 = (selectedOption) => {
    setSelectedRole2(selectedOption);
    console.log("user2", selectedOption)
  };

  const roleOptions = roles
    ?.filter(rol => rol.estado === 1) // Filtra los roles con estado 1
    .map((rol) => ({
      value: rol.id,
      label: rol.nombre_rol
    }));

  const handleChangeBuscador = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsuarios = usuarios?.filter(usuario =>
    usuario?.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleChangePassword = async (e) => {
    e.preventDefault();
    console.log("claven:", nuevaClave)
    console.log("usuario:", selectedUser.id)
    try {
      await axios({
        url: `https://backendgeyse.onrender.com/api/usuarios/cambiar-contrasena/${selectedUser.id}`,
        method:"PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          clave: nuevaClave,
        }
      });

      setNuevaClave('');
      swal({
        title: "Contraseña Actualizada!",
        icon: "success",
        button: "Ok",
      });
      handleGetUsers();
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };
  return (
    <div className="usuario">
      <h1 className="titu4">Usuarios</h1>

      <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">Agregar Usuario</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">Lista de Usuarios</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">Bajas</button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        {/* Pestaña Agregar */}
        <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
          <div className="NuevoUsuario d-flex">
            <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
                <div className="mb-3 col">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input type="text" className="form-control" id="nombre" value={nombre_usuario} onChange={(e) => setNombreUsuario(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input type="text" className="form-control" id="apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="recipient-name" className="form-label">Fecha Registro</label>
                  <input type="datetime-local" className="form-control" value={fecha_registro} onChange={(e) => setFechaRegistro(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="correo" className="form-label">Correo</label>
                  <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="clave" className="form-label">Password</label>
                  <input type="text" className="form-control" id="clave" value={clave} onChange={(e) => setClave(e.target.value)} required />
                </div>
                <div className="mb-3 col">
                  <label htmlFor="rol" className="form-label">Cargo</label>
                  <Select
                    id="rol"
                    value={selectedRole}
                    onChange={handleChange}
                    options={roleOptions}
                    placeholder="Seleccione"
                    className=""
                  />
                </div>
              </div>
              <div className="botones">
                <div>
                  <button type="submit" className="btn btn-primary botonUsuario">Agregar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/*   cambiar contraseña */}
        <div
          className="modal fade"
          id="changePasswordModal"
          tabIndex="-1"
          aria-labelledby="changePasswordModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="changePasswordModalLabel">Cambiar Contraseña</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleChangePassword}>
                  <div className="mb-3">
                    <label htmlFor="nuevaClave" className="form-label">Nueva Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="nuevaClave"
                      value={nuevaClave}
                      onChange={(e) => setNuevaClave(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* editar */}
        <div className={`modal fade`} id="modalEdit" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar Usuario</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
              </div>
              <div className="modal-body">
                <form >
                  <div className="mb-3">
                    <label htmlFor="nombre" className="col-form-label">Nombre:</label>

                    <input type="text" className="form-control" id="nombre2" name="nombre" defaultValue={selectedUser?.nombre_usuario} required />
                  </div>
                  <div className='mb-3 col'>
                    <label htmlFor="fecha_registro" className="form-label">Fecha Registro</label>
                    <input type="datetime-local" className="form-control" id="fecha_registro2" name="fecha_registro" defaultValue={selectedUser?.fecha_registro?.slice(0, 16)} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="apellido" className="col-form-label">Apellido:</label>

                    <input type="text" className="form-control" id="apellido2" name="apellido" defaultValue={selectedUser?.apellido} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="correo" className="col-form-label">Correo:</label>
                    <input type="text" className="form-control" id="correo2" name="correo" defaultValue={selectedUser?.correo} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="rol" className="form-label">Cargo</label>
                    <Select
                      id="rol"
                      value={selectedRole2}
                      onChange={handleChange2}
                      options={roleOptions}
                      placeholder="Seleccione"
                      closeMenuOnSelect={false}
                      className=""
                    />
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


        {/* Pestaña Lista de Usuarios */}
        <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">
          <form className="d-flex buscador" role="search">
            <input
              type="text"
              placeholder="Buscar Usuario..."
              value={searchTerm}
              onChange={handleChangeBuscador}
              className="form-control me-2"
            />
          </form>
          <div className="b">
            <div className="table table-responsive tabla">
              <table className="table table-sm">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Nº</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Registro</th>
                    <th scope="col">Cargo</th>
                    <th scope="col">Accesos</th>
                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios
                    ?.filter(usuario => usuario.estado === 1 && usuario.rol.estado === 1) // Filtrar usuarios activos con rol activo
                    .map((usuario, index) => (
                      <tr key={usuario.id}>
                        <td>{index + 1}</td> {/* Numeración basada en la lista filtrada */}
                        <td>{usuario.nombre_usuario}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.fecha_registro.slice(0, 10)}</td>
                        <td>{usuario?.rol?.nombre_rol}</td>
                        <td>{usuario.rol? usuario.rol.menu_rols.map(menus=> menus.menu.nombre_menu).join(', '): 'No tiene accesos'}</td>
                        <td className="accion">
                          <button className="btn btn-primary boton" data-bs-toggle="modal" data-bs-target="#modalEdit" data-bs-whatever="@mdo" onClick={() => handleEditUser(usuario)}>Editar</button>
                          <button className="btn btn-danger boton" onClick={() => handleDarBaja(usuario)}>Baja</button>
                          <button
                            type="button"
                            className="btn btn-secondary boton2"
                            data-bs-toggle="modal"
                            data-bs-target="#changePasswordModal"
                            onClick={() => handleEditUser(usuario)}
                          >
                            Cambiar Clave
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* Pestaña Bajas */}
        <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
          <div className="b">
            <div className="table table-responsive tabla">
              <table className="table table-sm">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Nº</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Registro</th>
                    <th scope="col">Cargo</th>
                    <th scope="col">Accesos</th>

                    <th scope="col">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios
                    ?.filter(usuario => usuario.estado === 0) // Filtrar usuarios con estado 0
                    .map((usuario, index) => (
                      <tr key={usuario.id}>
                        <td>{index + 1}</td> {/* Numeración basada en la lista filtrada */}
                        <td>{usuario.nombre_usuario}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.correo}</td>
                        <td>{usuario.fecha_registro.slice(0, 10)}</td>
                        <td>{usuario?.rol?.nombre_rol}</td>
                        <td>{usuario.rol? usuario.rol.menu_rols.map(menus=> menus.menu.nombre_menu).join(', '): 'No tiene accesos'}</td>
                        <td className="accion">
                          <button className="btn btn-success boton2" onClick={() => handleDarReintegrar(usuario)}>Reintegrar</button>
                          <button className="btn btn-danger boton2" onClick={() => handleDarEliminar(usuario)}>Eliminar</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div >

  );
};

export default Usuario;