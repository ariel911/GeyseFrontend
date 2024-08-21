import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login/login';
import ProtectedRoutes from './routes/ProtectedRoutes';
import Home from './pages/home/Home';
import Entrada from './components/Entrada/Entrada';
import Usuario from './components/administracion/usuario';
import Cliente from './components/administracion/clientes';
import Sucursal from './components/administracion/sucursal';
import Rol from './components/administracion/rol';
import Extintor from './components/extintor/extintor';
import Inspeccion from './components/inspeccion/inspeccion';
import Servicio from './components/servicios/servicio';
import ExportExcel from './components/export/export';
import Pagina from './pages/pagina/pagina';
import VisorQr from './pages/visorQr/visorQr';
import LoginVisor from './pages/visorQr/loginVisor';

import { PAGINA, LOGIN, HOME_INICIO, HOME_USUARIO, HOME_ROL, HOME_CLIENTE, HOME_SUCURSAL, HOME_EXTINTOR, HOME_INSPECCION, HOME_SERVICIO } from './routes/path';
import ProtectedRoutesCliente from './routes/protectedRoutesCliente';

function App() {
  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState("");

  const addToken = (token) => { setToken(token) }
  const addUsuario = (usuario) => { setUsuario(usuario) }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={PAGINA} element={<Pagina />} />
          <Route path={'/pagina/login'} element={<LoginVisor />} />
          <Route element={<ProtectedRoutesCliente />}>
            <Route path={'/pagina/excel'} element={<ExportExcel />} />
            <Route path={'/pagina/extintoresQr'} element={<VisorQr />} />
          </Route>
          {/* <Route path="/extintores/:extintorId" element={<Qr />} /> */}
          <Route path={LOGIN} element={<Login addToken={addToken} addUsuario={addUsuario} />} />
          <Route element={<ProtectedRoutes />}>
            <Route path={HOME_INICIO} element={<div className='contenedor2'><Home usuario={usuario} componente={<Entrada />} />  </div>} />
            {/* <Route path=""  element={<div className='contenedor2'><Home component={<ExtintorDetail />} /> </div>}/> */}
            <Route path={HOME_USUARIO} element={<div className='contenedor2'><Home componente={<Usuario />} /> </div>} />
            <Route path={HOME_ROL} element={<div className='contenedor2'><Home componente={<Rol />} /> </div>} />
            <Route path={HOME_CLIENTE} element={<div className='contenedor2'><Home componente={<Cliente />} /> </div>} />
            <Route path={HOME_SUCURSAL} element={<div className='contenedor2'><Home componente={<Sucursal />} /> </div>} />
            <Route path={HOME_EXTINTOR} element={<div className='contenedor2'><Home componente={<Extintor />} /> </div>} />
            <Route path={HOME_INSPECCION} element={<div className='contenedor2'><Home componente={<Inspeccion />} /> </div>} />
            <Route path={HOME_SERVICIO} element={<div className='contenedor2'><Home componente={<Servicio />} /> </div>} />
            {/*          <Route path={HOME_GENERADOR} element={<div className='contenedor2'><Home componente={<Qr />} /> </div>} /> */}
          </Route>
          <Route path='*' element={<Navigate to={PAGINA} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
