import { useState, useEffect } from 'react';
import axios from 'axios';
import './NavBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faUser, faGlobe, faClipboard, faAngleDown, faXmark, faFireExtinguisher, faFireFlameSimple } from '@fortawesome/free-solid-svg-icons';

import { PAGINA, HOME_ROL, HOME_USUARIO, HOME_CLIENTE, HOME_SUCURSAL, HOME_EXTINTOR, HOME_INSPECCION, HOME_SERVICIO } from '../../routes/path';

const NavBar = ({ brand }) => {
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('Rol');
    const id = localStorage.getItem('id');
    const [isMenuHidden, setMenuHidden] = useState(false);
    const [menuPermissions, setMenuPermissions] = useState([]);
    const navigate = useNavigate(); // Hook para la navegación

    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const res = await axios.get("https://backendgeyse.onrender.com/api/usuarios");
                const currentUser = res.data.data.usuarios.find(user => user.id === id);
                if (currentUser) {
                    const permissions = currentUser.rol.menu_rols.map(menuRol => menuRol.menu.nombre_menu);
                    setMenuPermissions(permissions);
                }
            } catch (error) {
                console.error("Error fetching user permissions:", error);
            }
        };

        fetchUserPermissions();
    }, [id]);

    const handleMenuClick = () => {
        setMenuHidden(!isMenuHidden);
        document.getElementById('nav_check').checked = false; // Desmarca el checkbox
    };

    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nombre");
        localStorage.removeItem("id");
        localStorage.removeItem("Rol");
        localStorage.removeItem("user"); // Asegúrate de eliminar toda la información del usuario
        navigate("/pagina");
    };

    return (
        <nav className={`navegacion ${isMenuHidden ? 'menu-show' : 'menu-hidden'}`}>
            <ul className='ul'>
                {((menuPermissions.includes('usuarios')|| (menuPermissions.includes('cargos')) || (menuPermissions.includes('clientes')) ||(menuPermissions.includes('sucursales'))) || menuPermissions.includes('todo')) && (
                    <li className='elemento elemento1'>
                        <label htmlFor="check" className='text barraSubMenu'>
                            <div className='div1'>
                                <FontAwesomeIcon className='icono' icon={faUser} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                            </div>
                            <p>{brand[1]}</p>
                            <div className='div2'>
                                <FontAwesomeIcon className='faAngle' icon={faAngleDown} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                            </div>
                        </label>
                        <input type="checkbox" id='check' hidden />
                        <ul className='submenu subm2'>
                            {(menuPermissions.includes('todo') || menuPermissions.includes('usuarios')) && <li className='subitem' onClick={handleMenuClick}><Link to={HOME_USUARIO}>Usuarios</Link></li>}
                            {(menuPermissions.includes('todo') || menuPermissions.includes('cargos')) && <li className='subitem' onClick={handleMenuClick}><Link to={HOME_ROL}>Cargos</Link></li>}
                            {(menuPermissions.includes('todo') || menuPermissions.includes('clientes')) && <li className='subitem' onClick={handleMenuClick}><Link to={HOME_CLIENTE}>Clientes</Link></li>}
                            {(menuPermissions.includes('todo') || menuPermissions.includes('sucursales')) && <li className='subitem' onClick={handleMenuClick}><Link to={HOME_SUCURSAL}>Sucursales</Link></li>}
                        </ul>
                    </li>
                )}
                {(menuPermissions.includes('todo') || menuPermissions.includes('extintores')) && (
                    <li className='elemento' onClick={handleMenuClick}>
                        <Link to={HOME_EXTINTOR} className='text'>
                            <div className='div1'>
                                <FontAwesomeIcon className='icono' icon={faFireExtinguisher} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                            </div>
                            <p>{brand[4]}</p>
                        </Link>
                    </li>
                )}
                {(menuPermissions.includes('todo') || menuPermissions.includes('servicios')) && (
                    <li className='elemento elemento2' onClick={handleMenuClick}>
                        <Link to={HOME_SERVICIO} className='text'>
                            <div className='div1 barraSubMenu2'>
                                <FontAwesomeIcon className='icono' icon={faFireFlameSimple} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                            </div>
                            <p>{brand[2]}</p>
                        </Link>
                    </li>
                )}
                {(menuPermissions.includes('todo') || menuPermissions.includes('inspeccion')) && (
                    <li className='elemento elemento3' onClick={handleMenuClick}>
                        <Link to={HOME_INSPECCION} className='text'>
                            <div className='div1'>
                                <FontAwesomeIcon className='icono' icon={faClipboard} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                            </div>
                            <p>{brand[3]}</p>
                        </Link>
                    </li>
                )}

                <li className='elemento' onClick={handleMenuClick}>
                    <Link to={PAGINA} className='text'>
                        <div className='div1'>
                            <FontAwesomeIcon className='icono' icon={faGlobe} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                        </div>
                        <p>{brand[5]}</p>
                    </Link>
                </li>

                <li className='elemento'>
                    <Link to='*' className='text' onClick={handleLogOut}>
                        <div className='div1'>
                            <FontAwesomeIcon className='icono' icon={faXmark} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0" }} />
                        </div>
                        <p>{brand[6]}</p>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
