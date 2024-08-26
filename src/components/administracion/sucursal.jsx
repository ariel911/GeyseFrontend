import "./sucursal.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
const sucursal = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedClientes, setSelectedCliente] = useState(null);
    const [sucursals, setsucursals] = useState([]);
    const [nombre_sucursal, setNombresucursal] = useState('');
    const [codigo, setCodigo] = useState('');
    const [nombre_encargado, setnombre_encargado] = useState('');
    const [clientes, setClientes] = useState(null);
    const [ubicacion, setubicacion] = useState('');
    const [fecha_registro, setfecha_registro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClienteEdit, setSelectedClienteEdit] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        handleGetUsers();

        handleGetClientes();
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
            document.getElementById('nombre2').value = selectedUser.nombre_sucursal || '';
            document.getElementById('nombre_encargado2').value = selectedUser.nombre_encargado || '';
            document.getElementById('ubicacion2').value = selectedUser.ubicacion || '';
            document.getElementById('fecha_registro2').value = selectedUser.fecha_registro || '';
            document.getElementById('codigo2').value = selectedUser.codigo || '';

        }
        handleGetUsers();
        handleGetClientes();
    }, [selectedUser]);

    //actualizar todo eso


    const handleGetUsers = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/sucursal",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setsucursals(res.data.data.sucursal);
    };
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
    //editar

    const handleEditUser = (user) => {
        document.getElementById('nombre2').defaultValue = '';
        document.getElementById('nombre_encargado2').defaultValue = '';
        document.getElementById('ubicacion2').defaultValue = '';
        document.getElementById('fecha_registro2').defaultValue = '';
        document.getElementById('codigo2').defaultValue = '';

        setSelectedUser(user);

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_registro: user.fecha_registro.slice(0, 16)
        }));


        // Verificar si user tiene clienteId definido y nombre_cliente
        if (user.cliente.nombre_cliente) {
            setSelectedClienteEdit({
                value: user.cliente.id,
                label: user.cliente.nombre_cliente
            });
        } else {
            setSelectedClienteEdit(null); // Si no hay cliente asociado, puedes manejar este caso como desees
        }
    };


    const handleDarEliminar = async (sucursal) => {
        await axios({
            url: `https://backendgeyse.onrender.com/api/sucursal/baja/${sucursal.id}`,
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
            title: `Sucursal ${sucursal.nombre_sucursal} Eliminado`,
            icon: "success",
            button: "Ok",
        });

    }
    const handleDarReintegrar = async (sucursal) => {
        await axios({
            url: `https://backendgeyse.onrender.com/api/sucursal/baja/${sucursal.id}`,
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
            title: `Sucursal ${sucursal.nombre_sucursal} reintegrado`,
            icon: "success",
            button: "Ok",
        });

    }
    const handleDarBaja = async (sucursal) => {

        // Restablecer los campos del formulario
        await axios({
            url: `https://backendgeyse.onrender.com/api/sucursal/baja/${sucursal.id}`,
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
            title: `Sucursal ${sucursal.nombre_sucursal} dado de baja`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleUpdateUser = async (e) => {

        e.preventDefault();
        try {
            await axios({
                url: `https://backendgeyse.onrender.com/api/sucursal/${selectedUser.id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    nombre_sucursal: document.getElementById('nombre2').value,
                    nombre_encargado: document.getElementById('nombre_encargado2').value,
                    fecha_registro: document.getElementById('fecha_registro2').value,
                    ubicacion: document.getElementById('ubicacion2').value,
                    codigo: document.getElementById('codigo2').value,
                    clienteId: selectedClienteEdit.value
                },
            });

            // Update the user in the local state
            const updatedsucursals = sucursals.map((sucursal) =>
                sucursal.id === selectedUser.id ? { ...sucursal, ...selectedUser } : sucursal
            );

            setsucursals(updatedsucursals);
            // Close the modal
            setSelectedUser(null);
            swal({
                title: "Sucursal Editado Correctamente!",
                icon: "success",
                button: "Ok",
            });
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Realizar la solicitud para agregar el sucursal
        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/sucursal',
                {
                    nombre_sucursal,
                    nombre_encargado,
                    ubicacion,
                    fecha_registro,
                    estado: 1,
                    codigo,
                    clienteId: selectedClientes.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Limpiar los campos del formulario
            setNombresucursal('');
            setnombre_encargado('');
            setfecha_registro('');
            setCodigo('');
            setubicacion('');
            setSelectedCliente(null)
            handleGetUsers();
            // Llamar a la función del padre para actualizar la lista de sucursals
            swal({
                title: "Sucursal Agregado!",
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
        setSelectedCliente(selectedOption);
    };

    const ClientesOptions = clientes
        ?.filter(cliente => cliente.estado === 1) // Filtra los clientes con estado 1
        .map((cliente) => ({
            value: cliente.id,
            label: cliente.nombre_cliente
        }));


    const handleChangeBuscador = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredSucursales = sucursals?.filter(sucursal =>
        sucursal?.nombre_sucursal?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleChangeClienteEdit = (selectedOption) => {
        setSelectedClienteEdit(selectedOption);
    };

    return (
        <div className="sucursal">
            <h1 className="titu4">Sucursales</h1>

            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">
                        Agregar Sucursal
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">
                        Lista de Sucursales
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">
                        Sucursales de Baja
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
                    <div className="nuevoSucursal d-flex">
                        <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4">
                                <div className="mb-3 col">
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="nombre" value={nombre_sucursal} onChange={(e) => setNombresucursal(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="nombre_encargado" className="form-label">Encargado</label>
                                    <input type="text" className="form-control " id="nombre_encargado" value={nombre_encargado} onChange={(e) => setnombre_encargado(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Fecha Registro</label>
                                    <input type="datetime-local" className="form-control" value={fecha_registro} onChange={(e) => setfecha_registro(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                                    <input type="text" className="form-control " id="ubicacion" value={ubicacion} onChange={(e) => setubicacion(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="codigo" className="form-label">Código</label>
                                    <input type="text" className="form-control" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="sucursal" className="form-label">Cliente</label>
                                    <Select
                                        id="sucursal"
                                        value={selectedClientes}
                                        onChange={handleChange}
                                        options={ClientesOptions}
                                        placeholder="Seleccione"
                                        className=""
                                    />
                                </div>
                            </div>
                            <div className="botones">
                                <div className="">
                                    <button type="submit" className="btn btn-primary botonsucursal">
                                        Agregar
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

                <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">
                    <form className="d-flex buscador" role="search">
                        <input
                            type="text"
                            placeholder="Buscar sucursal..."
                            value={searchTerm}
                            onChange={handleChangeBuscador}
                            className="form-control me-2"
                        />
                    </form>
                    <div className="table table-responsive tablaSucursal">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Sucursal</th>
                                    <th scope="col">Encargado</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col">Registro</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSucursales
                                    ?.filter((sucursal) => sucursal?.estado === 1 && sucursal?.cliente?.estado === 1) // Filtrar sucursales activas y clientes activos
                                    .map((sucursal, index) => (
                                        <tr key={sucursal.id}>
                                            <td>{index + 1}</td> {/* Numeración basada en la lista filtrada */}
                                            <td>{sucursal?.nombre_sucursal}</td>
                                            <td>{sucursal?.nombre_encargado}</td>
                                            <td>{sucursal?.ubicacion}</td>
                                            <td>{sucursal?.fecha_registro?.slice(0, 10)}</td>
                                            <td className="accion">
                                                <button className='btn btn-primary boton' data-bs-toggle="modal" data-bs-target="#modalEdit" data-bs-whatever="@mdo" onClick={() => handleEditUser(sucursal)}>Editar</button>
                                                <button className='btn btn-danger boton' onClick={() => handleDarBaja(sucursal)}>Baja</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
                    <div className="table table-responsive tablaSucursal">
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Sucursal</th>
                                    <th scope="col">Encargado</th>
                                    <th scope="col">Fecha Registro</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sucursals
                                    ?.filter((sucursal) => sucursal.estado === 0 && sucursal.cliente.estado === 1) // Filtrar sucursales con estado igual a 0
                                    .map((sucursal, index) => (
                                        <tr key={sucursal.id}>
                                            <td>{index + 1}</td> {/* Numeración consecutiva basada en la lista filtrada */}
                                            <td>{sucursal?.nombre_sucursal}</td>
                                            <td>{sucursal?.nombre_encargado}</td>
                                            <td>{sucursal?.fecha_registro?.slice(0, 10)}</td>
                                            <td>{sucursal?.ubicacion}</td>
                                            <td className="accion">
                                                <button className='btn btn-success boton2' onClick={() => handleDarReintegrar(sucursal)}>Reintegrar</button>
                                                <button className='btn btn-danger boton2' onClick={() => handleDarEliminar(sucursal)}>Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* Modal Editar */}
                <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar sucursal</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleUpdateUser}>
                                    <div className="mb-3">
                                        <label htmlFor="nombre" className="col-form-label">Nombre</label>
                                        <input type="text" className="form-control" id="nombre2" name="nombre" defaultValue={selectedUser?.nombre_sucursal} required />
                                    </div>
                                    <div className='mb-3 col'>
                                        <label htmlFor="fecha_registro" className="form-label">Fecha Registro</label>
                                        <input type="datetime-local" className="form-control" id="fecha_registro2" name="fecha_registro" defaultValue={selectedUser?.fecha_registro?.slice(0, 16)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="nombre_encargado" className="col-form-label">Nombre Encargado</label>
                                        <input type="text" className="form-control" id="nombre_encargado2" name="nombre_encargado" defaultValue={selectedUser?.nombre_encargado} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ubicacion" className="col-form-label">Ubicación</label>
                                        <input type="text" className="form-control" id="ubicacion2" name="ubicacion" defaultValue={selectedUser?.ubicacion} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="codigo" className="col-form-label">Código</label>
                                        <input type="text" className="form-control" id="codigo2" name="codigo" defaultValue={selectedUser?.codigo} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="codigo" className="col-form-label">Cliente</label>
                                        <Select
                                            value={selectedClienteEdit}
                                            onChange={handleChangeClienteEdit}
                                            options={ClientesOptions}
                                            placeholder="Seleccione un cliente"
                                            className=""
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                        <button type="submit" className="btn btn-primary">Guardar</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default sucursal;