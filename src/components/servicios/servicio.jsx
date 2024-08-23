
import "./servicio.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
const servicio = () => {

    const [selectedUser, setSelectedUser] = useState(null);

    const [servicios, setservicios] = useState([]);
    const [estados, setestados] = useState([]);
    const [selectedEstado, setselectedEstado] = useState(null);
    const [selectedExtintor, setselectedExtintor] = useState(null);

    const [extintor, setextintor] = useState([]);
    const [observaciones, setobservaciones] = useState('');
    const [fecha_servicio, setfecha_servicio] = useState('');
    const [proximo_ph, setproximo_ph] = useState('');
    const [proximo_mantenimiento, setproximo_mantenimiento] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [editSelectedTrabajo, setEditSelectedTrabajo] = useState([]);

    const usuario_Id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    useEffect(() => {
        handleGetservicios();
        handleGetextintors();
        handleGetestados();
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
        setfecha_servicio(getCurrentDateTime());
    }, []);


    useEffect(() => {
        if (selectedUser) {
            document.getElementById('fecha_servicio2').value = selectedUser.fecha_servicio || '';
            document.getElementById('proximo_mantenimiento2').value = selectedUser.proximo_mantenimiento || '';
            document.getElementById('proximo_ph2').value = selectedUser.proximo_ph || '';
            document.getElementById('observacion2').value = selectedUser.observaciones || '';


        }
        handleGetservicios();
        handleGetestados();
        handleGetextintors();

    }, [selectedUser]);

    //actualizar todo eso


    const handleGetservicios = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/servicio",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setservicios(res.data.data.servicio);
    };
    const handleGetextintors = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/extintor",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setextintor(res.data.data.extintor);
    };
    const handleGetestados = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/trabajo",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setestados(res.data.data.trabajo);
    };
    //editar

    const handleEditUser = (user) => {

        setSelectedUser(user)

        document.getElementById('fecha_servicio2').defaultValue = '';
        document.getElementById('proximo_mantenimiento2').defaultValue = '';
        document.getElementById('proximo_ph2').defaultValue = '';
        document.getElementById('observacion2').defaultValue = '';
        document.getElementById('sucursal2').defaultValue = '';
        document.getElementById('cliente2').defaultValue = '';

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_servicio: user.fecha_servicio.slice(0, 16)
        }));
        setSelectedUser(prevState => ({
            ...prevState,
            proximo_mantenimiento: user.proximo_mantenimiento.slice(0, 16)
        }));
        setSelectedUser(prevState => ({
            ...prevState,
            proximo_ph: user.proximo_ph.slice(0, 16)
        }));
        setEditSelectedTrabajo(user.servicio_trabajos.map(servicioTrabajo => ({
            value: servicioTrabajo.trabajo.id,
            label: servicioTrabajo.trabajo.nombre_trabajo
        })));

        if (user.extintor.codigo_empresa) {
            setselectedExtintor({
                value: user.extintor.id,
                label: user.extintor.codigo_empresa
            });
        } else {
            setselectedExtintor(null); // Si no hay cliente asociado, puedes manejar este caso como desees
        }
    };

    const handleDarReintegrar = async (id) => {
        await axios({
            url: `https://backendgeyse.onrender.com/api/servicio/baja/${id}`,
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
        handleGetservicios();
        swal({
            title: `Servicio dado de baja`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleDarBaja = async (id) => {

        // Restablecer los campos del formulario
        await axios({
            url: `https://backendgeyse.onrender.com/api/servicio/baja/${id}`,
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
        handleGetservicios();
        swal({
            title: `Servicio Reintegrado`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleUpdateUser = async (e) => {

        e.preventDefault();
        const valuesArray = editSelectedTrabajo?.map(item => item.value);
        try {
            await axios({
                url: `https://backendgeyse.onrender.com/api/servicio/${selectedUser.id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    fecha_servicio: document.getElementById('fecha_servicio2').value,
                    proximo_ph: document.getElementById('proximo_ph2').value,
                    proximo_mantenimiento: document.getElementById('proximo_mantenimiento2').value,
                    observaciones: document.getElementById('observacion2').value,
                    extintorId: selectedExtintor?.value,
                    trabajos: valuesArray
                },
            });

            // Update the user in the local state
            const updatedservicios = servicios.map((servicio) =>
                servicio.id === selectedUser.id ? { ...servicio, ...selectedUser } : servicio
            );

            setservicios(updatedservicios);
            // Close the modal
            setSelectedUser(null);
            setselectedExtintor(null);
            swal({
                title: "Servicio Editado Correctamente!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });
            handleGetservicios();

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {

        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar la solicitud para agregar el servicio
        const selectedEstados = selectedEstado.map((option) => option.value);
        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/servicio',
                {
                    fecha_servicio,
                    proximo_mantenimiento,
                    proximo_ph,
                    estado: 1,
                    observaciones,
                    usuarioId: usuario_Id,
                    extintorId: selectedOption.value,
                    trabajos: selectedEstados
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Limpiar los campos del formulario

            setfecha_servicio('');
            setproximo_mantenimiento('');
            setproximo_ph('');
            setobservaciones('');
            setSelectedOption([])
            handleGetservicios();
            setselectedEstado([]);
            // Llamar a la función del padre para actualizar la lista de servicios
            swal({
                title: "Servicio Agregado!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });
            handleGetservicios();

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
            swal({
                title: "Fallo en Agregar Servicio!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "error",
                button: "Ok",
            });
        }
    };

    //react select y su buscador

    const options = extintor.map((ex) => ({
        value: ex.id,
        label: ex.codigo_empresa,
        nombre: ex.marca,
        capacidad: ex.capacidad,
        sucursal: ex.sucursal.nombre_sucursal,
        cliente: ex.sucursal.cliente.nombre_cliente,

    }));
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption)
    };
    const filteredOptions = options?.filter((autor) =>
        (autor.label + "").includes(selectedOption)
    );


    const handleChange = (selectedOption) => {
        setselectedEstado(selectedOption);
    };
    const handleSelectChangeExtintor = (extintor) => {
        setselectedExtintor(extintor);
    };
    const optionsExtintor = extintor?.map((extintor) => ({
        value: extintor.id,
        label: extintor.codigo_empresa
    }));

    const estadoOptions = estados?.map((estado) => ({
        value: estado.id,
        label: estado.nombre_trabajo
    }));

    const handleShowServicio = (user) => {

        setSelectedUser(user)

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_servicio: user.fecha_servicio.slice(0, 16)
        }));

    };

    const handleActionChange = (event, servicio) => {
        const action = event.target.value;
        if (action === "edit") {
            // Abre el modal para editar
            const modal = new bootstrap.Modal(document.getElementById('modalEdit'));
            modal.show();
            // Aquí puedes agregar lógica para cargar datos en el modal si es necesario
            handleEditUser(servicio);  // Cargar datos en el modal

            // Añadir listener para resetear el select cuando se cierre el modal
            document.getElementById('modalEdit').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${servicio.id}`).value = "";
            }, { once: true });
        } else if (action === "baja") {
            // Lógica para dar de baja
            handleDarBaja(servicio.id);
        } else if (action === "detalle") {
            // Lógica para dar de baja
            const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
            modal.show();
            handleShowServicio(servicio)
            document.getElementById('modalDetalle').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${servicio.id}`).value = "";
            }, { once: true });
        }
    };
    function getTrabajosNombres(servicioTrabajos) {
        if (servicioTrabajos?.servicio_trabajos?.length > 0) {
            return servicioTrabajos?.servicio_trabajos?.map(servicioTrabajo => servicioTrabajo?.trabajo.nombre_trabajo).join(', ');
        }
        return 'No tiene menús';
    }
    const handleChangeBuscador = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredServicios = servicios?.filter(servicio =>
        servicio?.extintor.codigo_empresa?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleEditChange = (selectedOption) => {
        setEditSelectedTrabajo(selectedOption);
    };
    const trabajoOptions = estados?.map((trabajo) => ({
        value: trabajo.id,
        label: trabajo.nombre_trabajo
    }));

    return (
        <div className="servicio">
            <h1 className="titu4">Servicios</h1>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">Agregar</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">Lista de Servicios</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">Bajas</button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                {/* Sección de Agregar */}
                <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
                    <div className='nuevoServicio d-flex'>
                        <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                            <div className='row row-cols-2 row-cols-md-3 row-cols-lg-4'>

                                <div className='mb-3 col'>
                                    <label htmlFor="recipient-name" className="form-label">Fecha servicio</label>
                                    <input type="datetime-local" className="form-control" value={fecha_servicio} onChange={(e) => setfecha_servicio(e.target.value)} required />
                                </div>
                                <div className='mb-3 colct'>
                                    <label htmlFor="recipient-name" className="form-label ">Cod. Empresa</label>
                                    <Select
                                        options={filteredOptions}
                                        onChange={handleSelectChange}
                                        isSearchable
                                        placeholder="Buscar"
                                        value={selectedOption}
                                        className=""
                                    />
                                </div>

                                <div className='mb-3 col'>
                                    <label htmlFor="recipient-name" className="form-label">Prox. PH</label>
                                    <input type="datetime-local" className="form-control" value={proximo_ph} onChange={(e) => setproximo_ph(e.target.value)} required />
                                </div>
                                <div className='mb-3 col'>
                                    <label htmlFor="recipient-name" className="form-label">Prox. Mant.</label>
                                    <input type="datetime-local" className="form-control" value={proximo_mantenimiento} onChange={(e) => setproximo_mantenimiento(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Marca</label>
                                    <input type="nombreEstudiante" className="form-control" id="nombreEstudiante" defaultValue={selectedOption?.nombre} disabled />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Capacidad</label>
                                    <input type="capacidad" className="form-control" id="capacidad" defaultValue={selectedOption?.capacidad} disabled />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Sucursal</label>
                                    <input type="sucursal" className="form-control" id="sucursal" defaultValue={selectedOption?.sucursal} disabled />
                                </div>

                                <div className="mb-3 col">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <input type="text" className="form-control" id="observaciones" value={observaciones} onChange={(e) => setobservaciones(e.target.value)} required />
                                </div>
                                <div className="mb-3 col-12 ">
                                    <label htmlFor="rol" className="form-label ">Trabajo Realizado</label>

                                    <Select
                                        id="rol"
                                        value={selectedEstado}
                                        onChange={handleChange}
                                        options={estadoOptions}
                                        placeholder="Seleccione"
                                        isMulti
                                        className=""
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>

                            <div className="botones">
                                <button type="submit" className="btn btn-primary botonservicio">
                                    Agregar
                                </button>
                            </div>


                        </form>
                    </div>
                </div>
                {/* editar */}
                <div className={`modal fade`} id="modalEdit" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar servicio</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body">
                                <form >
                                    <div className="row">
                                        <div className='mb-3 col'>
                                            <label htmlFor="fecha_servicio" className="form-label">Fecha servicio</label>
                                            <input type="datetime-local" className="form-control" id="fecha_servicio2" name="fecha_servicio" defaultValue={selectedUser?.fecha_servicio?.slice(0, 16)} required />
                                        </div>
                                        <div className="mb-3 col">
                                            <label htmlFor="codigo_empresa" className="form-label">Cod. extintor</label>
                                            <input type="text" className="form-control" id="codigo_empresa2" name="codigo_empresa" defaultValue={selectedUser?.extintor.codigo_empresa} required disabled />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className='mb-3 col'>
                                            <label htmlFor="proximo_mantenimiento" className="form-label">Proximo mant.</label>
                                            <input type="datetime-local" className="form-control" id="proximo_mantenimiento2" name="proximo_mantenimiento" defaultValue={selectedUser?.proximo_mantenimiento?.slice(0, 16)} required />
                                        </div>
                                        <div className='mb-3 col'>
                                            <label htmlFor="proximo_ph" className="form-label">Proximo Ph.</label>
                                            <input type="datetime-local" className="form-control" id="proximo_ph2" name="proximo_ph" defaultValue={selectedUser?.proximo_ph?.slice(0, 16)} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                                        <input type="text" className="form-control" id="ubicacion2" name="ubicacion" defaultValue={selectedUser?.extintor.ubicacion} required disabled />
                                    </div>


                                    <div className="mb-3">
                                        <label htmlFor="observacion" className="form-label">Observaciones</label>
                                        <input type="text" className="form-control" id="observacion2" name="observacion" defaultValue={selectedUser?.observaciones} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="extintor" className="form-label">Extintor</label>
                                        <Select
                                            id="extintor"
                                            value={selectedExtintor}
                                            onChange={handleSelectChangeExtintor}
                                            options={optionsExtintor}
                                            placeholder="Seleccione"
                                            className=""
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="edit_rol" className="form-label">Trabajos</label>
                                        <Select
                                            id="edit_rol"
                                            value={editSelectedTrabajo}
                                            onChange={handleEditChange}
                                            options={trabajoOptions}
                                            placeholder="Seleccione"
                                            isMulti
                                            className=""
                                            closeMenuOnSelect={false}
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
                {/* Detalles */}
                <div className="modal fade" id="modalDetalle" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Detalles del Servicio</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* Formulario de edición va aquí */}
                                <form >

                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_extintor" className="col-form-label">Codigo extintor:</label>
                                            <input type="text" className="form-control" id="codigo_extintor2" name="codigo_extintor" defaultValue={selectedUser?.extintor?.codigo_extintor} disabled />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_empresa" className="col-form-label">Codigo empresa:</label>
                                            <input type="text" className="form-control" id="codigo_empresa2" name="codigo_empresa" defaultValue={selectedUser?.extintor?.codigo_empresa} disabled />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="capacidad" className="col-form-label">Capacidad:</label>
                                            <input type="text" className="form-control" id="capacidad2" name="capacidad" defaultValue={selectedUser?.extintor?.capacidad} disabled />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="ubicacion" className="col-form-label">Fecha Servicio:</label>
                                            <input type="datetime-local" className="form-control" id="fecha_servicio2" name="ubicacion" defaultValue={selectedUser?.fecha_servicio} disabled />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="proximo_ph2" className="col-form-label">Proximo ph:</label>

                                            <input type="datetime-local" className="form-control" id="proximo_ph2" name="proximo_ph" defaultValue={selectedUser?.proximo_ph?.slice(0, 16)} readOnly />
                                        </div>
                                        <div className='mb-3 col-6'>
                                            <label htmlFor="proximo_mant" className="col-form-label">Proximo mant.</label>
                                            <input type="datetime-local" className="form-control" id="proximo_mant2" name="proximo_mant" defaultValue={selectedUser?.proximo_mantenimiento?.slice(0, 16)} readOnly />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="cliente" className="col-form-label">Cliente:</label>
                                            <input type="text" className="form-control" id="cliente2" name="cliente" defaultValue={selectedUser?.extintor?.sucursal?.cliente?.nombre_cliente} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="sucursal" className="col-form-label">Sucursal:</label>
                                            <input type="text" className="form-control" id="sucursal2" name="sucursal" defaultValue={selectedUser?.extintor?.sucursal?.nombre_sucursal} readOnly />
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="observacion" className="col-form-label">Observacion:</label>
                                            <input type="text" className="form-control" id="observacion2" name="observacion" defaultValue={selectedUser?.observaciones} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="trabajos" className="col-form-label">Trabajos:</label>
                                            <input type="text" className="form-control" id="trabajos" name="trabajos" value={getTrabajosNombres(selectedUser)} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col">
                                            <label htmlFor="usuario_correo" className="col-form-label">Usuario Registro:</label>
                                            <input type="text" className="form-control" id="usuario_correo" name="usuario_correo" defaultValue={selectedUser?.usuario?.correo} readOnly />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Sección de Lista de Servicios */}
                <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">

                    <form className="d-flex buscador" role="search">
                        <input
                            type="text"
                            placeholder="Buscar servicio por codigo de empresa..."
                            value={searchTerm}
                            onChange={handleChangeBuscador}
                            className="form-control me-2"
                        />
                    </form>

                    <div className="b">
                        <div className="table table-responsive tablaServicio">
                            <table className="table table-sm">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Nº</th>
                                        <th scope="col">Cod. Empresa</th>
                                        <th scope="col">Sucursal</th>
                                        <th scope="col">Marca</th>
                                        <th scope="col">Capacidad</th>
                                        <th scope="col ">Ubicación</th>
                                        <th scope="col ">Trabajos</th>
                                        <th scope="col ">Observaciones</th>
                                        <th scope="col">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredServicios?.map((servicio, index) => servicio.estado == 1 && (
                                        <tr key={servicio.id}>
                                            <td>{index + 1}</td>
                                            <td>{servicio.extintor.codigo_empresa}</td>
                                            <td>{servicio.extintor.sucursal.nombre_sucursal}</td>
                                            <td>{servicio.extintor.marca}</td>
                                            <td>{servicio.extintor.capacidad}</td>
                                            <td>{servicio.extintor.ubicacion}</td>
                                            <td>
                                                {servicio.servicio_trabajos.length > 0 ?
                                                    servicio.servicio_trabajos.map(servicioTrabajo => servicioTrabajo.trabajo.nombre_trabajo).join(', ')
                                                    : 'No se hizo trabajos'}
                                            </td>
                                            <td>{servicio.observaciones}</td>
                                            <td className="accion">
                                                <select className='form-select' onChange={(e) => handleActionChange(e, servicio)} id={`select-${servicio.id}`}>
                                                    <option value="">Seleccionar</option>
                                                    <option value="edit">Editar</option>
                                                    <option value="baja">Baja</option>
                                                    <option value="detalle">Detalle</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sección de Bajas */}
                <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
                    <div className="table table-responsive tablaServicio">
                        <table className="table">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cod. Empresa</th>
                                    <th scope="col">Sucursal</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Capacidad</th>
                                    <th scope="col">Fecha Servicio</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col ">Trabajos</th>
                                    <th scope="col ">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicios?.map((servicio, index) => servicio.estado == 0 && (
                                    <tr key={servicio.id}>
                                        <td>{index + 1}</td>
                                        <td>{servicio.extintor.codigo_empresa}</td>
                                        <td>{servicio.extintor.sucursal.nombre_sucursal}</td>
                                        <td>{servicio.extintor.marca}</td>
                                        <td>{servicio.extintor.capacidad}</td>
                                        <td>{servicio.fecha_servicio.slice(0, 10)}</td>
                                        <td>{servicio.extintor.ubicacion}</td>
                                        <td>
                                            {servicio.servicio_trabajos.length > 0 ?
                                                servicio.servicio_trabajos.map(servicioTrabajo => servicioTrabajo.trabajo.nombre_trabajo).join(', ')
                                                : 'No se hizo trabajos'}
                                        </td>
                                        <td>
                                            <button className='btn btn-danger boton2' onClick={() => handleDarReintegrar(servicio.id)}>Reintegrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>



    );
};

export default servicio;