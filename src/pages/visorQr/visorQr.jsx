import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Select from 'react-select';
import logo from '../../assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const QrScannerComponent = () => {


    const qrCodeRegionRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const [extintor, setExtintor] = useState(null);
    const [inspecciones, setInspecciones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [extintoresSucursal, setExtintoresSucursal] = useState([]);
    const [extintoresCliente, setExtintoresCliente] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [searchSucursal, setSearchSucursal] = useState('');
    const [searchCliente, setSearchCliente] = useState('');

    const [selectedEstado, setselectedEstado] = useState(null);
    const [observaciones, setobservaciones] = useState('');
    const [estados, setestados] = useState([]);
    const [fecha_inspeccion, setfecha_inspeccion] = useState('');

    const usuarioId = localStorage.getItem('usuarioId');
    const token = localStorage.getItem('token');

    const handleScanButtonClick = () => {
        setIsScanning(true);
    };
    useEffect(() => {
        handleGetestados();
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
    const handleGetInspecciones = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/inspeccion",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const filteredInspecciones = res.data.data.inspecion.filter(inspeccion => inspeccion.extintor.id === extintor.id);
        setInspecciones(filteredInspecciones);
    };
    useEffect(() => {
        if (extintor) {
            const codigoEmpresa = extintor.codigo_empresa; // El código de empresa proporcionado por el QR

            fetch('https://backendgeyse.onrender.com/api/extintor', {
                method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    const extintores = data.data.extintor;
                    const extintorData = extintores.find(ext => ext.codigo_empresa === codigoEmpresa);

                    if (extintorData) {


                        const nombre_sucursal = extintorData?.sucursal?.nombre_sucursal;
                        const nombre_cliente = extintorData?.sucursal?.cliente?.nombre_cliente;


                        // Fetch extintores de la misma sucursal
                        const filteredExtintoresSucursal = extintores.filter(ext => ext.sucursal.nombre_sucursal === nombre_sucursal);
                        setExtintoresSucursal(filteredExtintoresSucursal);

                        // Fetch extintores del mismo cliente
                        const filteredExtintoresCliente = extintores.filter(ext => ext.sucursal.cliente.nombre_cliente === nombre_cliente);
                        setExtintoresCliente(filteredExtintoresCliente);

                        // Fetch inspecciones del extintor
                        fetch('https://backendgeyse.onrender.com/api/inspeccion', {
                            method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                const filteredInspecciones = data.data.inspecion.filter(inspeccion => inspeccion.extintor.id === extintorData.id);
                                setInspecciones(filteredInspecciones);
                            })
                            .catch(error => console.error('Error fetching inspecciones:', error));

                        // Fetch servicios del extintor
                        fetch('https://backendgeyse.onrender.com/api/servicio', {
                            method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                const filteredServicios = data.data.servicio.filter(servicio => servicio.extintor.id === extintorData.id);
                                setServicios(filteredServicios);
                            })
                            .catch(error => console.error('Error fetching servicios:', error));

                        const closeButton = document.querySelector('#changePasswordModal .btn-close');
                        if (closeButton) {
                            closeButton.click();
                        }
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'No se encontró un extintor con el código de empresa proporcionado.',
                            icon: 'error',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching extintor:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al obtener los datos del extintor.',
                        icon: 'error',
                        timer: 2000,
                        showConfirmButton: false
                    });
                });

        }

    }, [extintor]);
    useEffect(() => {
        const handleModalShown = () => {
            if (isScanning && !html5QrCodeRef.current) {
                const html5QrCode = new Html5Qrcode("qr-code-region");
                html5QrCodeRef.current = html5QrCode;

                const qrCodeSuccessCallback = (decodedText, decodedResult) => {
                    Swal.fire({
                        title: 'Información',
                        text: 'Cargando detalles del extintor...',
                        icon: 'info',
                        timer: 1000,
                        showConfirmButton: false
                    }).then(() => {
                        const codigoEmpresa = decodedText; // El código de empresa proporcionado por el QR

                        fetch('https://backendgeyse.onrender.com/api/extintor', {
                            method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                            headers: {
                                'Authorization': `Bearer ${token}`,

                            }
                        })
                            .then(response => response.json())
                            .then(data => {
                                const extintores = data.data.extintor;
                                const extintorData = extintores.find(ext => ext.codigo_empresa === codigoEmpresa);

                                if (extintorData) {
                                    setExtintor(extintorData);

                                    const nombre_sucursal = extintorData?.sucursal?.nombre_sucursal;
                                    const nombre_cliente = extintorData?.sucursal?.cliente?.nombre_cliente;
                                    console.log(extintorData);

                                    // Fetch extintores de la misma sucursal
                                    const filteredExtintoresSucursal = extintores.filter(ext => ext.sucursal.nombre_sucursal === nombre_sucursal);
                                    setExtintoresSucursal(filteredExtintoresSucursal);

                                    // Fetch extintores del mismo cliente
                                    const filteredExtintoresCliente = extintores.filter(ext => ext.sucursal.cliente.nombre_cliente === nombre_cliente);
                                    setExtintoresCliente(filteredExtintoresCliente);

                                    // Fetch inspecciones del extintor
                                    fetch('https://backendgeyse.onrender.com/api/inspeccion', {
                                        method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                                        headers: {
                                            'Authorization': `Bearer ${token}`,

                                        }
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            const filteredInspecciones = data.data.inspecion.filter(inspeccion => inspeccion.extintor.id === extintorData.id);
                                            setInspecciones(filteredInspecciones);
                                        })
                                        .catch(error => console.error('Error fetching inspecciones:', error));

                                    // Fetch servicios del extintor
                                    fetch('https://backendgeyse.onrender.com/api/servicio', {
                                        method: 'GET', // Especifica el método si es necesario (GET es el predeterminado)
                                        headers: {
                                            'Authorization': `Bearer ${token}`,

                                        }
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            const filteredServicios = data.data.servicio.filter(servicio => servicio.extintor.id === extintorData.id);
                                            setServicios(filteredServicios);
                                        })
                                        .catch(error => console.error('Error fetching servicios:', error));

                                    const closeButton = document.querySelector('#changePasswordModal .btn-close');
                                    if (closeButton) {
                                        closeButton.click();
                                    }
                                } else {
                                    Swal.fire({
                                        title: 'Error',
                                        text: 'No se encontró un extintor con el código de empresa proporcionado.',
                                        icon: 'error',
                                        timer: 2000,
                                        showConfirmButton: false
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching extintor:', error);
                                Swal.fire({
                                    title: 'Error',
                                    text: 'Hubo un error al obtener los datos del extintor.',
                                    icon: 'error',
                                    timer: 2000,
                                    showConfirmButton: false
                                });
                            });

                        html5QrCode.stop().then(() => {
                            html5QrCode.clear();
                            html5QrCodeRef.current = null;
                        }).catch((err) => console.error('Error stopping QR code scanner:', err));
                    });
                };


                const config = { fps: 10, qrbox: { width: 250, height: 250 } };

                html5QrCode.start(
                    { facingMode: "environment" },
                    config,
                    qrCodeSuccessCallback
                ).catch((err) => {
                    console.error('Error starting QR code scanner:', err);
                });
            }
        };

        const handleModalHidden = () => {
            if (html5QrCodeRef.current) {
                html5QrCodeRef.current.stop().then(() => {
                    html5QrCodeRef.current.clear();
                    html5QrCodeRef.current = null;
                }).catch((err) => console.error('Error stopping QR code scanner:', err));
            }
        };

        const modalElement = document.getElementById('changePasswordModal');
        modalElement.addEventListener('shown.bs.modal', handleModalShown);
        modalElement.addEventListener('hidden.bs.modal', handleModalHidden);

        return () => {
            modalElement.removeEventListener('shown.bs.modal', handleModalShown);
            modalElement.removeEventListener('hidden.bs.modal', handleModalHidden);
        };
    }, [isScanning]);

    const filteredExtintoresSucursal = extintoresSucursal.filter(ext =>
        ext.codigo_extintor.toLowerCase().includes(searchSucursal.toLowerCase())
    );
    const filteredExtintoresCliente = extintoresCliente.filter(ext =>
        ext.codigo_extintor.toLowerCase().includes(searchCliente.toLowerCase())
    );
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Realizar la solicitud para agregar el inspeccion
        const selectedEstados = selectedEstado.map((option) => option.value);
        console.log('idExtintor:', extintor.id, fecha_inspeccion, observaciones, usuarioId, selectedEstados)

        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/inspeccion',
                {
                    fecha_inspeccion,
                    estado: 1,
                    observaciones,
                    usuarioId: usuarioId,
                    extintorId: extintor.id,
                    estados: selectedEstados
                }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            setfecha_inspeccion('');
            setobservaciones('');
            handleGetInspecciones();
            setselectedEstado([])

            swal({
                title: "Inspeccion Agregado!",
                icon: "success",
                button: "Ok",
            });

        } catch (error) {
            swal({
                title: "Fallo en Agregar!",
                icon: "error",
                button: "Ok",
            });
        }
    };
    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nombre");
        localStorage.removeItem("id");
        localStorage.removeItem("Rol");
        localStorage.removeItem("user"); // Asegúrate de eliminar toda la información del usuario
        localStorage.removeItem("usuarioId"); // Asegúrate de eliminar toda la información del usuario
        localStorage.removeItem("idCliente"); // Asegúrate de eliminar toda la información del usuario
        /*  navigate('/pagina/login') */
    };
    const handleChange = (selectedOption) => {
        setselectedEstado(selectedOption);
    };

    const estadOptions = estados?.map((trabajo) => ({
        value: trabajo.id,
        label: trabajo.nombre_estado
    }));
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light p-3" id="menu">
                <div className="container d-flex justify-content-between align-items-center">
                    <a className="navbar-brand" href="#carouselExample">
                        <img src={logo} alt="" height="50" width="120" />
                    </a>
                    <div className="navbar-nav ms-auto mt-2 mb-2 mb-lg-0">
                        <Link className="nav-link" to="https://geyseproyect.netlify.app/">Regresar Página</Link>

                        <Link className="nav-link" onClick={handleLogOut} to={'/pagina/login'} > Cerrar Sesión
                        </Link>

                    </div>
                </div>
            </nav>

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
                            <h5 className="modal-title" id="changePasswordModalLabel">Escanear Qr</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="d-flex justify-content-center">
                                <div id="qr-code-region" ref={qrCodeRegionRef} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mt-4">
                <div className="card">
                    <div className="card-header containerh3">
                        <h3>Detalles del Extintor</h3>
                        <h3>{extintor?.codigo_extintor}</h3>
                        <button className="btn btn-primary mt-3" data-bs-toggle="modal" data-bs-target="#changePasswordModal" onClick={handleScanButtonClick}>
                            Escanear Qr
                        </button>
                    </div>
                    <div className="card-body">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="true">Información General</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="inspecciones-tab" data-bs-toggle="tab" data-bs-target="#inspecciones" type="button" role="tab" aria-controls="inspecciones" aria-selected="false">Inspecciones</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="servicios-tab" data-bs-toggle="tab" data-bs-target="#servicios" type="button" role="tab" aria-controls="servicios" aria-selected="false">Servicios</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="sucursal-tab" data-bs-toggle="tab" data-bs-target="#sucursal" type="button" role="tab" aria-controls="sucursal" aria-selected="false">Extintores de la Sucursal</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="cliente-tab" data-bs-toggle="tab" data-bs-target="#cliente" type="button" role="tab" aria-controls="cliente" aria-selected="false">Extintores del Cliente</button>
                            </li>
                            {usuarioId && <li className="nav-item" role="presentation">
                                <button className="nav-link" id="inspeccion-tab" data-bs-toggle="tab" data-bs-target="#inspeccion" type="button" role="tab" aria-controls="inspeccion" aria-selected="false">Agregar Inspeccion</button>
                            </li>}
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="general" role="tabpanel" aria-labelledby="general-tab">
                                <div className="card-body">
                                    <h5 className="card-title mt-4">Información General</h5>
                                    <p className="card-text"><strong>Código del Extintor:</strong> {extintor?.codigo_extintor}</p>
                                    <p className="card-text"><strong>Tipo de extintor:</strong> {extintor?.tipo?.nombre_tipo}</p>
                                    <p className="card-text"><strong>Marca:</strong> {extintor?.marca}</p>
                                    <p className="card-text"><strong>Capacidad:</strong> {extintor?.capacidad}</p>
                                    <p className="card-text"><strong>Ubicación:</strong> {extintor?.ubicacion}</p>
                                    <p className="card-text"><strong>Observaciones:</strong> {extintor?.observaciones}</p>
                                    <h5 className="card-title mt-4">Cliente</h5>
                                    <p className="card-text"><strong>Cliente:</strong> {extintor?.sucursal?.cliente.nombre_cliente}</p>
                                    <p className="card-text"><strong>Sucursal:</strong> {extintor?.sucursal?.nombre_sucursal}</p>
                                    <p className="card-text"><strong>Ubicación:</strong> {extintor?.sucursal?.ubicacion}</p>
                                </div>
                            </div>
                            <div className="tab-pane fade" id="inspecciones" role="tabpanel" aria-labelledby="inspecciones-tab">
                                <h5 className="card-title mt-4">Inspecciones</h5>

                                {inspecciones
                                    .filter(inspeccion => inspeccion.estado === 1 && inspeccion.sucursal.estado === 1) // Filtrar inspecciones con estado igual a 0
                                    .map(inspeccion => (
                                        <div key={inspeccion.id} className="card mb-3">
                                            <div className="card-body">
                                                <p className="card-text"><strong>Fecha de Inspección:</strong> {new Date(inspeccion?.fecha_inspeccion).toLocaleDateString()}</p>
                                                <p className="card-text"><strong>Desperfectos del extintor: </strong>
                                                    {inspeccion.inspeccion_estados.map(estado => estado?.estado?.nombre_estado).join(', ')}
                                                </p>
                                                <p className="card-text"><strong>Inspector:</strong> {inspeccion.usuario.nombre_usuario}</p>
                                                <p className="card-text"><strong>Observaciones:</strong> {inspeccion.observaciones}</p>
                                            </div>
                                        </div>
                                    ))
                                }

                                {/* Mostrar mensaje si no hay inspecciones con estado igual a 0 */}
                                {inspecciones.filter(inspeccion => inspeccion.estado === 0).length === 0 && (
                                    <p>No hay inspecciones para este extintor.</p>
                                )}
                            </div>

                            <div className="tab-pane fade" id="servicios" role="tabpanel" aria-labelledby="servicios-tab">
                                <h5 className="card-title mt-4">Servicios</h5>

                                {servicios
                                    .filter(servicio => servicio.estado === 1 && servicio.sucursal.estado === 1) // Filtrar servicios con estado igual a 0
                                    .map(servicio => (
                                        <div key={servicio.id} className="card mb-3">
                                            <div className="card-body">
                                                <p className="card-text"><strong>Fecha de Servicio:</strong> {new Date(servicio.fecha_servicio).toLocaleDateString()}</p>
                                                <p className="card-text"><strong>Trabajos Realizados: </strong>
                                                    {servicio.servicio_trabajos.map(trabajo => trabajo.trabajo.nombre_trabajo).join(', ')}
                                                </p>
                                                <p className="card-text"><strong>Próximo PH:</strong> {new Date(servicio.proximo_ph).toLocaleDateString()}</p>
                                                <p className="card-text"><strong>Próximo Mantenimiento:</strong> {new Date(servicio.proximo_mantenimiento).toLocaleDateString()}</p>
                                                <p className="card-text"><strong>Observaciones:</strong> {servicio.observaciones}</p>
                                            </div>
                                        </div>
                                    ))
                                }

                                {/* Mostrar mensaje si no hay servicios con estado igual a 0 */}
                                {servicios.filter(servicio => servicio.estado === 0).length === 0 && (
                                    <p>No hay servicios para este extintor.</p>
                                )}
                            </div>

                            <div className="tab-pane fade" id="sucursal" role="tabpanel" aria-labelledby="sucursal-tab">
                                <h5 className="card-title mt-4">Extintores de la Sucursal: {extintor?.sucursal?.nombre_sucursal}</h5>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Buscar por código de extintor"
                                    value={searchSucursal}
                                    onChange={(e) => setSearchSucursal(e.target.value)}
                                />
                                {filteredExtintoresSucursal
                                    .filter(ext => ext.estado === 1 && ext.sucursal.estado === 1) // Filtrar extintores con estado igual a 0
                                    .map((ext, index) => (
                                        <div key={index}>
                                            <p className="card-text"><strong>Código del Extintor:</strong> {ext.codigo_extintor}</p>
                                            <p className="card-text"><strong>Ubicación:</strong> {ext.ubicacion}</p>
                                            <p className="card-text"><strong>Estado:</strong> {ext.estado === 1 ? 'Activo' : 'Inactivo'}</p>
                                            <Link to={`/pagina/extintoresQr`} className="btn btn-primary" onClick={(e) => {
                                                // Prevenir la navegación predeterminada
                                                setExtintor(ext);
                                                Swal.fire({
                                                    title: 'Información',
                                                    text: 'Cargando detalles del extintor...',
                                                    icon: 'info',
                                                    timer: 1000,
                                                    showConfirmButton: false
                                                });
                                                handleScanButtonClick();
                                            }}>Ver más</Link>
                                            <hr />
                                        </div>
                                    ))
                                }

                                {/* Mostrar mensaje si no hay extintores con estado igual a 0 */}
                                {filteredExtintoresSucursal.filter(ext => ext.estado === 0).length === 0 && (
                                    <p className="card-text">No hay extintores registrados en esta sucursal.</p>
                                )}
                            </div>

                            <div className="tab-pane fade" id="cliente" role="tabpanel" aria-labelledby="cliente-tab">
                                <h5 className="card-title mt-4">Extintores del Cliente: {extintor?.sucursal?.cliente?.nombre_cliente}</h5>
                                <input
                                    type="text"
                                    className="form-control mb-3"
                                    placeholder="Buscar por código de extintor"
                                    value={searchCliente}
                                    onChange={(e) => setSearchCliente(e.target.value)}
                                />
                                <hr />
                                {filteredExtintoresCliente
                                    .filter(ext => ext.estado === 1 && ext.sucursal.estado=== 1) // Filtrar extintores con estado igual a 0
                                    .map((ext, index) => (
                                        <div key={index}>
                                            <p className="card-text"><strong>Código del Extintor:</strong> {ext.codigo_extintor}</p>
                                            <p className="card-text"><strong>Ubicación:</strong> {ext.ubicacion}</p>
                                            <p className="card-text"><strong>Estado:</strong> {ext.estado === 1 ? 'Activo' : 'Inactivo'}</p>
                                            {/* Aquí se puede agregar funcionalidad adicional si es necesario */}
                                            <hr />
                                        </div>
                                    ))
                                }

                                {/* Mostrar mensaje si no hay extintores con estado igual a 0 */}
                                {filteredExtintoresCliente.filter(ext => ext.estado === 0).length === 0 && (
                                    <p className="card-text">No hay extintores registrados para este cliente.</p>
                                )}
                            </div>


                            <div className="tab-pane fade" id="inspeccion" role="tabpanel" aria-labelledby="cliente-tab">
                                <h5 className="card-title mt-4">Inspecciones</h5>

                                {/* Pestaña Agregar Inspección */}


                                <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                                    <div className='row row-cols-2 row-cols-md-3 row-cols-lg-4'>
                                        <div className='mb-4 col'>
                                            <label htmlFor="recipient-name" className="form-label">Fecha Insp.</label>
                                            <input type="datetime-local" className="form-control" value={fecha_inspeccion} onChange={(e) => setfecha_inspeccion(e.target.value)} required />
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default QrScannerComponent;
