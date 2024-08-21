import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
import "./rol.css"

const Rol = () => {
    const [nombre_rol, setNombreRol] = useState('');
    const [rol, setRol] = useState([]);
    const [menu, setMenu] = useState([]);
    const [menus, setMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingRol, setEditingRol] = useState(null); // Estado para el rol en edición
    const [editNombreRol, setEditNombreRol] = useState('');
    const [editSelectedMenu, setEditSelectedMenu] = useState([]);

    useEffect(() => {
        handleGetUsers();
        handleGetMenus();
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedMenu(selectedOption);
    };

    const roleOptions = menus?.map((menu) => ({
        value: menu.id,
        label: menu.nombre_menu
    }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = selectedMenu.map((option) => option.value);

        if (!nombre_rol) {
            swal({
                title: "Error al Agregar Cargo!",
                text: "Por favor, completa todos los campos requeridos",
                icon: "error",
                button: "Ok",
            });
            return;
        }

        try {
            const response = await axios.post(
                'https://backendgeyse.onrender.com/api/rol',
                {
                    nombre_rol,
                    menus: selectedOptionIds,
                    estado: 1
                }
            );

            setNombreRol('');
            setMenu([]);
            setSelectedMenu([]);

            swal({
                title: "Cargo Agregado!",
                icon: "success",
                button: "Ok",
            });
            handleGetUsers();
        } catch (error) {
            console.error(error);
        }
    };

    const handleGetUsers = async () => {
        const res = await axios.get("https://backendgeyse.onrender.com/api/rol");
        setRol(res.data.data.rol);
    };

    const handleGetMenus = async () => {
        const res = await axios.get("https://backendgeyse.onrender.com/api/menu");
        setMenus(res.data.data.menu);
    };

    const handleDarBaja = async (cargo) => {
        try {
            await axios.put(`https://backendgeyse.onrender.com/api/rol/baja/${cargo.id}`, { estado: 0 });
            handleGetUsers();
            swal({
                title: `Cargo ${cargo.nombre_rol} dado de baja`,
                icon: "success",
                button: "Ok",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDarReintegrar = async (cargo) => {
        try {
            await axios.put(`https://backendgeyse.onrender.com/api/rol/baja/${cargo.id}`, { estado: 1 });
            handleGetUsers();
            swal({
                title: `Cargo ${cargo.nombre_rol} reintegrado`,
                icon: "success",
                button: "Ok",
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleChangeBuscador = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCargos = rol?.filter(rol =>
        rol?.nombre_rol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditClick = (rol) => {
        setEditingRol(rol);
        setEditNombreRol(rol.nombre_rol);
        setEditSelectedMenu(rol.menu_rols.map(menuRol => ({
            value: menuRol.menu.id,
            label: menuRol.menu.nombre_menu
        })));
    };

    const handleEditChange = (selectedOption) => {
        setEditSelectedMenu(selectedOption);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = editSelectedMenu.map((option) => option.value);

        if (!editNombreRol) {
            swal({
                title: "Error al Editar Cargo!",
                text: "Por favor, completa todos los campos requeridos",
                icon: "error",
                button: "Ok",
            });
            return;
        }

        try {
            await axios.put(`https://backendgeyse.onrender.com/api/rol/${editingRol.id}`, {
                nombre_rol: editNombreRol,
                menus: selectedOptionIds,
                estado: editingRol.estado
            });

            setEditingRol(null);
            setEditNombreRol('');
            setEditSelectedMenu([]);

            swal({
                title: "Cargo Editado!",
                icon: "success",
                button: "Ok",
            });
            handleGetUsers();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='rol'>
            <h1 className="titu4">Cargos</h1>

            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="agregar-tab" data-bs-toggle="tab" data-bs-target="#agregar" type="button" role="tab" aria-controls="agregar" aria-selected="true">Agregar Cargo</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab" aria-controls="lista" aria-selected="false">Lista de Cargos</button>
                </li>
                <li className="nav-item" role="presentation">
                    <button className="nav-link" id="bajas-tab" data-bs-toggle="tab" data-bs-target="#bajas" type="button" role="tab" aria-controls="bajas" aria-selected="false">Bajas</button>
                </li>
            </ul>

            <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="agregar" role="tabpanel" aria-labelledby="agregar-tab">
                    <div className='nuevoRol'>
                        <form onSubmit={handleSubmit} className="justify-content-center align-self-center">
                            <div className='row'>
                                <div className="mb-3 col">
                                    <label htmlFor="nombre_rol" className="form-label">Nombre Cargo</label>
                                    <input type="text" className="form-control" id="nombre_rol" value={nombre_rol} onChange={(e) => setNombreRol(e.target.value)} required />
                                </div>
                                <div className="mb-3 col">
                                    <label htmlFor="rol" className="form-label">Accesos</label>
                                    <Select
                                        id="rol"
                                        value={selectedMenu}
                                        onChange={handleChange}
                                        options={roleOptions}
                                        placeholder="Seleccione"
                                        isMulti
                                        className=""
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                            </div>
                            <div className="botones mt-2">
                                <div>
                                    <button type="submit" className="btn btn-primary boton2">Agregar</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="tab-pane fade" id="lista" role="tabpanel" aria-labelledby="lista-tab">
                    
                    <form className="d-flex buscador" role="search">
                        <input
                            type="text"
                            placeholder="Buscar Cargo..."
                            value={searchTerm}
                            onChange={handleChangeBuscador}
                            className="form-control me-2"
                        />
                    </form>
                    <div className="table table-responsive tablaRol">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cargo</th>
                                    <th scope="col">Accesos</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCargos?.map((rol, index) => rol.estado == 1 && (
                                    <tr key={rol.id}>
                                        <td>{index + 1}</td>
                                        <td>{rol.nombre_rol}</td>
                                        <td>
                                            {rol.menu_rols.length > 0 ?
                                                rol.menu_rols.map(menuRol => menuRol.menu.nombre_menu).join(', ')
                                                : 'No tiene menús'}
                                        </td>
                                        <td>{rol.estado == 1 ? 'activo' : 'no activo'}</td>
                                        <td className='accion'>
                                            <button className='btn btn-danger boton' onClick={() => handleDarBaja(rol)}>Baja</button>
                                            <button className='btn btn-primary boton' onClick={() => handleEditClick(rol)} data-bs-toggle="modal" data-bs-target="#modalEdit">Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="tab-pane fade" id="bajas" role="tabpanel" aria-labelledby="bajas-tab">
                    
                    <div className="table table-responsive tablaRol">
                        <table className="table table-sm">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Cargo</th>
                                    <th scope="col">Accesos</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rol?.map((rol, index) => rol.estado == 0 && (
                                    <tr key={rol.id}>
                                        <td>{index + 1}</td>
                                        <td>{rol.nombre_rol}</td>
                                        <td>
                                            {rol.menu_rols.length > 0 ?
                                                rol.menu_rols.map(menuRol => menuRol.menu.nombre_menu).join(', ')
                                                : 'No tiene menús'}
                                        </td>
                                        <td>{rol.estado == 1 ? 'activo' : 'no activo'}</td>
                                        <td>
                                            <button className='btn btn-danger boton2' onClick={() => handleDarReintegrar(rol)}>Reintegrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de edición */}
            <div className='modal fade' id="modalEdit" tabIndex="-1" aria-labelledby="modalEditLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalEditLabel">Editar Cargo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleEditSubmit}>
                                <div className='mb-3'>
                                    <label htmlFor="edit_nombre_rol" className="form-label">Nombre Cargo</label>
                                    <input type="text" className="form-control" id="edit_nombre_rol" value={editNombreRol} onChange={(e) => setEditNombreRol(e.target.value)} required />
                                </div>
                                <div className='mb-3'>
                                    <label htmlFor="edit_rol" className="form-label">Accesos</label>
                                    <Select
                                        id="edit_rol"
                                        value={editSelectedMenu}
                                        onChange={handleEditChange}
                                        options={roleOptions}
                                        placeholder="Seleccione"
                                        isMulti
                                        className=""
                                        closeMenuOnSelect={false}
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="submit" className="btn btn-primary">Guardar cambios</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rol;
