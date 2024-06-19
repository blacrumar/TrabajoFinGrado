import React from 'react'
import { Routes, Route, Link, BrowserRouter, NavLink } from 'react-router-dom';
import { Welcome } from '../components/Welcome';
import { ListPatients } from '../components/ListPatients';
import { EditPaciente } from '../components/EditPaciente';
import { NewPatient } from '../components/NewPatient';
import { ListPractitioners } from '../components/ListPractitioners';
import { NewPractitioner } from '../components/NewPractitioner';
import { Error } from '../components/Error';
import { EditPractitioner } from '../components/EditPractitioner';
import { ListObservations } from '../components/ListObservations';

export const RouterPrincipal = () => {
    return (
        <BrowserRouter>

            {/* Cabecera */}
            <header className="header">
                <div className="logo">
                    <img src="/logo.jpg" />
                </div>
                <h1>Centro de rehabilitación BCM</h1>
            </header>

            <nav className="nav">
                <ul>
                    <li><NavLink to="/welcome">Inicio</NavLink></li>
                    <li><NavLink to="/listPatients">Pacientes</NavLink></li>
                    <li><NavLink to="/newPatient">Nuevo paciente</NavLink></li>
                    <li><NavLink to="/listPractitioners">Profesionales</NavLink></li>
                    <li><NavLink to="/newPractitioner">Nuevo profesional</NavLink></li>
                    
                    
                </ul>
            </nav>

            <section className="content">
                <Routes>
                    <Route path='/' element={<Welcome />} />
                    <Route path='/welcome' element={<Welcome />} />
                    <Route path='/listPatients' element={<ListPatients />} />
                    <Route path='/editPaciente' element={<EditPaciente />} />
                    <Route path='/editPractitioner' element={<EditPractitioner />} />
                    <Route path='/newPatient' element={<NewPatient />} />
                    <Route path='/listPractitioners' element={<ListPractitioners />} />
                    <Route path='/newPractitioner' element={<NewPractitioner />} />
                    <Route path='/pacientes/:id/observations' element={<ListObservations />} />
                    

                    <Route path='*' element={<Error />} />

                </Routes>
            </section>


            {/* Pie de pagina */}
            <footer className="footer">
                &copy; Blanca Cruz Martínez TFG - <a src="https://www.linkedin.com/in/blanca-cruz-martinez-/">https://www.linkedin.com/in/blanca-cruz-martinez-/</a>
            </footer>


        </BrowserRouter>
    )
}
