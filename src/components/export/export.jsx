import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExportExcel = () => {
    const [extintores, setExtintores] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [inspecciones, setInspecciones] = useState([]);

    useEffect(() => {
        handleGetExtintores();
        handleGetServicios();
        handleGetInspecciones();
    }, []);

    const handleGetExtintores = async () => {
        try {
            const res = await axios({
                url: "https://backendgeyse.onrender.com/api/extintor",
                method: "GET",
            });
            setExtintores(res.data.data.extintor);
        } catch (error) {
            console.error("Error fetching extintores data:", error);
        }
    };

    const handleGetServicios = async () => {
        try {
            const res = await axios({
                url: "https://backendgeyse.onrender.com/api/servicio",
                method: "GET",
            });
            setServicios(res.data.data.servicio);
        } catch (error) {
            console.error("Error fetching servicios data:", error);
        }
    };

    const handleGetInspecciones = async () => {
        try {
            const res = await axios({
                url: "https://backendgeyse.onrender.com/api/inspeccion",
                method: "GET",
            });
            setInspecciones(res.data.data.inspecion);
        } catch (error) {
            console.error("Error fetching inspecciones data:", error);
        }
    };

    const groupByClienteAndSucursal = (data) => {
        return data.reduce((acc, item) => {
            const cliente = item.extintor.sucursal.cliente.nombre_cliente || 'N/A';
            const sucursal = item.extintor.sucursal.nombre_sucursal || 'N/A';
            if (!acc[cliente]) {
                acc[cliente] = {};
            }
            if (!acc[cliente][sucursal]) {
                acc[cliente][sucursal] = [];
            }
            acc[cliente][sucursal].push(item);
            return acc;
        }, {});
    };

    const handleExportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
    
        // Crear la primera hoja de extintores
        const worksheet1 = workbook.addWorksheet('Extintores');
        worksheet1.columns = [
            { header: 'Nº', key: 'numero', width: 10 },
            { header: 'Cod. Extintor', key: 'codigo_extintor2', width: 20 },
            { header: 'Cod. Empresa', key: 'codigo_empresa2', width: 20 },
            { header: 'Ubicacion', key: 'ubicacion', width: 30 },
            { header: 'Marca', key: 'marca', width: 20 },
            { header: 'Tipo', key: 'tipo', width: 20 },
            { header: 'Capacidad', key: 'capacidad', width: 15 },
            { header: 'Observaciones', key: 'observaciones', width: 15 },
            { header: 'Fecha Registro', key: 'fecha_registro', width: 20 },
            { header: 'Cliente', key: 'cliente', width: 20 },
        ];
    
        // Ordenar los extintores por nombre de cliente
        const sortedExtintores = extintores
            .filter(extintor => extintor.estado === 1)
            .sort((a, b) => {
                const nameA = a?.sucursal?.cliente?.nombre_cliente?.toLowerCase() || '';
                const nameB = b?.sucursal?.cliente?.nombre_cliente?.toLowerCase() || '';
                return nameA.localeCompare(nameB);
            });
    
        const extintorRows = sortedExtintores.map((extintor, index) => {
            return {
                numero: index + 1,
                codigo_extintor2: extintor.codigo_extintor,
                codigo_empresa2: extintor.codigo_empresa,
                ubicacion: extintor.ubicacion,
                marca: extintor.marca,
                tipo: extintor.tipo.nombre_tipo,
                capacidad: extintor.capacidad,
                observaciones: extintor.observaciones,
                fecha_registro: extintor.fecha_registro.slice(0, 10),
                cliente: extintor?.sucursal?.cliente?.nombre_cliente || 'N/A'
            };
        });
    
        worksheet1.addRows(extintorRows);
    
        // Agrupar y añadir filas para las hojas de Servicios e Inspecciones (sin modificar)
        const groupedServicios = groupByClienteAndSucursal(servicios.filter(servicio => servicio.estado === 1));
        const worksheet2 = workbook.addWorksheet('Servicios');
        worksheet2.columns = [
            { header: 'Nº', key: 'numero', width: 10 },
            { header: 'Trabajos Realizados', key: 'trabajos', width: 20 },
            { header: 'Fecha de Servicio', key: 'fecha_servicio', width: 20 },
            { header: 'Cod. Extintor', key: 'codigo_extintor', width: 20 },
            { header: 'Cod. Empresa', key: 'codigo_empresa', width: 20 },
            { header: 'Proximo PH', key: 'proximo_ph', width: 20 },
            { header: 'Proximo Mantenimiento', key: 'proximo_mantenimiento', width: 20 },
        ];
    
        let rowIndexServicios = 1; 
        const empresaToRowMap = {};
    
        Object.keys(groupedServicios).forEach(cliente => {
            rowIndexServicios++;
            worksheet2.addRow([`Cliente: ${cliente}`]).font = { bold: true };
    
            Object.keys(groupedServicios[cliente]).forEach(sucursal => {
                rowIndexServicios++;
                worksheet2.addRow([`Sucursal: ${sucursal}`]).font = { bold: false, italic: true };
    
                groupedServicios[cliente][sucursal].forEach((servicio, index) => {
                    rowIndexServicios++;
                    worksheet2.addRow({
                        numero: index + 1,
                        trabajos:servicio.servicio_trabajos.map(servicioTrabajo => servicioTrabajo.trabajo.nombre_trabajo).join(', '),
                        fecha_servicio: servicio.fecha_servicio ? servicio.fecha_servicio.slice(0, 10) : 'N/A',
                        codigo_extintor: servicio.extintor.codigo_extintor || 'N/A',
                        codigo_empresa: servicio.extintor.codigo_empresa || 'N/A',
                        proximo_ph: servicio.proximo_ph ? servicio.proximo_ph.slice(0, 10) : 'N/A',
                        proximo_mantenimiento: servicio.proximo_mantenimiento ? servicio.proximo_mantenimiento.slice(0, 10) : 'N/A',
                    });
    
                    const codigoEmpresa = servicio.extintor.codigo_empresa;
                    if (!empresaToRowMap[codigoEmpresa]) {
                        empresaToRowMap[codigoEmpresa] = rowIndexServicios;
                    }
                });
            });
        });
    
        const groupedInspecciones = groupByClienteAndSucursal(inspecciones.filter(inspeccion => inspeccion.estado === 1));
        const worksheet3 = workbook.addWorksheet('Inspecciones');
        worksheet3.columns = [
            { header: 'Nº', key: 'numero', width: 10 },
            { header: 'Fecha de Inspección', key: 'fecha_inspeccion', width: 20 },
            { header: 'Desperfectos', key: 'estado', width: 20 },
            { header: 'Cod. Extintor', key: 'codigo_extintor', width: 20 },
            { header: 'Observaciones', key: 'observaciones', width: 30 },
        ];
    
        let rowIndexInspecciones = 1; 
        const extintorToRowMap = {};
    
        Object.keys(groupedInspecciones).forEach(cliente => {
            rowIndexInspecciones++;
            worksheet3.addRow([`Cliente: ${cliente}`]).font = { bold: true };
    
            Object.keys(groupedInspecciones[cliente]).forEach(sucursal => {
                rowIndexInspecciones++;
                worksheet3.addRow([`Sucursal: ${sucursal}`]).font = { bold: false, italic: true };
    
                groupedInspecciones[cliente][sucursal].forEach((inspeccion, index) => {
                    rowIndexInspecciones++;
                    worksheet3.addRow({
                        numero: index + 1,
                        fecha_inspeccion: inspeccion.fecha_inspeccion ? inspeccion.fecha_inspeccion.slice(0, 10) : 'N/A',
                        estado: inspeccion.inspeccion_estados.map(servicioEstado => servicioEstado.estado.nombre_estado).join(', '),
                        codigo_extintor: inspeccion.extintor.codigo_extintor || 'N/A',
                        observaciones: inspeccion.observaciones || 'N/A',
                    });
    
                    const codigoExtintor = inspeccion.extintor.codigo_extintor;
                    if (!extintorToRowMap[codigoExtintor]) {
                        extintorToRowMap[codigoExtintor] = rowIndexInspecciones;
                    }
                });
            });
        });
    
        // Add hyperlinks
        sortedExtintores.forEach((extintor, index) => {
            const cellEmpresa = worksheet1.getCell(`C${index + 2}`);
            const rowInServicios = empresaToRowMap[extintor.codigo_empresa];
            if (rowInServicios) {
                cellEmpresa.value = { text: extintor.codigo_empresa, hyperlink: `#Servicios!E${rowInServicios}` };
            }
    
            const cellExtintor = worksheet1.getCell(`B${index + 2}`);
            const rowInInspecciones = extintorToRowMap[extintor.codigo_extintor];
            if (rowInInspecciones) {
                cellExtintor.value = { text: extintor.codigo_extintor, hyperlink: `#Inspecciones!D${rowInInspecciones}` };
            }
        });
    
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
    
        saveAs(blob, 'Extintores_Servicios_Inspecciones.xlsx');
    };

    return (
        <div>
           
            <button className='btn btn-primary' onClick={handleExportToExcel}>Download as XLSX</button>
        
        </div>
    );
}

export default ExportExcel;
