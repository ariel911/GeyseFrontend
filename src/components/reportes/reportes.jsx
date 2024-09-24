import React, { useState, useEffect } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import Select from 'react-select';
import "./reportes.css"
const Reportes = () => {
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [extintores, setextintores] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [inspecciones, setInspecciones] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [clientes, setclientes] = useState([]);
    const [sucursalSeleccionada, setSucursalSeleccionada] = useState(null);
    const [mostrarServicios, setMostrarServicios] = useState(false);
    const [mostrarInspecciones, setMostrarInspecciones] = useState(false);
    const [mostrarExtintores, setMostrarExtintores] = useState(false);
    const [extintoresD, setExtintoresD] = useState({
        activos: false,
        inactivos: false,
        eliminados: false,
    });

    const [inspeccionesD, setInspeccionesD] = useState({
        activos: false,
        inactivos: false,
        eliminados: false,
    });

    const [serviciosD, setServiciosD] = useState({
        activos: false,
        inactivos: false,
        eliminados: false,
    });
    const [clientesD, setClientesD] = useState({
        activos: false,
        inactivos: false,
        eliminados: false,
    });
    const [sucursalesD, setSucursalesD] = useState({
        activos: false,
        inactivos: false,
        eliminados: false,
    });
    const token = localStorage.getItem('token'); // Token de autenticación

    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    const handleClienteChange = (selectedOption) => {
        setClienteSeleccionado(selectedOption);
    };

    // Obtener los clientes en el formato adecuado para react-select
    const opcionesClientes = clientes.map((cliente) => ({
        value: cliente.id,
        label: cliente.nombre_cliente
    }));

    useEffect(() => {
        handleGetExtintores();
        handleGetInspecciones();
        handleGetServicios();
        handleGetUsers();
        handleGetSucursales();
    }, []);
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
    // Llamada a la API para obtener extintores
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

    // Llamada a la API para obtener inspecciones
    const handleGetInspecciones = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/inspeccion",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        setInspecciones(res.data.data.inspecion);
    };

    // Llamada a la API para obtener servicios
    const handleGetServicios = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/servicio",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setServicios(res.data.data.servicio);
    };

    // Función para generar y descargar el Excel
    const exportToExcel = (data, sheetName, columns) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(    );

        // Aplicar los encabezados a las columnas
        worksheet.columns = columns;

        // Agregar los datos
        data.forEach((item) => {
            worksheet.addRow(item);
        });

        // Estilos para los encabezados
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true, size: 12 };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCCCFF' },
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar encabezados
        });

        // Estilos para todas las filas de datos
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrar todas las celdas
            });
        });

        // Descargar el archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = `${sheetName}.xlsx`;
            link.click();
        });
    };


    // Función para estructurar los datos de extintores
    const prepareExtintorData = (extintores, mes) => {

        var extintoresFiltrados = extintores
        if (mes) {
            extintoresFiltrados = filterByDateAndCliente(extintores, 'fecha_registro', 'id')
            mes = false
        }

        return extintoresFiltrados.map((extintor, index) => ({
            numero: index + 1,
            codigo_extintor2: extintor.codigo_extintor,
            codigo_empresa2: extintor.codigo_empresa,
            ubicacion: extintor.ubicacion,
            marca: extintor.marca,
            tipo: extintor.tipo.nombre_tipo,
            capacidad: extintor.capacidad,
            observaciones: extintor.observaciones,
            fecha_registro: extintor.fecha_registro.slice(0, 10),
            cliente: extintor?.sucursal?.cliente?.nombre_cliente || 'N/A',
            sucursal: extintor?.sucursal?.nombre_sucursal || 'N/A',
            estado: extintor.estado === 3 ? 'Eliminado' : ((extintor.estado === 1 && extintor.sucursal.estado === 1) && extintor.sucursal.cliente.estado === 1) ? 'Activo' : 'Inactivo'
        }));
    };

    // Función para estructurar los datos de inspecciones
    const prepareInspeccionData = (inspecciones, mes) => {
        var inspeccionesFiltrados = inspecciones
        if (mes) {
            inspeccionesFiltrados = filterByDateAndClienteServiciosInspecciones(inspecciones, 'fecha_inspeccion', 'id')
            mes = false
        }

        return inspeccionesFiltrados.map((inspeccion, index) => ({
            numero: index + 1,
            codigo_extintor: inspeccion.extintor.codigo_extintor || 'N/A',
            codigo_empresa: inspeccion.extintor.codigo_empresa || 'N/A',
            sucursal: inspeccion.extintor.sucursal.nombre_sucursal || 'N/A',
            cliente: inspeccion.extintor.sucursal.cliente.nombre_cliente || 'N/A',
            tipo: inspeccion.extintor.tipo.nombre_tipo || 'N/A',
            marca: inspeccion.extintor.marca || 'N/A',
            capacidad: inspeccion.extintor.capacidad || 'N/A',
            fecha_inspeccion: inspeccion.fecha_inspeccion ? inspeccion.fecha_inspeccion.slice(0, 10) : 'N/A',
            desperfectos: inspeccion.inspeccion_estados.map(inspeccionEstado => inspeccionEstado.estado.nombre_estado).join(', '),
            observaciones: inspeccion.observaciones || 'N/A',
            usuario: inspeccion.usuario.correo || 'N/A',
            estado: inspeccion.estado === 3 ? 'Eliminado' : (((inspeccion.estado === 1 && inspeccion.extintor.sucursal.estado === 1) && (inspeccion.extintor.sucursal.cliente.estado === 1 && inspeccion.extintor.estado === 1))) ? 'Activo' : 'Inactivo'
        }));
    };
    // Función de filtrado por fecha y cliente
    const filterByDateAndClienteServiciosInspecciones = (data, fechaKey, clienteKey) => {
        return data.filter((item) => {
            console.log("item:", item)
            if (item.estado === 1 && item.extintor.estado === 1 && item.extintor.sucursal.estado === 1 && item.extintor.sucursal.cliente.estado === 1) {
                const fecha = new Date(item[fechaKey]);

                const clienteId = item.extintor.sucursal.cliente[clienteKey]; // ID del cliente en los datos

                return (
                    (mes ? fecha.getMonth() + 1 === parseInt(mes) : true) &&
                    (anio ? fecha.getFullYear() === parseInt(anio) : true) &&
                    (clienteSeleccionado ? clienteId === clienteSeleccionado.value : true) // Filtrar por cliente
                );
            }


        });
    };
    const filterByDateAndCliente = (data, fechaKey, clienteKey) => {
        return data.filter((item) => {
            if (item.estado === 1 || item.sucursal.estado === 1 && item.sucursal.cliente.estado === 1) {
                const fecha = new Date(item[fechaKey]);
                //falta solo sacar extintores,cservicios e inspecciones pero activos......
                const clienteId = item.sucursal.cliente[clienteKey]; // ID del cliente en los datos

                return (
                    (mes ? fecha.getMonth() + 1 === parseInt(mes) : true) &&
                    (anio ? fecha.getFullYear() === parseInt(anio) : true) &&
                    (clienteSeleccionado ? clienteId === clienteSeleccionado.value : true) // Filtrar por cliente
                );
            }

        });
    };
    // Función para estructurar los datos de servicios
    const prepareServicioData = (servicios, mes) => {
        var serviciosFiltrados = servicios
        if (mes) {
            serviciosFiltrados = filterByDateAndClienteServiciosInspecciones(servicios, 'fecha_servicio', 'id')
            mes = false
        }

        return serviciosFiltrados.map((servicio, index) => ({
            numero: index + 1,
            codigo_extintor: servicio.extintor.codigo_extintor || 'N/A',
            codigo_empresa: servicio.extintor.codigo_empresa || 'N/A',
            sucursal: servicio.extintor.sucursal.nombre_sucursal || 'N/A',
            cliente: servicio.extintor.sucursal.cliente.nombre_cliente || 'N/A',
            tipo: servicio.extintor.tipo.nombre_tipo || 'N/A',
            marca: servicio.extintor.marca || 'N/A',
            capacidad: servicio.extintor.capacidad || 'N/A',
            fecha_servicio: servicio.fecha_servicio ? servicio.fecha_servicio.slice(0, 10) : 'N/A',
            trabajos: servicio.servicio_trabajos.map(servicioTrabajo => servicioTrabajo.trabajo.nombre_trabajo).join(', '),
            proximo_ph: servicio.proximo_ph ? servicio.proximo_ph.slice(0, 10) : 'N/A',
            proximo_mantenimiento: servicio.proximo_mantenimiento ? servicio.proximo_mantenimiento.slice(0, 10) : 'N/A',
            observaciones: servicio.observaciones || 'N/A',
            usuario: servicio.usuario.correo || 'N/A',
            estado: servicio.estado === 3 ? 'Eliminado' : (((servicio.estado === 1 && servicio.extintor.sucursal.estado === 1) && (servicio.extintor.sucursal.cliente.estado === 1 && servicio.extintor.estado === 1))) ? 'Activo' : 'Inactivo'
        }));
    };
    ///aqui hacer para cliente
    const prepareClientesData = (clientes) => {

        return clientes.map((cliente, index) => ({
            numero: index + 1,
            codigo: cliente.codigo || 'N/A',
            nombre_cliente: cliente.nombre_cliente || 'N/A',
            usuario_acceso: cliente.usuario_acceso || 'N/A',
            clave: cliente.clave || 'N/A',
            nombre_encargado: cliente.nombre_encargado || 'N/A',
            estado: cliente.estado === 3 ? "Eliminado" : cliente.estado === 1 ? "Activo" : "Inactivo",
            fecha_registro: cliente.fecha_registro ? cliente.fecha_registro.slice(0, 10) : 'N/A',
        }));
    };
    const prepareSucursalData = (sucursales) => {

        return sucursales.map((sucursal, index) => ({
            numero: index + 1,
            codigo: sucursal.codigo || 'N/A',
            cliente: sucursal.cliente.nombre_cliente || 'N/A',
            sucursal: sucursal.nombre_sucursal || 'N/A',
            ubicacion: sucursal.ubicacion || 'N/A',
            nombre_encargado: sucursal.nombre_encargado || 'N/A',
            estado: sucursal.estado === 3 ? "Eliminado" : (sucursal.estado === 0 || sucursal.cliente.estado === 0 || sucursal.cliente.estado === 3) ? "Inactivo" : "activo",
            fecha_registro: sucursal.fecha_registro ? sucursal.fecha_registro.slice(0, 10) : 'N/A',
        }));
    };
    // Filtrar extintores por estado
    const getExtintoresActivos = () => extintores.filter(extintor => extintor.estado === 1 && extintor.sucursal.estado === 1 && extintor.sucursal.cliente.estado === 1);
    const getExtintoresInactivos = () => extintores.filter(extintor => extintor.estado === 0 || extintor.sucursal.estado === 0 || extintor.sucursal.estado === 3 || extintor.sucursal.cliente.estado === 0 || extintor.sucursal.cliente.estado === 3);
    const getExtintoresEliminados = () => extintores.filter(extintor => extintor.estado === 3);

    // Filtrar inspecciones por estado

    const getInspeccionesActivas = () => inspecciones.filter(inspeccion => inspeccion.estado === 1 && inspeccion.extintor.estado === 1 && inspeccion.extintor.sucursal.estado === 1 && inspeccion.extintor.sucursal.cliente.estado === 1);
    const getInspeccionesInactivas = () => inspecciones.filter(inspeccion => inspeccion.estado === 0 || inspeccion.extintor.estado === 0 || inspeccion.extintor.estado === 3 || inspeccion.extintor.sucursal.estado === 0 || inspeccion.extintor.sucursal.estado === 3 || inspeccion.extintor.sucursal.cliente.estado === 0 || inspeccion.extintor.sucursal.cliente.estado === 3);
    const getInspeccionesEliminadas = () => inspecciones.filter(inspeccion => inspeccion.estado === 3);

    // Filtrar servicios por estado
    const getServiciosActivos = () => servicios.filter(servicio => servicio.estado === 1 && servicio.extintor.estado === 1 && servicio.extintor.sucursal.estado === 1 && servicio.extintor.sucursal.cliente.estado === 1);
    const getServiciosInactivos = () => servicios.filter(servicio => servicio.estado === 0 || servicio.extintor.estado === 0 || servicio.extintor.estado === 3 || servicio.extintor.sucursal.estado === 0 || servicio.extintor.sucursal.estado === 3 || servicio.extintor.sucursal.cliente.estado === 0 || servicio.extintor.sucursal.cliente.estado === 3);
    const getServiciosEliminados = () => servicios.filter(servicio => servicio.estado === 3);

    const getClientesActivos = () => clientes.filter(cliente => cliente.estado === 1);
    const getClientesInactivos = () => clientes.filter(cliente => cliente.estado === 0);
    const getClientesEliminados = () => clientes.filter(cliente => cliente.estado === 3);

    const getSucursalActivos = () => sucursales.filter(sucursal => sucursal.estado === 1 && sucursal.cliente.estado === 1);
    const getSucursalInactivos = () => sucursales.filter(sucursal => sucursal.estado === 0 || sucursal.cliente.estado === 0 || sucursal.cliente.estado === 3);
    const getSucursalEliminados = () => sucursales.filter(sucursal => sucursal.estado === 3);
    // Columnas para los extintores, inspecciones y servicios
    const extintorColumns = [
        { header: 'N°', key: 'numero', width: 5 },
        { header: 'Código Extintor', key: 'codigo_extintor2', width: 20 },
        { header: 'Código Empresa', key: 'codigo_empresa2', width: 20 },
        { header: 'Ubicación', key: 'ubicacion', width: 20 },
        { header: 'Marca', key: 'marca', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Capacidad', key: 'capacidad', width: 10 },
        { header: 'Observaciones', key: 'observaciones', width: 25 },
        { header: 'Fecha Registro', key: 'fecha_registro', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 20 },
        { header: 'Sucursal', key: 'sucursal', width: 20 },
        { header: 'Estado', key: 'estado', width: 10 },
    ];

    const inspeccionColumns = [
        { header: 'N°', key: 'numero', width: 5 },
        { header: 'Código Extintor', key: 'codigo_extintor', width: 18 },
        { header: 'Código Ex. Empresa', key: 'codigo_empresa', width: 18 },
        { header: 'Sucursal', key: 'sucursal', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Marca', key: 'marca', width: 15 },
        { header: 'Capacidad', key: 'capacidad', width: 15 },
        { header: 'Fecha Inspeccion', key: 'fecha_inspeccion', width: 20 },
        { header: 'Desperfectos', key: 'desperfectos', width: 30 },
        { header: 'Observaciones', key: 'observaciones', width: 25 },
        { header: 'Usuario Registro', key: 'usuario', width: 25 },
        { header: 'Estado', key: 'estado', width: 10 },
    ];

    const servicioColumns = [
        { header: 'N°', key: 'numero', width: 5 },
        { header: 'Código Extintor', key: 'codigo_extintor', width: 18 },
        { header: 'Código Ex. Empresa', key: 'codigo_empresa', width: 18 },
        { header: 'Sucursal', key: 'sucursal', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Marca', key: 'marca', width: 15 },
        { header: 'Capacidad', key: 'capacidad', width: 15 },
        { header: 'Fecha Servicio', key: 'fecha_servicio', width: 20 },
        { header: 'Trabajos', key: 'trabajos', width: 30 },
        { header: 'Proximo PH', key: 'proximo_ph', width: 15 },
        { header: 'Proximo Mantenimiento', key: 'proximo_mantenimiento', width: 25 },
        { header: 'Observaciones', key: 'observaciones', width: 25 },
        { header: 'Usuario Registro', key: 'usuario', width: 25 },
        { header: 'Estado', key: 'estado', width: 10 },
    ];
    const clienteColumns = [
        { header: 'N°', key: 'numero', width: 5 },
        { header: 'Código', key: 'codigo', width: 18 },
        { header: 'Nombre Cliente', key: 'nombre_cliente', width: 20 },
        { header: 'Usuario Acceso', key: 'usuario_acceso', width: 20 },
        { header: 'Clave', key: 'clave', width: 15 },
        { header: 'Nombre Encargado', key: 'nombre_encargado', width: 20 },
        { header: 'Estado', key: 'estado', width: 10 },
        { header: 'Fecha Registro', key: 'fecha_registro', width: 20 },
    ];
    const sucursalColumns = [
        { header: 'N°', key: 'numero', width: 5 },
        { header: 'Cliente', key: 'cliente', width: 18 },
        { header: 'Sucursal', key: 'sucursal', width: 20 },
        { header: 'Código', key: 'codigo', width: 20 },
        { header: 'Ubicación', key: 'ubicacion', width: 20 },
        { header: 'Nombre Encargado', key: 'nombre_encargado', width: 20 },
        { header: 'Estado', key: 'estado', width: 10 },
        { header: 'Fecha Registro', key: 'fecha_registro', width: 20 },
    ];
    const handleCheckboxChange = (e, setCategory) => {
        const { name, checked } = e.target;
        setCategory(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    // Combina los datos seleccionados para exportarlos en un solo archivo
    const handleDownload = () => {
        let allExtintorData = [];
        let allInspeccionData = [];
        let allServicioData = [];
        let allClienteData = [];
        let allSucursalData = [];

        // Extintores
        if (extintoresD.activos) {
            allExtintorData = allExtintorData.concat(prepareExtintorData(getExtintoresActivos(), false));
        }
        if (extintoresD.inactivos) {
            allExtintorData = allExtintorData.concat(prepareExtintorData(getExtintoresInactivos(), false));
        }
        if (extintoresD.eliminados) {
            allExtintorData = allExtintorData.concat(prepareExtintorData(getExtintoresEliminados(), false));
        }

        // Inspecciones
        if (inspeccionesD.activos) {
            allInspeccionData = allInspeccionData.concat(prepareInspeccionData(getInspeccionesActivas(), false));
        }
        if (inspeccionesD.inactivos) {
            allInspeccionData = allInspeccionData.concat(prepareInspeccionData(getInspeccionesInactivas(), false));
        }
        if (inspeccionesD.eliminados) {
            allInspeccionData = allInspeccionData.concat(prepareInspeccionData(getInspeccionesEliminadas(), false));
        }

        // Servicios
        if (serviciosD.activos) {
            allServicioData = allServicioData.concat(prepareServicioData(getServiciosActivos(), false));
        }
        if (serviciosD.inactivos) {
            allServicioData = allServicioData.concat(prepareServicioData(getServiciosInactivos(), false));
        }
        if (serviciosD.eliminados) {
            allServicioData = allServicioData.concat(prepareServicioData(getServiciosEliminados(), false));
        }

        //clientes
        if (clientesD.activos) {
            allClienteData = allClienteData.concat(prepareClientesData(getClientesActivos(), false));
        }
        if (clientesD.inactivos) {
            allClienteData = allClienteData.concat(prepareClientesData(getClientesInactivos(), false));
        }
        if (clientesD.eliminados) {
            allClienteData = allClienteData.concat(prepareClientesData(getClientesEliminados(), false));
        }

        //sucursales
        if (sucursalesD.activos) {
            allSucursalData = allSucursalData.concat(prepareSucursalData(getSucursalActivos(), false));
        }
        if (sucursalesD.inactivos) {
            allSucursalData = allSucursalData.concat(prepareSucursalData(getSucursalInactivos(), false));
        }
        if (sucursalesD.eliminados) {
            allSucursalData = allSucursalData.concat(prepareSucursalData(getSucursalEliminados(), false));
        }

        // Exportar los datos seleccionados en un solo archivo
        if (allExtintorData.length > 0) {
            exportToExcel(allExtintorData, "Extintores", extintorColumns);
        }

        if (allInspeccionData.length > 0) {
            exportToExcel(allInspeccionData, "Inspecciones", inspeccionColumns);
        }

        if (allServicioData.length > 0) {
            exportToExcel(allServicioData, "Servicios", servicioColumns);
        }

        if (allClienteData.length > 0) {
            exportToExcel(allClienteData, "Clientes", clienteColumns);
        }
        if (allSucursalData.length > 0) {
            exportToExcel(allSucursalData, "Sucursales", sucursalColumns);
        }
    };
    // Manejar el cambio en la selección de la sucursal
    const handleSucursalChange = (selectedOption) => {
        setSucursalSeleccionada(selectedOption);
    };

    // Manejar el cambio en los checkboxes
    const handleCheckboxChange2 = (setCheckbox) => {
        setCheckbox((prev) => !prev); // Cambia el valor del checkbox
    };

    // Filtrar los datos por sucursal seleccionada y opciones de checkboxes
    const filtrarDatos = () => {
        if (!sucursalSeleccionada) return;
        let allExtintorData = [];
        let allInspeccionData = [];
        let allServicioData = [];
        const sucursalId = sucursalSeleccionada.value;

        if (mostrarExtintores) {
            const extintoresFiltrados = mostrarExtintores
                ? extintores.filter((extintor) => extintor.sucursal.id === sucursalId)
                : [];
            const getExtintoresActivos2 = () => extintoresFiltrados.filter(extintor => extintor.estado === 1 && extintor.sucursal.estado === 1 && extintor.sucursal.cliente.estado === 1);
            allExtintorData = prepareExtintorData(getExtintoresActivos2(), false);//arreglar esto
            exportToExcel(allExtintorData, "Extintores", extintorColumns);
        }
        if (mostrarInspecciones) {

            const inspeccionesFiltrados = mostrarInspecciones
                ? inspecciones.filter((inspeccion) => inspeccion.extintor.sucursal.id === sucursalId)
                : [];
            const getInspeccionesActivas2 = () => inspeccionesFiltrados.filter(inspeccion => inspeccion.estado === 1 && inspeccion.extintor.estado === 1 && inspeccion.extintor.sucursal.estado === 1 && inspeccion.extintor.sucursal.cliente.estado === 1);
            allInspeccionData = prepareInspeccionData(getInspeccionesActivas2(), false);//arreglar esto
            exportToExcel(allInspeccionData, "Inspeccion", inspeccionColumns);
        }
        if (mostrarServicios) {
            const serviciosFiltrados = mostrarServicios
                ? servicios.filter((servicio) => servicio.extintor.sucursal.id === sucursalId)
                : [];
            const getServiciosActivos2 = () => serviciosFiltrados.filter(servicio => servicio.estado === 1 && servicio.extintor.estado === 1 && servicio.extintor.sucursal.estado === 1 && servicio.extintor.sucursal.cliente.estado === 1);
            allServicioData = prepareServicioData(getServiciosActivos2(), false);//arreglar esto
            exportToExcel(allServicioData, "Servicios", servicioColumns);
        }





        // Llamar a la función de filtrado con los datos filtrados

    };
    const handleGetSucursales = async () => {
        const res = await axios({
            url: "https://backendgeyse.onrender.com/api/sucursal",
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setSucursales(res.data.data.sucursal);
    };
    // Opciones del select de sucursales
    const opcionesSucursal = sucursales.map((sucursal) => ({
        value: sucursal.id, // Identificador de la sucursal
        label: sucursal.nombre_sucursal, // Nombre de la sucursal
    }));
    return (
        <div className="reportes">
            <h2 className="text-center mt-3">Reportes</h2>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link active"
                        id="sucursal-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#sucursal"
                        type="button"
                        role="tab"
                        aria-controls="sucursal"
                        aria-selected="true"
                    >
                        Reportes por Sucursal
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="generales-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#generales"
                        type="button"
                        role="tab"
                        aria-controls="generales"
                        aria-selected="false"
                    >
                        Reportes Generales
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className="nav-link"
                        id="filtros-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#filtros"
                        type="button"
                        role="tab"
                        aria-controls="filtros"
                        aria-selected="false"
                    >
                        Reportes por Mes/Año/Cliente
                    </button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                {/* Pestaña 1: Reportes por Sucursal */}
                <div
                    className="tab-pane fade show active"
                    id="sucursal"
                    role="tabpanel"
                    aria-labelledby="sucursal-tab"
                >
                    <div className="nuevosReportes">
                        <div className="mb-4">
                            <h4 className="mb-3">Exportar reportes activos por sucursal</h4>

                            {/* Select para seleccionar la sucursal */}
                            <div className="mb-3">
                                <Select
                                    value={sucursalSeleccionada}
                                    onChange={handleSucursalChange}
                                    options={opcionesSucursal}
                                    isSearchable={true}
                                    placeholder="Selecciona una sucursal"
                                    /* styles={{
                                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                                        control: (provided) => ({ ...provided, zIndex: 1 }),
                                    }} */
                                />
                            </div>

                            {/* Checkboxes para seleccionar servicios, inspecciones o extintores */}
                            <div className="form-check-inline">
                                <label className="form-check-label me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={mostrarServicios}
                                        onChange={() => handleCheckboxChange2(setMostrarServicios)}
                                    />
                                    Mostrar Servicios
                                </label>
                                <label className="form-check-label me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={mostrarInspecciones}
                                        onChange={() => handleCheckboxChange2(setMostrarInspecciones)}
                                    />
                                    Mostrar Inspecciones
                                </label>
                                <label className="form-check-label me-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={mostrarExtintores}
                                        onChange={() => handleCheckboxChange2(setMostrarExtintores)}
                                    />
                                    Mostrar Extintores
                                </label>
                            </div>

                            {/* Botón para filtrar los datos */}
                            <div className="mt-3 text-center">
                                <button className="btn btn-primary" onClick={filtrarDatos}>
                                    Descargar Datos Seleccionados
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pestaña 2: Reportes Generales */}
                <div
                    className="tab-pane fade"
                    id="generales"
                    role="tabpanel"
                    aria-labelledby="generales-tab"
                >
                    <div className="row nuevosReportes2">
                        <h4 className="mb-3">Exportar reportes generales</h4>

                        {/* Extintores */}
                        <div className="col-md-4">
                            <h5>Extintores</h5>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="activos"
                                    checked={extintoresD.activos}
                                    onChange={(e) => handleCheckboxChange(e, setExtintoresD)}
                                />
                                <label className="form-check-label">Extintores Activos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inactivos"
                                    checked={extintoresD.inactivos}
                                    onChange={(e) => handleCheckboxChange(e, setExtintoresD)}
                                />
                                <label className="form-check-label">Extintores Inactivos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="eliminados"
                                    checked={extintoresD.eliminados}
                                    onChange={(e) => handleCheckboxChange(e, setExtintoresD)}
                                />
                                <label className="form-check-label">Extintores Eliminados</label>
                            </div>
                        </div>

                        {/* Sucursales */}
                        <div className="col-md-4">
                            <h5>Sucursales</h5>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="activos"
                                    checked={sucursalesD.activos}
                                    onChange={(e) => handleCheckboxChange(e, setSucursalesD)}
                                />
                                <label className="form-check-label">Sucursales Activos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inactivos"
                                    checked={sucursalesD.inactivos}
                                    onChange={(e) => handleCheckboxChange(e, setSucursalesD)}
                                />
                                <label className="form-check-label">Sucursales Inactivos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="eliminados"
                                    checked={sucursalesD.eliminados}
                                    onChange={(e) => handleCheckboxChange(e, setSucursalesD)}
                                />
                                <label className="form-check-label">Sucursales Eliminados</label>
                            </div>
                        </div>
                        {/* Inspecciones */}
                        <div className="col-md-4">
                            <h5>Inspecciones</h5>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="activos"
                                    checked={inspeccionesD.activos}
                                    onChange={(e) => handleCheckboxChange(e, setInspeccionesD)}
                                />
                                <label className="form-check-label">Inspecciones Activas</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inactivos"
                                    checked={inspeccionesD.inactivos}
                                    onChange={(e) => handleCheckboxChange(e, setInspeccionesD)}
                                />
                                <label className="form-check-label">Inspecciones Inactivas</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="eliminados"
                                    checked={inspeccionesD.eliminados}
                                    onChange={(e) => handleCheckboxChange(e, setInspeccionesD)}
                                />
                                <label className="form-check-label">Inspecciones Eliminadas</label>
                            </div>
                        </div>

                        {/* Servicios */}
                        <div className="col-md-4 mt-3">
                            <h5>Servicios</h5>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="activos"
                                    checked={serviciosD.activos}
                                    onChange={(e) => handleCheckboxChange(e, setServiciosD)}
                                />
                                <label className="form-check-label">Servicios Activos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inactivos"
                                    checked={serviciosD.inactivos}
                                    onChange={(e) => handleCheckboxChange(e, setServiciosD)}
                                />
                                <label className="form-check-label">Servicios Inactivos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="eliminados"
                                    checked={serviciosD.eliminados}
                                    onChange={(e) => handleCheckboxChange(e, setServiciosD)}
                                />
                                <label className="form-check-label">Servicios Eliminados</label>
                            </div>
                        </div>
                        <div className="col-md-4 mt-3">
                            <h5>Clientes</h5>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="activos"
                                    checked={clientesD.activos}
                                    onChange={(e) => handleCheckboxChange(e, setClientesD)}
                                />
                                <label className="form-check-label">Clientes Activos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="inactivos"
                                    checked={clientesD.inactivos}
                                    onChange={(e) => handleCheckboxChange(e, setClientesD)}
                                />
                                <label className="form-check-label">Clientes Inactivos</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="eliminados"
                                    checked={clientesD.eliminados}
                                    onChange={(e) => handleCheckboxChange(e, setClientesD)}
                                />
                                <label className="form-check-label">Clientes Eliminados</label>
                            </div>
                        </div>
                        {/* Botón de descarga */}
                        <div className="col-12 mt-4 text-center">
                            <button className="btn btn-success" onClick={handleDownload}>
                                Descargar Datos Seleccionados
                            </button>
                        </div>
                        {/* (Continúa con el código de la segunda pestaña como en tu ejemplo) */}
                    </div>
                </div>

                {/* Pestaña 3: Reportes por Mes/Año/Cliente */}
                <div
                    className="tab-pane fade"
                    id="filtros"
                    role="tabpanel"
                    aria-labelledby="filtros-tab"
                >
                    <div className="mt-3">
                        <div className="row nuevosReportes2">
                        <h4>Exportar reportes por mes, año y cliente</h4>
                            <div className="col-md-4">
                                <label>Mes:</label>
                                <select
                                    className="form-control"
                                    value={mes}
                                    onChange={(e) => setMes(e.target.value)}
                                >
                                    {/* Opciones de meses */}
                                    <option value="">Todos</option>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label>Año:</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={anio}
                                    onChange={(e) => setAnio(e.target.value)}
                                    placeholder="Ingrese el año"
                                />
                            </div>

                            <div className="col-md-4">
                                <label>Cliente:</label>
                                <Select
                                    value={clienteSeleccionado}
                                    onChange={handleClienteChange}
                                    options={opcionesClientes}
                                    placeholder="Seleccionar Cliente"
                                />
                            </div>
                            {/* Botones para descargar reportes */}
                            <div className="text-center mt-4">

                                {/* Botones para descargar reportes */}
                                <div className="text-center mt-4">
                                    <button className="btn btn-primary m-2"
                                        onClick={() =>
                                            exportToExcel(prepareInspeccionData(inspecciones, true), 'Inspecciones', inspeccionColumns)
                                        }
                                    >
                                        Descargar Inspecciones
                                    </button>
                                    <button className="btn btn-primary m-2"
                                        onClick={() =>
                                            exportToExcel(prepareServicioData(servicios, true), 'Servicios', servicioColumns)
                                        }
                                    >
                                        Descargar Servicios
                                    </button>
                                    <button className="btn btn-primary m-2"
                                        onClick={() =>
                                            exportToExcel(prepareExtintorData(extintores, true), 'Extintores', extintorColumns)
                                        }
                                    >
                                        Descargar Extintores
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>

    );
};

export default Reportes;
