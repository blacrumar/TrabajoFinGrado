import React, { useEffect, useState } from 'react';
import { EditPractitioner } from '../components/EditPractitioner';

export const ListPractitioners = () => {

  const [practitioners, setPractitioners] = useState([]);
  const [editedPractitioner, setEditedPractitioner] = useState(null);
  //const [content, setContent] = useState("");

  useEffect(() => {
    async function getPractitioner() {
      const res = await fetch("/api/practitioners");
      const practitioners = await res.json();
      setPractitioners(practitioners);
    }
    getPractitioner();
  }, []);


  // Actualizar la lista de practitioners cuando se cierra el formulario de edición
  useEffect(() => {
    if (editedPractitioner === null) {
        updatePractitionerList(); 
    }
}, [editedPractitioner]);



  const deletePractitioner = async (practitionerId) => {
    const res = await fetch(`/api/practitioners/${practitionerId}`, {
      method: "DELETE"
    });
    const json = await res.json();
    if (json.acknowledged) {
      setPractitioners(currentPractitioners => {
        return currentPractitioners.filter((currentPractitioner) => currentPractitioner._id !== practitionerId);
      });
    }
  };


  const handleEditClick = (practitioner) => {
    setEditedPractitioner(practitioner);
  };

  const handleCloseEdit = () => {
    setEditedPractitioner(null); // Restablecer editedPractitioner a null para ocultar el componente EditPractitioner
    updatePractitionerList();
  };

  const updatePractitionerList = async () => {
    try {
      const res = await fetch("/api/practitioners");
      const practitioners = await res.json();
      setPractitioners(practitioners);
    } catch (error) {
      console.error('Error al actualizar la lista de practitioners:', error);
    }
  };

  return (
    
      editedPractitioner ? (
        <EditPractitioner practitioner={editedPractitioner} onClose={handleCloseEdit} updatePractitionerList={updatePractitionerList} />
      ) : (
        <div>
          {practitioners && practitioners.length > 0 ? (
            practitioners.map(pr => (

              <article key={pr._id} className="patient-item">
                <div className="patient-info">
                <p className="attribute">Estado: <span>{pr.active ? ' Activo' : ' Inactivo'}</span></p>
                <p className="attribute">Nombre: <span>{pr.name[0].prefix.join(' ') + ' ' + pr.name[0].given.join(' ') + ' ' + pr.name[0].family}</span></p>
                <p className="attribute">Dirección: <span>{pr.address[0].line.join(', ')}, {pr.address[0].city}, {pr.address[0].state}, {pr.address[0].postalCode}</span></p>
             </div>
                
                <div className='patient-buttons'>
                  <button className="editButton" onClick={() => handleEditClick(pr)}>Editar</button>
                  <button className="deleteButton" onClick={() => deletePractitioner(pr._id)}>Borrar</button>
                </div>
              </article>
            ))


          ) : (

            <h2>No hay profesionales para mostrar</h2>
          )}

        </div>
      )
    
  )
}
export default ListPractitioners;
