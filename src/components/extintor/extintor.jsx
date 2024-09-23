
import "./extintor.css"
import { useState, useEffect, useCallback, useRef } from 'react';
import QRCode from 'react-qr-code';
import { toPng } from 'html-to-image';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
const extintor = () => {

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedsucursales, setSelectedsucursal] = useState(null);
    const [codigoEmpresa, setCodigoEmpresa] = useState("inicio");
    const [selectedsucursales2, setSelectedsucursal2] = useState(null);
    const [selectedtipo, setSelectedtipo] = useState(null);

    const [selectedtipo2, setSelectedtipo2] = useState(null);
    const [extintores, setextintores] = useState([]);
    const qrRef = useRef(null);
    const [marca, setMarca] = useState('');
    const [codigo_extintor, setcodigo_extintor] = useState('');
    const [codigo_empresa, setcodigo_empresa] = useState('');
    const [capacidad, setcapacidad] = useState('');
    const [sucursales, setsucursales] = useState(null);
    const [tipo, setTipo] = useState(null);
    const [ubicacion, setubicacion] = useState('');
    const [observaciones, setobservaciones] = useState('');
    const [fecha_registro, setfecha_registro] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');
    const usuario_Id = localStorage.getItem('id');

    useEffect(() => {
        handleGetExtintores();
        handleGetTipos();
        handleGetsucursales();
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
            document.getElementById('marca2').value = selectedUser.marca || '';
            document.getElementById('ubicacion2').value = selectedUser.ubicacion || '';
            document.getElementById('capacidad2').value = selectedUser.capacidad || '';
            document.getElementById('codigo_extintor2').value = selectedUser.codigo_extintor || '';
            document.getElementById('codigo_empresa2').value = selectedUser.codigo_empresa || '';
            document.getElementById('observacion2').value = selectedUser.observaciones || '';

        }
        handleGetExtintores();
        handleGetsucursales();
        handleGetTipos();

    }, [selectedUser]);

    //actualizar todo eso


    const handleGetExtintores = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/extintor",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setextintores(res.data.data.extintor);
    };
    const handleGetTipos = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/tipo",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTipo(res.data.data.tipo);
    };
    const handleGetsucursales = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/sucursal",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setsucursales(res.data.data.sucursal);
    };
    //editar

    const handleEditUser = (user) => {
        setSelectedUser(user)
        document.getElementById('marca2').defaultValue = '';
        document.getElementById('capacidad2').defaultValue = '';
        document.getElementById('ubicacion2').defaultValue = '';
        document.getElementById('codigo_extintor2').defaultValue = '';
        document.getElementById('codigo_empresa2').defaultValue = '';
        document.getElementById('observacion2').defaultValue = '';

        handleGetTipos();


        if (user.tipo.nombre_tipo) {
            setSelectedtipo2({
                value: user.tipo.id,
                label: user.tipo.nombre_tipo
            });
        } else {
            selectedtipo2(null); // Si no hay cliente asociado, puedes manejar este caso como desees
        }


        if (user.sucursal.nombre_sucursal) {
            setSelectedsucursal2({
                value: user.sucursal.id,
                label: user.sucursal.nombre_sucursal
            });
        } else {
            selectedtipo2(null); // Si no hay cliente asociado, puedes manejar este caso como desees
        }


    };
    const handleShowExtintor = (user) => {

        setSelectedUser(user)

        setSelectedUser(prevState => ({
            ...prevState,
            fecha_registro: user.fecha_registro.slice(0, 16)
        }));

    };
    const handleDarEliminar = async (extintor) => {
        await axios({
            url: `https://backendgeyse.onrender.com/api/extintor/baja/${extintor.id}`,
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
        handleGetExtintores();
        swal({
            title: `Extintor ${extintor.codigo_empresa} Eliminado`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleDarReintegrar = async (extintor) => {
        await axios({
            url: `https://backendgeyse.onrender.com/api/extintor/baja/${extintor.id}`,
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
        handleGetExtintores();
        swal({
            title: `Extintor ${extintor.codigo_empresa} reintegrado`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleDarBaja = async (extintor) => {

        // Restablecer los campos del formulario
        await axios({
            url: `https://backendgeyse.onrender.com/api/extintor/baja/${extintor.id}`,
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
        handleGetExtintores();
        swal({
            title: `Extintor ${extintor.codigo_empresa} dado de baja`,
            icon: "success",
            button: "Ok",
        });
    }
    const handleUpdateUser = async (e) => {

        e.preventDefault();

        try {
            await axios({
                url: `https://backendgeyse.onrender.com/api/extintor/${selectedUser.id}`,
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    marca: document.getElementById('marca2').value,
                    capacidad: document.getElementById('capacidad2').value,
                    ubicacion: document.getElementById('ubicacion2').value,
                    codigo_extintor: document.getElementById('codigo_extintor2').value,
                    codigo_empresa: document.getElementById('codigo_empresa2').value,
                    observaciones: document.getElementById('observacion2').value,
                    tipoId: selectedtipo2.value,
                    sucursalId: selectedsucursales2.value
                },
            });

            // Update the user in the local state
            const updatedextintores = extintores.map((extintor) =>
                extintor.id === selectedUser.id ? { ...extintor, ...selectedUser } : extintor
            );

            setextintores(updatedextintores);
            // Close the modal
            setSelectedUser(null);
            swal({
                title: "Extintor Editado Correctamente",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Realizar la solicitud para agregar el extintor
        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/extintor',
                {
                    marca,
                    capacidad,
                    ubicacion,
                    fecha_registro,
                    estado: 1,
                    codigo_extintor,
                    codigo_empresa,
                    observaciones,
                    usuarioId: usuario_Id,
                    sucursalId: selectedsucursales.value,
                    tipoId: selectedtipo.value
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Limpiar los campos del formulario
            setMarca('');
            setcapacidad('');
            setfecha_registro('');
            setcodigo_extintor('');
            setcodigo_empresa('');
            setubicacion('');
            setobservaciones('');
            setSelectedsucursal(null)
            setSelectedtipo(null)
            handleGetExtintores();
            // Llamar a la función del padre para actualizar la lista de extintores
            swal({
                title: "Extintor Agregado!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });

            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }
    };


    const handleChangeTipo = (selectedOption) => {
        setSelectedtipo(selectedOption);
    };
    const handleChangeTipo2 = (selectedOption) => {
        setSelectedtipo2(selectedOption);
    };
    const handleChangeSucursal = (selectedOption) => {
        setSelectedsucursal(selectedOption);
    };
    const handleChangeSucursal2 = (selectedOption) => {
        setSelectedsucursal2(selectedOption);
    };
    const sucursalOptions = sucursales
    ?.filter(sucursal => sucursal.estado === 1) // Filtrar sucursales con estado igual a 1
    .map(sucursal => ({
        value: sucursal.id,
        label: sucursal.nombre_sucursal
    }));

    const tipoOptions = tipo?.map((tipo) => ({
        value: tipo.id,
        label: tipo.nombre_tipo
    }));
    const handleActionChange = (event, extintor) => {
        const action = event.target.value;
        if (action === "edit") {
            // Abre el modal para editar


            const modal = new bootstrap.Modal(document.getElementById('modalEdit'));
            modal.show();
            // Aquí puedes agregar lógica para cargar datos en el modal si es necesario
            handleEditUser(extintor);  // Cargar datos en el modal

            // Añadir listener para resetear el select cuando se cierre el modal
            document.getElementById('modalEdit').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${extintor.id}`).value = "";
            }, { once: true });
        } else if (action === "baja") {
            // Lógica para dar de baja
            handleDarBaja(extintor);
        } else if (action === "detalle") {
            // Lógica para dar de baja
            const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
            modal.show();
            handleShowExtintor(extintor)
            document.getElementById('modalDetalle').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${extintor.id}`).value = "";
            }, { once: true });
        } else if (action === "Generar Qr") {

            const modal = new bootstrap.Modal(document.getElementById('modalQr'));
            modal.show();
            setCodigoEmpresa(extintor?.codigo_empresa)
            document.getElementById('modalQr').addEventListener('hidden.bs.modal', () => {
                document.getElementById(`select-${extintor.id}`).value = "";
            }, { once: true });


        }
    };

    const handleDescargarQr = (codigoEmpresa) => {

        setTimeout(handleDownload(codigoEmpresa), 100); // Espera un momento para asegurar que el QR se renderice antes de descargar
        /* document.getElementById(`select-`).value = ""; */
    }
    const handleChangeBuscador = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredExtintores = extintores?.filter(extintor =>
        extintor?.codigo_empresa?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleDownload = (codigoEmpresa) => {
        setTimeout(() => {
            if (qrRef.current === null) {
                return;
            }

            toPng(qrRef.current)
                .then((dataUrl) => {
                    const link = document.createElement('a');

                    link.download = `${codigoEmpresa}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch((err) => {
                    console.error('Oops, something went wrong!', err);
                });
        }, 0);
    };
    return (
        <div className="extintor">
            <h1 className="titu4">Extintores</h1>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="registro-tab" data-bs-toggle="tab" data-bs-target="#registro" type="button" role="tab" aria-controls="registro" aria-selected="true">Registro de extintores</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">Lista de extintores</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">Bajas</button>
                </li>
            </ul>
            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="registro" role="tabpanel" aria-labelledby="registro-tab">
                    {/* Contenido de Registro de extintores */}
                    <div className='nuevoExtintor d-flex'>
                        <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                            <div className='row row-cols-2 row-cols-md-3 row-cols-lg-4'>
                                <div className="mb-3 col">
                                    <label htmlFor="marca" className="form-label">Marca</label>
                                    <input type="text" className="form-control" id="marca" value={marca} onChange={(e) => setMarca(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="capacidad" className="form-label">Capacidad</label>
                                    <input type="text" className="form-control" id="capacidad" value={capacidad} onChange={(e) => setcapacidad(e.target.value)} required />
                                </div>
                               
                                <div className="mb-3 col">
                                    <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                                    <input type="text" className="form-control" id="ubicacion" value={ubicacion} onChange={(e) => setubicacion(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="codigo_extintor" className="form-label">Código Extintor</label>
                                    <input type="text" className="form-control" id="codigo_extintor" value={codigo_extintor} onChange={(e) => setcodigo_extintor(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="tipo_extintor" className="form-label">Tipo Extintor</label>
                                    <Select
                                        id="tipo_extintor"
                                        value={selectedtipo}
                                        onChange={handleChangeTipo}
                                        options={tipoOptions}
                                        placeholder="Seleccione"
                                        className=""
                                    />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <input type="text" className="form-control" id="observaciones" value={observaciones} onChange={(e) => setobservaciones(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="sucursal" className="form-label">Sucursal</label>
                                    <Select
                                        id="sucursal"
                                        value={selectedsucursales}
                                        onChange={handleChangeSucursal}
                                        options={sucursalOptions}
                                        placeholder="Seleccione"
                                        className=""
                                    />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="codigo_empresa" className="form-label">Código Empresa</label>
                                    <input type="text" className="form-control" id="codigo_empresa" value={codigo_empresa} onChange={(e) => setcodigo_empresa(e.target.value)} required />
                                </div>
                            </div>
                            <div className="botones">
                                <div className="">
                                    <button type="submit" className="btn btn-primary botonextintor">
                                        Agregar
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">
                    {/* Contenido de Lista de extintores */}
                    <form className="d-flex buscador" role="search">
                        <input
                            type="text"
                            placeholder="Buscar extintor por código de empresa..."
                            value={searchTerm}
                            onChange={handleChangeBuscador}
                            className="form-control me-2"
                        />
                    </form>

                    <div className="table table-responsive tablaExtintor">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cod. Extintor</th>
                                    <th scope="col">Cod. Empresa</th>
                                    <th scope="col">Sucursal</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Capacidad</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredExtintores
                                    ?.filter(extintor => extintor.estado === 1 && extintor.sucursal.estado === 1 && extintor.sucursal.cliente.estado===1) // Filtrar extintores con estado 1
                                    .map((extintor, index) => (
                                        <tr key={extintor.id}>
                                            <td>{index + 1}</td> {/* Numeración basada en la lista filtrada */}
                                            <td>{extintor.codigo_extintor}</td>
                                            <td>{extintor.codigo_empresa}</td>
                                            <td>{extintor.sucursal.nombre_sucursal}</td>
                                            <td>{extintor.ubicacion}</td>
                                            <td>{extintor.marca}</td>
                                            <td>{extintor.capacidad}</td>
                                            <td className="accion">
                                                <select className='form-select' onChange={(e) => handleActionChange(e, extintor)} id={`select-${extintor.id}`}>
                                                    <option value="">Seleccionar</option>
                                                    <option value="edit">Editar</option>
                                                    <option value="baja">Baja</option>
                                                    <option value="detalle">Detalle</option>
                                                    <option value="Generar Qr">Generar QR</option>
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
                                <h5 className="modal-title" id="exampleModalLabel">Detalles del Extintor</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* Formulario de edición va aquí */}
                                <form >

                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_extintor" className="col-form-label">Código extintor</label>
                                            <input type="text" className="form-control" id="codigo_extintor3" name="codigo_extintor" defaultValue={selectedUser?.codigo_extintor} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_empresa" className="col-form-label">Código empresa</label>
                                            <input type="text" className="form-control" id="codigo_empresa3" name="codigo_empresa" defaultValue={selectedUser?.codigo_empresa} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="capacidad" className="col-form-label">Capacidad</label>
                                            <input type="text" className="form-control" id="capacidad3" name="capacidad" defaultValue={selectedUser?.capacidad} readOnly />
                                        </div>
                                        <div className="mb-3 col-6" >
                                            <label htmlFor="observacion" className="col-form-label">Observaciones</label>
                                            <input type="text" className="form-control" id="observacion3" name="observacion" defaultValue={selectedUser?.observaciones} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-3">
                                            <label htmlFor="marca" className="col-form-label">Marca</label>

                                            <input type="text" className="form-control" id="marca3" name="marca" defaultValue={selectedUser?.marca} readOnly />
                                        </div>
                                        <div className='mb-3 col'>
                                            <label htmlFor="fecha_registro" className="col-form-label">Fecha Registro</label>
                                            <input type="datetime-local" className="form-control" id="fecha_registro3" name="fecha_registro" defaultValue={selectedUser?.fecha_registro?.slice(0, 16)} readOnly />
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="mb-3 col-9">
                                            <label htmlFor="ubicacion" className="col-form-label">Ubicación</label>
                                            <input type="text" className="form-control" id="ubicacion3" name="ubicacion" defaultValue={selectedUser?.ubicacion} readOnly />
                                        </div>
                                        <div className="mb-3 col-3">
                                            <label htmlFor="tipo" className="col-form-label">Tipo</label>
                                            <input type="text" className="form-control" id="tipo3" name="tipo" defaultValue={selectedUser?.tipo.nombre_tipo} readOnly />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="cliente" className="col-form-label">Cliente</label>
                                            <input type="text" className="form-control" id="cliente3" name="cliente" defaultValue={selectedUser?.sucursal.cliente.nombre_cliente} readOnly />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="sucursal" className="col-form-label">Sucursal</label>
                                            <input type="text" className="form-control" id="sucursal3" name="sucursal" defaultValue={selectedUser?.sucursal.nombre_sucursal} readOnly />
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col">
                                            <label htmlFor="usuario_correo" className="col-form-label">Usuario Registro</label>
                                            <input type="text" className="form-control" id="usuario_correo" name="usuario_correo" defaultValue={selectedUser?.usuario.correo} readOnly />
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
                {/*  Editar */}
                <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Editar Extintor</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {/* Formulario de edición va aquí */}
                                <form >
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="marca" className="col-form-label">Marca</label>
                                            <input type="text" className="form-control" id="marca2" name="marca" defaultValue={selectedUser?.marca} required />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="capacidad" className="col-form-label">Capacidad</label>
                                            <input type="text" className="form-control" id="capacidad2" name="capacidad" defaultValue={selectedUser?.capacidad} required />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_extintor" className="col-form-label">Codigo Extintor</label>
                                            <input type="text" className="form-control" id="codigo_extintor2" name="codigo_extintor" defaultValue={selectedUser?.codigo_extintor} required />
                                        </div>
                                        <div className="mb-3 col-6">
                                            <label htmlFor="codigo_empresa" className="col-form-label">Codigo Empresa</label>
                                            <input type="text" className="form-control" id="codigo_empresa2" name="codigo_empresa" defaultValue={selectedUser?.codigo_empresa} required />
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <label htmlFor="ubicacion" className="col-form-label">Ubicación</label>
                                        <input type="text" className="form-control" id="ubicacion2" name="ubicacion" defaultValue={selectedUser?.ubicacion} required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="observacion" className="col-form-label">Observaciones</label>
                                        <input type="text" className="form-control" id="observacion2" name="observacion" defaultValue={selectedUser?.observaciones} required />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="tipo3" className="form-label">Tipo</label>
                                        <Select
                                            id="tipo3"
                                            value={selectedtipo2}
                                            onChange={handleChangeTipo2}
                                            options={tipoOptions}
                                            placeholder="Seleccione"
                                            className=""
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="sucursal" className="form-label">Sucursal</label>
                                        <Select
                                            id="sucursal"
                                            value={selectedsucursales2}
                                            onChange={handleChangeSucursal2}
                                            options={sucursalOptions}
                                            placeholder="Seleccione"
                                            className=""
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={handleUpdateUser} data-bs-dismiss="modal">Guardar cambios</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* descargar QR */}
                <div className='modal fade modalcont' id="modalQr" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog ">
                        <div className="modal-content modaldoc2">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Generador de Qr</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>

                            <div className="modal-body">

                                <div className="extintor-card">
                                    <div ref={qrRef} style={{ position: 'relative', display: 'inline-block' }}>
                                        <QRCode value={codigoEmpresa} id="qr-descargar" size={256} />
                                    </div>
                                    <button className='btn btn-primary mt-3' onClick={() => handleDescargarQr(codigoEmpresa)}>descargar Qr</button>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
                <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
                    {/* Contenido de Bajas */}

                    <div className="table table-responsive tablaExtintor">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cod. Extintor</th>
                                    <th scope="col">Cod. Empresa</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col">Marca</th>
                                    <th scope="col">Capacidad</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {extintores?.filter(extintor => extintor.estado === 0 && extintor.sucursal.estado === 1 && extintor.sucursal.cliente.estado===1) // Filtrar extintores con estado 0
                                    .map((extintor, index) => (
                                        <tr key={extintor.id}>
                                            <td>{index + 1}</td> {/* Numeración basada en la lista filtrada */}
                                            <td>{extintor.codigo_extintor}</td>
                                            <td>{extintor.codigo_empresa}</td>
                                            <td>{extintor.ubicacion}</td>
                                            <td>{extintor.marca}</td>
                                            <td>{extintor.capacidad}</td>
                                            <td className="accion">
                                                <button className='btn btn-success boton2' onClick={() => handleDarReintegrar(extintor)}>Reintegrar</button>
                                                <button className="btn btn-danger boton2" onClick={() => handleDarEliminar(extintor)}>Eliminar</button>
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

export default extintor;