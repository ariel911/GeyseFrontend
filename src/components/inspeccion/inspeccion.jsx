
import "./inspeccion.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const inspeccion = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const animatedComponents = makeAnimated();
    const [inspecciones, setinspecciones] = useState([]);
    const [estados, setestados] = useState([]);
    const [selectedEstado, setselectedEstado] = useState(null);
    const [selectedExtintor, setselectedExtintor] = useState(null);

    const [extintor, setextintor] = useState([]);
    const [observaciones, setobservaciones] = useState('');
    const [fecha_inspeccion, setfecha_inspeccion] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [editSelectedEstado, setEditSelectedEstado] = useState([]);

    const usuario_Id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    useEffect(() => {
        handleGetinspecciones();
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
        setfecha_inspeccion(getCurrentDateTime());
    }, []);


    useEffect(() => {
        if (selectedUser) {
            document.getElementById('fecha_inspeccion2').value = selectedUser.fecha_inspeccion || '';
            document.getElementById('observacion2').value = selectedUser.observaciones || '';
            /*             document.getElementById('nombreEstudiante').defaultValue = '';
                        document.getElementById('capacidad').defaultValue = '';
                        document.getElementById('sucursal').defaultValue = '';
                        document.getElementById('cliente').defaultValue = ''; */
        }
        handleGetinspecciones();
        handleGetestados();
        handleGetextintors();

    }, [selectedUser]);

    //actualizar todo eso


    const handleGetinspecciones = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/inspeccion",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setinspecciones(res.data.data.inspecion);
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
            url: "https://backendgeyse.onrender.com/api/estado",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setestados(res.data.data.estado);
    };
    //editar

    const handleEditUser = (user) => {
        document.getElementById('fecha_inspeccion2').defaultValue = '';
        document.getElementById('observacion2').defaultValue = '';
        /*         document.getElementById('nombreEstudiante').defaultValue ='';
                document.getElementById('capacidad').defaultValue ='';
                document.getElementById('sucursal').defaultValue ='';
                document.getElementById('cliente').defaultValue =''; */
        setSelectedUser(user)

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_inspeccion: user.fecha_inspeccion.slice(0, 16)
        }));
        setEditSelectedEstado(user.inspeccion_estados.map(inspeccionEstado => ({
            value: inspeccionEstado?.estado?.id,
            label: inspeccionEstado?.estado?.nombre_estado
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
            url: `https://backendgeyse.onrender.com/api/inspeccion/baja/${id}`,
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
        handleGetinspecciones();
        swal({
            title: `Inspección Reintegrado`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleDarBaja = async (id) => {

        // Restablecer los campos del formulario
        await axios({
            url: `https://backendgeyse.onrender.com/api/inspeccion/baja/${id}`,
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
        handleGetinspecciones();
        swal({
            title: `Inspección dado de baja`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleUpdateUser = async (e) => {

        e.preventDefault();
        const valuesArray = editSelectedEstado?.map(item => item.value);

        try {
            await axios({
                url: `https://backendgeyse.onrender.com/api/inspeccion/${selectedUser.id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    fecha_inspeccion: document.getElementById('fecha_inspeccion2').value,
                    observaciones: document.getElementById('observacion2').value,
                    extintorId: selectedExtintor?.value,
                    estados: valuesArray
                },
            });

            // Update the user in the local state
            const updatedinspecciones = inspecciones.map((inspeccion) =>
                inspeccion.id === selectedUser.id ? { ...inspeccion, ...selectedUser } : inspeccion
            );

            setinspecciones(updatedinspecciones);
            // Close the modal
            setSelectedUser(null);
            setselectedExtintor(null);
            swal({
                title: "Inspeccion Editado Correctamente!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {

        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar la solicitud para agregar el inspeccion
        const selectedEstados = selectedEstado.map((option) => option.value);

        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/inspeccion',
                {
                    fecha_inspeccion,
                    estado: 1,
                    observaciones,
                    usuarioId: usuario_Id,
                    extintorId: selectedOption.value,
                    estados: selectedEstados
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Limpiar los campos del formulario

            setfecha_inspeccion('');
            setobservaciones('');
            setSelectedOption(null)
            setselectedEstado([])
            handleGetinspecciones();
            // Llamar a la función del padre para actualizar la lista de inspecciones
            swal({
                title: "Inspeccion Agregado!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
            swal({
                title: "Fallo en Agregar!",
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
    const filteredOptions = options.filter((autor) =>
        (autor.label + "").includes(selectedOption)
    );


    const handleChange = (selectedOption) => {
        setselectedEstado(selectedOption);
    };

    const estadoOptions = estados.map((estado) => ({
        value: estado.id,
        label: estado.nombre_estado
    }));
    const handleShowServicio = (user) => {

        setSelectedUser(user)

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_inspeccion: user.fecha_inspeccion.slice(0, 16)
        }));

    };
    function getTrabajosNombres(servicioTrabajos) {
        if (servicioTrabajos?.inspeccion_estados?.length > 0) {
            return servicioTrabajos?.inspeccion_estados?.map(servicioTrabajo => servicioTrabajo?.estado?.nombre_estado).join(', ');
        }
        return 'En buen estado';
    }

    const handleActionChange = (event, inspeccion) => {
        const action = event.target.value;
        if (action === "edit") {
            // Abre el modal para editar
            const modal = new bootstrap.Modal(document.getElementById('modalEdit'));
            modal.show();
            // Aquí puedes agregar lógica para cargar datos en el modal si es necesario
            handleEditUser(inspeccion);  // Cargar datos en el modal

            // Añadir listener para resetear el select cuando se cierre el modal
            document.getElementById('modalEdit').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${inspeccion.id}`).value = "";
            }, { once: true });
        } else if (action === "baja") {
            // Lógica para dar de baja
            handleDarBaja(inspeccion.id);
        } else if (action === "detalle") {
            // Lógica para dar de baja
            const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
            modal.show();
            handleShowServicio(inspeccion)
            document.getElementById('modalDetalle').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${inspeccion.id}`).value = "";
            }, { once: true });
        }
    };
    const handleChangeBuscador = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredInspecciones = inspecciones?.filter(inspeccion =>
        inspeccion?.extintor.codigo_empresa?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleSelectChangeExtintor = (extintor) => {
        setselectedExtintor(extintor);
    };
    const optionsExtintor = extintor?.map((extintor) => ({
        value: extintor.id,
        label: extintor.codigo_empresa
    }));
    const handleEditChange = (selectedOption) => {
        setEditSelectedEstado(selectedOption);
    };
    const estadOptions = estados?.map((trabajo) => ({
        value: trabajo.id,
        label: trabajo.nombre_estado
    }));
    return (
        <div className="inspeccion">
            <h1 className="titu4">Inspecciones</h1>

            {/* Pestañas de Bootstrap */}
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">
                        Agregar Inspección
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">
                        Lista de Inspecciones
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">
                        Bajas
                    </button>
                </li>
            </ul>

            {/* Contenido de las Pestañas */}
            <div className="tab-content" id="myTabContent">
                {/* Pestaña Agregar Inspección */}
                <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
                    <div className='nuevaInspeccion d-flex'>
                        <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                            <div className='row row-cols-2 row-cols-md-3 row-cols-lg-4'>
                                <div className='mb-4 col'>
                                    <label htmlFor="recipient-name" className="form-label">Fecha Insp.</label>
                                    <input type="datetime-local" className="form-control" value={fecha_inspeccion} onChange={(e) => setfecha_inspeccion(e.target.value)} required />
                                </div>
                                <div className=' col'>
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
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Marca</label>
                                    <input type="nombreEstudiante" className="form-control" id="nombreEstudiante" defaultValue={selectedOption?.nombre} disabled />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Capacidad</label>
                                    <input type="capacidad" className="form-control  " id="capacidad" defaultValue={selectedOption?.capacidad} disabled />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="recipient-name" className="form-label">Sucursal</label>
                                    <input type="sucursal" className="form-control" id="sucursal" defaultValue={selectedOption?.sucursal} disabled />
                                </div>

                                <div className="mb-3 col">
                                    <label htmlFor="rol" className="form-label ">Desperfectos</label>
                                    <Select
                                        id="rol"
                                        closeMenuOnSelect={false}
                                        value={selectedEstado}
                                        options={estadOptions}
                                        onChange={handleChange}
                                        placeholder="Seleccione"
                                        isMulti
                                        className=""
                                        MenuList

                                    />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <input type="text" className="form-control " id="observaciones" value={observaciones} onChange={(e) => setobservaciones(e.target.value)} required />
                                </div>
                            </div>
                            <div className=" mt-3 botones">
                                <div className="">
                                    <button type="submit" className="btn btn-primary botoninspeccion">Agregar</button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>

                {/* Pestaña Lista de Inspecciones */}
                <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">

                    <form className="d-flex buscador" role="search">
                        <input
                            type="text"
                            placeholder="Buscar inspección por código de empresa..."
                            value={searchTerm}
                            onChange={handleChangeBuscador}
                            className="form-control me-2"
                        />
                    </form>

                    <div className="table table-responsive tablaInspeccion">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cod. Empresa</th>
                                    <th scope="col ">Ubicación</th>
                                    <th scope="col ">Marca</th>
                                    <th scope="col ">Capacidad</th>
                                    <th scope="col ">Observaciones</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInspecciones?.map((inspeccion, index) => inspeccion.estado == 1 && (
                                    <tr key={inspeccion.id}>
                                        <td>{index + 1}</td>
                                        <td>{inspeccion.extintor.codigo_empresa}</td>
                                        <td>{inspeccion.extintor.ubicacion}</td>
                                        <td>{inspeccion.extintor.marca}</td>
                                        <td>{inspeccion.extintor.capacidad}</td>
                                        <td>{inspeccion.observaciones}</td>
                                        <td className="accion">
                                            <select className='form-select' onChange={(e) => handleActionChange(e, inspeccion)} id={`select-${inspeccion.id}`}>
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

                {/* Detalles */}
                <div className="modal fade" id="modalDetalle" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Detalles de la Inspección </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* Formulario de edición va aquí */}
                                <form >

                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_extintor" className="col-form-label">Cod. extintor</label>
                                            <input type="text" className="form-control" id="codigo_extintor3" name="codigo_extintor" defaultValue={selectedUser?.extintor?.codigo_extintor} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_empresa" className="col-form-label">Cod. empresa</label>
                                            <input type="text" className="form-control" id="codigo_empresa3" name="codigo_empresa" defaultValue={selectedUser?.extintor?.codigo_empresa} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="capacidad" className="col-form-label">Capacidad</label>
                                            <input type="text" className="form-control" id="capacidad3" name="capacidad" defaultValue={selectedUser?.extintor?.capacidad} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="ubicacion" className="col-form-label">Fecha Inspección</label>
                                            <input type="datetime-local" className="form-control" id="fecha_servicio3" name="ubicacion" defaultValue={selectedUser?.fecha_inspeccion} readOnly />
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="cliente" className="col-form-label">Cliente</label>
                                            <input type="text" className="form-control" id="cliente3" name="cliente" defaultValue={selectedUser?.extintor?.sucursal?.cliente?.nombre_cliente} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="sucursal" className="col-form-label">Sucursal</label>
                                            <input type="text" className="form-control" id="sucursal3" name="sucursal" defaultValue={selectedUser?.extintor?.sucursal?.nombre_sucursal} readOnly />
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="observacion" className="col-form-label">Observacion</label>
                                            <input type="text" className="form-control" id="observacion3" name="observacion" defaultValue={selectedUser?.observaciones} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="trabajos" className="col-form-label">Desperfectos</label>
                                            <input type="text" className="form-control" id="trabajos" name="trabajos" value={getTrabajosNombres(selectedUser)} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col">
                                            <label htmlFor="usuario_correo" className="col-form-label">Usuario Registro</label>
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
                {/* editar */}
                <div className={`modal fade`} id="modalEdit" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar inspección</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body">
                                <form >

                                    <div className='mb-3 col'>
                                        <label htmlFor="fecha_inspeccion" className="form-label">Fecha Inspección</label>
                                        <input type="datetime-local" className="form-control" id="fecha_inspeccion2" name="fecha_inspeccion" defaultValue={selectedUser?.fecha_inspeccion?.slice(0, 16)} required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="ubicacion" className="col-form-label">Ubicación</label>
                                        <input type="text" className="form-control" id="ubicacion2" name="ubicacion" defaultValue={selectedUser?.extintor.ubicacion} required disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="codigo_empresa" className="col-form-label">Cod. Extintor</label>
                                        <input type="text" className="form-control" id="codigo_empresa2" name="codigo_empresa" defaultValue={selectedUser?.extintor.codigo_empresa} required disabled />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="observacion" className="col-form-label">Observaciones</label>
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
                                            value={editSelectedEstado}
                                            onChange={handleEditChange}
                                            options={estadoOptions}
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
                {/* Pestaña Bajas */}
                <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
                    <div className="table table-responsive tablaInspeccion">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Capacidad</th>
                                    <th scope="col">Fecha Inspección</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col ">Observaciones</th>
                                    <th scope="col ">Desperfectos</th>
                                    <th scope="col ">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inspecciones?.map((inspeccion, index) => inspeccion.estado == 0 && (
                                    <tr key={inspeccion.id}>
                                        <td>{index + 1}</td>
                                        <td>{inspeccion.extintor.marca}</td>
                                        <td>{inspeccion.extintor.capacidad}</td>
                                        <td>{inspeccion.fecha_inspeccion.slice(0, 10)}</td>
                                        <td>{inspeccion.extintor.ubicacion}</td>
                                        <td>{inspeccion.observaciones}</td>
                                        <td>
                                            {inspeccion.inspeccion_estados.length > 0 ?
                                                inspeccion.inspeccion_estados.map(servicioEstado => servicioEstado.estado.nombre_estado).join(', ')
                                                : 'No se hizo trabajos'}
                                        </td>
                                        <td>
                                            <button className='btn btn-danger boton2' onClick={() => handleDarReintegrar(inspeccion.id)}>Reintegrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>

            </div>
        </div >
    );
};

export default inspeccion;