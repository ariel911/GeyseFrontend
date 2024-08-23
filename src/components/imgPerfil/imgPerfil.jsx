
import { useNavigate} from 'react-router-dom'
import {useState} from 'react'
import './imgPerfil.css'
import imagenCircular from '../../assets/user.png'
const ImgPerfil = () => {
  const navigate = useNavigate()

  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive(!isActive);
  };
  const handleLogOut = ({Component}) => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id");
    localStorage.removeItem("Rol");
    navigate("/login")
  }

  return (
    <div className='elementoLink' >
      <div  >
        <img src={imagenCircular} className='imagenCircular' onClick={handleClick} alt='hi'/>

      </div>
      <ul className={isActive ? 'submenuPerfilMostrar' : 'submenuPerfil'} id="subMenu">
        <li className='perfilLink' >
          <a href='/#'>Configuracion</a>
        </li>
        <li className='perfilLink'>
          <a type='button' className='buttonLogout' onClick={handleLogOut}>Cerrar</a>
        </li>
      </ul>
    </div>
  )
}

export default ImgPerfil
