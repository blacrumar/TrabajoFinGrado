// CÓDIGO MOSTRANDO SIEMPRE EL MISMO PROFESIONAL
/*
import React, { useEffect, useState } from "react";

export const ListObservations = ({ paciente, onClose }) => {

  const [observations, setObservations] = useState([]);
  const [filteredObservations, setFilteredObservations] = useState([]);
  const [practitioners, setPractitioners] = useState({});

  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fetch('/api/observations');
        const data = await response.json();
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };

    fetchObservations();
  }, []);

  //Obtener datos del practitioner
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await fetch('/api/practitioners');
        const data = await response.json();
        const practitionersMap = {};
        data.forEach(practitioner => {
          practitionersMap[practitioner._id.$oid] = practitioner;
        });
        setPractitioners(practitionersMap);
      } catch (error) {
        console.error('Error fetching practitioners:', error);
      }
    };
    fetchPractitioners();
  }, [observations, paciente]); // Dependencias que hacen que se vuelva a ejecutar cuando cambien



  useEffect(() => {
    if (observations.length > 0 && paciente && Object.keys(practitioners).length > 0) {
      const filtered = observations.filter(obs => obs.subject === paciente._id);
      // Mapear observaciones y ajustar el campo 'performer' con el nombre del sanitario correspondiente
      const updatedObservations = filtered.map(obs => ({
        ...obs,
        performerName: getPractitionerName(obs.performer.$oid)
      }));
      setFilteredObservations(updatedObservations);
    }
  }, [observations, paciente, practitioners]); // Añadir practitioners a las dependencias


  const getPatientName = (patient) => {
    if (!patient || !patient.name || patient.name.length === 0) return 'Desconocido';
    const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
    return `${officialName.given.join(' ')} ${officialName.family}`;
  };

  // Función para obtener el nombre del practitioner
  const getPractitionerName = (performerId) => {
    const practitioner = practitioners[performerId];
    if (practitioner) {
      const name = practitioner.name[0];
      return `${name.prefix ? name.prefix.join(' ') : ''} ${name.given.join(' ')} ${name.family}`;
    }
    return 'Desconocido';
  };


  return (
    <div>
      <h2>Listado de observaciones de {getPatientName(paciente)}</h2>
      {
        filteredObservations.length > 0 ? (
          <div>

            <table border="2px" className="tableStyle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Interpretación</th>
                  <th>Código</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Categoría</th>
                  <th>Sanitario</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredObservations.map(obs => (
                    <tr key={obs._id.$oid}>
                      <td>{new Date(obs.effectiveDateTime).toLocaleDateString('es-ES')}</td>
                      <td>{obs.interpretation?.text || 'N/A'}</td>
                      <td>{obs.code?.text || 'N/A'}</td>
                      <td>{obs.valueString || 'N/A'}</td>
                      <td>{obs.status}</td>
                      <td>{obs.category?.text || 'N/A'}</td>
                      <td>{obs.performerName}</td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
            <div className="button-container">
              <button onClick={onClose} className="close-button">Cerrar</button>
            </div>
          </div>

        ) : (
          <p>No hay observaciones para este paciente.</p>
        )
      }
    </div>
  );
};

export default ListObservations;
*/


// CÓDIGO MOSTRANDO DESCONOCIDO
/*
import React, { useEffect, useState } from "react";

export const ListObservations = ({ paciente, onClose }) => {
  const [observations, setObservations] = useState([]);
  const [filteredObservations, setFilteredObservations] = useState([]);
  const [practitioners, setPractitioners] = useState({});

  // Obtener observaciones al cargar
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fetch('/api/observations');
        const data = await response.json();
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };

    fetchObservations();
  }, []);

  // Obtener datos de practitioners cuando cambien las observaciones o el paciente
  useEffect(() => {
    const fetchPractitioners = async () => {
      try {
        const response = await fetch('/api/practitioners');
        const data = await response.json();
        const practitionersMap = {};
        data.forEach(practitioner => {
          practitionersMap[practitioner._id.$oid] = practitioner;
        });
        setPractitioners(practitionersMap);
      } catch (error) {
        console.error('Error fetching practitioners:', error);
      }
    };

    fetchPractitioners();
  }, [observations, paciente]); // Dependencias que hacen que se vuelva a ejecutar cuando cambien

  // Actualizar filteredObservations cuando cambien las observaciones, el paciente o los practitioners
  useEffect(() => {
    if (observations.length > 0 && paciente && Object.keys(practitioners).length > 0) {
      const filtered = observations.filter(obs => obs.subject === paciente._id);
      // Mapear observaciones y ajustar el campo 'performer' con el nombre del sanitario correspondiente
      const updatedObservations = filtered.map(obs => ({
        ...obs,
        performerName: getPractitionerName(obs.performer)
      }));
      setFilteredObservations(updatedObservations);
    }
  }, [observations, paciente, practitioners]); // Añadir practitioners a las dependencias

  // Función para obtener el nombre del paciente
  const getPatientName = (patient) => {
    if (!patient || !patient.name || patient.name.length === 0) return 'Desconocido';
    const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
    return `${officialName.given.join(' ')} ${officialName.family}`;
  };

  // Función para obtener el nombre del practitioner
  const getPractitionerName = (performerId) => {
    const practitioner = practitioners[performerId];
    if (practitioner) {
      const name = practitioner.name[0];
      return `${name.prefix ? name.prefix.join(' ') : ''} ${name.given.join(' ')} ${name.family}`;
    }
    return 'Desconocido';
  };

  return (
    <div>
      <h2>Listado de observaciones de {getPatientName(paciente)}</h2>
      {
        filteredObservations.length > 0 ? (
          <div>

            <table border="2px" className="tableStyle">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Interpretación</th>
                  <th>Código</th>
                  <th>Valor</th>
                  <th>Estado</th>
                  <th>Categoría</th>
                  <th>Sanitario</th>
                </tr>
              </thead>
              <tbody>
                {
                  filteredObservations.map(obs => (
                    <tr key={obs._id.$oid}>
                      <td>{new Date(obs.effectiveDateTime).toLocaleDateString('es-ES')}</td>
                      <td>{obs.interpretation?.text || 'N/A'}</td>
                      <td>{obs.code?.text || 'N/A'}</td>
                      <td>{obs.valueString || 'N/A'}</td>
                      <td>{obs.status}</td>
                      <td>{obs.category?.text || 'N/A'}</td>
                      <td>{obs.performer}</td>
                    </tr>
                  ))
                }
              </tbody>

            </table>
            <div className="button-container">
              <button onClick={onClose} className="close-button">Cerrar</button>
            </div>
          </div>

        ) : (
          <p>No hay observaciones para este paciente.</p>
        )
      }
    </div>
  );
};

export default ListObservations;

*/


// CÓDIGO MOSTRANDO ID PROFESIONAL
import React, { useEffect, useState } from "react";

export const ListObservations = ({ paciente, onClose }) => {
  const [observations, setObservations] = useState([]);
  const [filteredObservations, setFilteredObservations] = useState([]);


  // Obtener observaciones al cargar
  useEffect(() => {
    const fetchObservations = async () => {
      try {
        const response = await fetch('/api/observations');
        const data = await response.json();
        setObservations(data);
      } catch (error) {
        console.error('Error fetching observations:', error);
      }
    };

    fetchObservations();
  }, []);


  useEffect(() => {
    if (observations.length > 0 && paciente) {
    const filtered = observations.filter(obs => obs.subject === paciente._id);
    setFilteredObservations(filtered);
    }
    }, [observations, paciente]);

// Función para obtener el nombre del paciente
const getPatientName = (patient) => {
  if (!patient || !patient.name || patient.name.length === 0) return 'Desconocido';
  const officialName = patient.name.find(n => n.use === 'official') || patient.name[0];
  return `${officialName.given.join(' ')} ${officialName.family}`;
};



return (
  <div>
    <h2>Listado de observaciones de {getPatientName(paciente)}</h2>
    {
      filteredObservations.length > 0 ? (
        <div>

          <table border="2px" className="tableStyle">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Interpretación</th>
                <th>Código</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Categoría</th>
                <th>Sanitario</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredObservations.map(obs => (
                  <tr key={obs._id.$oid}>
                    <td>{new Date(obs.effectiveDateTime).toLocaleDateString('es-ES')}</td>
                    <td>{obs.interpretation?.text || 'N/A'}</td>
                    <td>{obs.code?.text || 'N/A'}</td>
                    <td>{obs.valueString || 'N/A'}</td>
                    <td>{obs.status}</td>
                    <td>{obs.category?.text || 'N/A'}</td>
                    <td>{obs.performer}</td>
                  </tr>
                ))
              }
            </tbody>

          </table>
          <div className="button-container">
            <button onClick={onClose} className="close-button">Cerrar</button>
          </div>
        </div>

      ) : (
        <p>No hay observaciones para este paciente.</p>
      )
    }
  </div>
);
};

export default ListObservations;



