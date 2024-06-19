///////////////////////////////////////////////////////////////
//CODIGO SIN FILTRADO NI BUSCADOR

import React, { useEffect, useState } from 'react';
import { EditPaciente } from '../components/EditPaciente';
import {ListObservations} from '../components/ListObservations';
import { useNavigate } from 'react-router-dom';



export const ListPatients = () => {
  // const { pacientes, setPacientes } = props;

  const [pacientes, setPacientes] = useState([]);
  //const [showEditForm, setShowEditForm] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState(null);
  const navigate = useNavigate();
  const [showObservations, setShowObservations] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null); 

  useEffect(() => {
    async function getPacientes() {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);

    }
    getPacientes();
  }, []);

  useEffect(() => {
    if (editedPaciente === null) {
      updatePacienteList(); // Actualizar la lista de pacientes cuando se cierra el formulario de edición
    }
  }, [editedPaciente]);




  const deletePaciente = async (pacienteId) => {
    const res = await fetch(`/api/pacientes/${pacienteId}`, {
      method: "DELETE"
    });
    const json = await res.json();
    if (json.acknowledged) {
      setPacientes(currentPacientes => {
        return currentPacientes.filter((currentPaciente) => currentPaciente._id !== pacienteId);
      });
    }
  };

  const handleEditClick = (paciente) => {
    setEditedPaciente(paciente);
  };

  const handleCloseEdit = () => {
    setEditedPaciente(null); // Restablecer editedPaciente a null para ocultar el componente EditPaciente
    updatePacienteList();
  };

  const updatePacienteList = async () => {
    try {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);
    } catch (error) {
      console.error('Error al actualizar la lista de pacientes:', error);
    }
  };

  const handleOpenObservations = (paciente) => {
    setSelectedPatient(paciente);
    setShowObservations(true);
  };



  return (
    <div>
    {showObservations ? (
      <ListObservations paciente={selectedPatient} onClose={() => setShowObservations(false)} />
    ) : (
    editedPaciente ? (
      <EditPaciente paciente={editedPaciente} onClose={handleCloseEdit} updatePacienteList={updatePacienteList} />
    ) : (
      <div>
        {pacientes && pacientes.length > 0 ? (
          pacientes.map(p => (

            <article key={p._id} className="patient-item">
              <div className="patient-info">
              <p className="attribute">Estado: <span >{p.active ? ' Activo' : ' Inactivo'}</span></p>
              {p.name && p.name.length > 0 && p.name.map(name => name.use === 'official' && (
                <p key={`official_${name.given.join(' ')}`} className='attribute'>
                  Nombre oficial: <span>
                  {name.given.join(' ') + ' ' + name.family}</span></p>
              ))}
              {p.name && p.name.length > 0 && p.name.map(name => name.use === 'usual' && (
                <p key={`usual_${name.given[0]}`} className='attribute'>
                  Apodo:<span> {name.given[0]}</span>
                </p>
              ))}
              
             
              <p className="attribute">Género: <span>{p.gender}</span></p>
              <p className="attribute">Fecha de nacimiento: <span>{new Date(p.birthDate).toLocaleDateString('es-ES')}</span></p>
              <p className='attribute'>Contacto: <span>{p.telecom[2].value}</span></p>
              </div>
              <div className='patient-buttons'>
                <button className="editButton" onClick={() => handleEditClick(p)}>Editar</button>
                <button className="deleteButton" onClick={() => deletePaciente(p._id)}>Borrar</button>
                <button className="historialButton" onClick={() => handleOpenObservations(p)}>Ver historial médico</button>
                 
              </div>
            </article>
          ))


        ) : (

          <h2>No hay pacientes para mostrar</h2>
        )}

      </div >
    )
  )}
  </div>
  )
}
export default ListPatients;



// CODIGO BUSCADOR SOLO
/*

import React, { useEffect, useState } from 'react';
import { EditPaciente } from '../components/EditPaciente';


export const ListPatients = () => {
  // const { pacientes, setPacientes } = props;

  const [pacientes, setPacientes] = useState([]);
  //const [showEditForm, setShowEditForm] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState(null);


  //Para el buscador
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    async function getPacientes() {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);
      setFilteredPacientes(pacientes); //pasamos todos los pacientes que hay
    }
    getPacientes();
  }, []);

  //filtrado para el buscador

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredResults = pacientes.filter(paciente =>
      paciente.name.toLowerCase().includes(value.toLowerCase())

    );
    setFilteredPacientes(filteredResults);
  };





  const deletePaciente = async (pacienteId) => {
    const res = await fetch(`/api/pacientes/${pacienteId}`, {
      method: "DELETE"
    });
    const json = await res.json();
    if (json.acknowledged) {
      setPacientes(currentPacientes => {
        return currentPacientes.filter((currentPaciente) => currentPaciente._id !== pacienteId);
      });
    }
  };

  const handleEditClick = (paciente) => {
    setEditedPaciente(paciente);
  };

  const handleCloseEdit = () => {
    setEditedPaciente(null); // Restablecer editedPaciente a null para ocultar el componente EditPaciente
  };

  const updatePacienteList = async () => {
    try {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);
    } catch (error) {
      console.error('Error al actualizar la lista de pacientes:', error);
    }
  };



  return (
    <div>
       <div className='barra-buscador'>
      <input className='buscador'
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleSearch}
      />
      <img className="buscar" src='/buscar.avif' />
      </div>



      {filteredPacientes.map(paciente => (
        <article key={paciente._id} className="patient-item">
          <p className="active">Estado activo:{paciente.active}</p>
          <p className="name">Nombre:{paciente.name}</p>
          <p className="gender">Género:{paciente.gender}</p>
          <p className="birthDate">Fecha de nacimiento:{paciente.birthDate}</p>
          <div>
            <button className="edit" onClick={() => handleEditClick(paciente)}>Editar</button>
            <button className="delete" onClick={() => deletePaciente(paciente._id)}>Borrar</button>
          </div>
        </article>
      ))}

      {editedPaciente && (
        <EditPaciente paciente={editedPaciente} onClose={handleCloseEdit} updatePacienteList={updatePacienteList} />
      )}

    </div>
  );
};
export default ListPatients;
*/






/// CODIGO CON BUSCADOR Y FILTRADO
/*
import React, { useEffect, useState } from 'react';
import { EditPaciente } from '../components/EditPaciente';


export const ListPatients = () => {
  // const { pacientes, setPacientes } = props;

  const [pacientes, setPacientes] = useState([]);
  //const [showEditForm, setShowEditForm] = useState(false);
  const [editedPaciente, setEditedPaciente] = useState(null);


  //Para el buscador
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //Para el filtrado
  const [filterByActive, setFilterByActive] = useState('all'); // Opción predeterminada: mostrar todos los pacientes
  const [filterByGender, setFilterByGender] = useState('all'); // Opción predeterminada: mostrar todos los pacientes
  


  useEffect(() => {
    async function getPacientes() {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);
      setFilteredPacientes(pacientes); //pasamos todos los pacientes que hay
    }
    getPacientes();
  }, []);


 
  //filtrado + buscador (tambien se tiene que filtrar)
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterPacientes(value, filterByActive, filterByGender);
  };

  const handleFilterByActiveChange = (e) => {
    const value = e.target.value;
    setFilterByActive(value);
    filterPacientes(searchTerm, value, filterByGender);
  };

  const handleFilterByGenderChange = (e) => {
    const value = e.target.value;
    setFilterByGender(value);
    filterPacientes(searchTerm, filterByActive, value);
  };

  const filterPacientes = (searchTerm, activeOption, genderOption) => {
    let filteredResults = pacientes.filter(paciente =>
      (paciente.name.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === '') &&
      (activeOption === 'all' || paciente.active === activeOption) &&
      (genderOption === 'all' || paciente.gender === genderOption)
    );
    setFilteredPacientes(filteredResults);
  };



  const deletePaciente = async (pacienteId) => {
    const res = await fetch(`/api/pacientes/${pacienteId}`, {
      method: "DELETE"
    });
    const json = await res.json();
    if (json.acknowledged) {
      setPacientes(currentPacientes => {
        return currentPacientes.filter((currentPaciente) => currentPaciente._id !== pacienteId);
      });
    }
  };

  const handleEditClick = (paciente) => {
    setEditedPaciente(paciente);
  };

  const handleCloseEdit = () => {
    setEditedPaciente(null); // Restablecer editedPaciente a null para ocultar el componente EditPaciente
  };

  const updatePacienteList = async () => {
    try {
      const res = await fetch("/api/pacientes");
      const pacientes = await res.json();
      setPacientes(pacientes);
    } catch (error) {
      console.error('Error al actualizar la lista de pacientes:', error);
    }
  };



  return (
    <div>
       <div className='barra-buscador'>
      <input className='buscador'
        type="text"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={handleSearch}
      />
      <img className="buscar" src='/buscar.avif' />
      </div>
     
      <div className='filtrado'>
        <select value={filterByActive} onChange={handleFilterByActiveChange} name='ESTADO'>
          <option value="all">ESTADO</option>
          <option value="true">True</option>
          <option value="false">False</option>
          <option value="all">Todos</option>
        </select>
        
        <select value={filterByGender} onChange={handleFilterByGenderChange}>
          <option value="all">GÉNERO</option>
          <option value="male">Masculino</option>
          <option value="female">Femenino</option>
          <option value="all">Todos</option>
          <option value="other">Otro</option>
        </select>
      </div>
  
  
      {filteredPacientes.map(paciente => (
        <article key={paciente._id} className="patient-item">
          <p className="active">Estado activo:{paciente.active}</p>
          <p className="name">Nombre:{paciente.name}</p>
          <p className="gender">Género:{paciente.gender}</p>
          <p className="birthDate">Fecha de nacimiento:{paciente.birthDate}</p>
          <div>
            <button className="edit" onClick={() => handleEditClick(paciente)}>Editar</button>
            <button className="delete" onClick={() => deletePaciente(paciente._id)}>Borrar</button>
          </div>
        </article>
      ))}

      {editedPaciente && (
        <EditPaciente paciente={editedPaciente} onClose={handleCloseEdit} updatePacienteList={updatePacienteList} />
      )}
      
    </div>
  );
};
export default ListPatients;

*/


