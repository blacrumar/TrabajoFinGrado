import React, { useState } from 'react';

export const EditPaciente = ({ paciente, onClose, updatePacienteList }) => {

    const initialBirthDate = paciente.birthDate ? new Date(paciente.birthDate) : null;

    const officialName = paciente.name ? paciente.name.find(name => name.use === 'official') : null;
    const usualName = paciente.name ? paciente.name.find(name => name.use === 'usual') : null;

    const [formData, setFormData] = useState({
        active: paciente.active,
        officialName: officialName ? officialName.given.join(' ') + ' ' + (officialName.family || '') : '',
        usualName: usualName ? usualName.given[0] : '',
        gender: paciente.gender,
        birthDate: paciente.birthDate ? initialBirthDate.toISOString().split('T')[0] : '', // Convertir a formato ISO,
        phoneNumber: paciente.telecom ? paciente.telecom[2].value : '' 
        
        // Otros campos que puedas necesitar editar
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'active' ? value === 'true' : name === 'birthDate' ? new Date(value) : value;
        //convertir a booleano si se edita el campo active
        //convertir a date si se edita rl campo birthDate
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue instanceof Date && !isNaN(newValue) ? newValue.toISOString().split('T')[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //Construir el nombre en el formato deseado
            const nameArray = [];
            nameArray.push({
                use: 'official',
                family: formData.officialName.split(' ')[1], //asignar el 2do elemento como apellidos
                given: [formData.officialName.split(' ')[0]] //asignar el 1er elemento como nombre
            });

            nameArray.push({
                use: 'usual',
                given: [formData.usualName]
            });

            nameArray.push({
                use: 'maiden',
                family: '',
                given: [''],
                period: {
                    end: ''
                }
            });


            // Construir el array telecom con el formato deseado
            const telecomArray = [
                {
                    use: ''
                }, // Primer objeto vacío
                {
                    system: 'phone',
                    value: '',
                    use: 'work',
                    rank: 1
                }, // Segundo objeto vacío
                {
                    system: 'phone',
                    value: formData.phoneNumber,
                    use: 'mobile',
                    rank: 2
                },
                {
                    system: 'phone',
                    value: '',
                    use: 'old',
                    period: {
                        end: ''
                    }
                }
            ];




            //enviamos los datos al servidor para que almacene lo nuevo en la BD
            const res = await fetch(`/api/pacientes/${paciente._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    active: formData.active,
                    name: nameArray,
                    gender: formData.gender,
                    birthDate: formData.birthDate,
                    telecom: telecomArray
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await res.json();
            console.log(data); // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito
            await updatePacienteList(); //actualizamos la lista de pacientes despues de realizar los cambios
            onClose(); // Cierra el formulario después de guardar los cambios
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
        }
    };

   

     
    return (
        <div className="edit-paciente">
            <h2>Editar paciente {`${officialName ? officialName.given.join(' ') + ' ' + (officialName.family || '') : ''}`}</h2>
            <form onSubmit={handleSubmit} className='form'>
                <label>
                    Estado:
                    <select name="active" value={formData.active} onChange={handleChange} className="form_input">

                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>
                </label>
                
                <label>
                    Nombre oficial:
                    <input name="officialName" value={formData.officialName} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Nombre usual:
                    <input name="usualName" value={formData.usualName} onChange={handleChange} className="form_input" />
                </label>
                
                <label>
                    Género:
                    <select name="gender" value={formData.gender} onChange={handleChange} className="form_input">

                        <option value="femenino">Femenino</option>
                        <option value="masculino">Masculino</option>
                        <option value="indefinido">Indefinido</option>
                        <option value="otro">Otro</option>
                    </select>
                </label>
                
                <label>
                    Fecha de nacimiento:
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Número de teléfono:
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form_input"/>
                </label>
                
                {/* Otros campos del formulario */}
                <div className="buttons">
                    <button type="submit" className='form_button'>Guardar Cambios</button>
                    <button type="button" className='form_button' onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};




/*
import React, { useState } from 'react';

export const EditPaciente = ({ paciente, onClose }) => {
    <h1>EDITAR PACIENTE</h1>

    const [formData, setFormData] = useState({
        active: paciente.active,
        name: paciente.name,
        gender: paciente.gender,
        birthDate: paciente.birthDate,
        // Otros campos que puedas necesitar editar
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí podrías enviar los datos del formulario al servidor para guardar los cambios
        // Por simplicidad, aquí solo cerramos el componente
        onClose();
    };
    return (
        <div className="edit-paciente">
            <h2>Editar Paciente</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Activo:
                    <input type="text" name="active" value={formData.active} onChange={handleChange} />
                </label>
                <label>
                    Nombre:
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </label>
                <label>
                    Género:
                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} />


                </label>
                <label>
                    Fecha de nacimiento:
                    <input type="text" name="birthDate" value={formData.birthDate} onChange={handleChange} />
                </label>
                {/* Otros campos del formulario }
                <div className="buttons">
                    <button type="submit">Guardar Cambios</button>
                    <button type="button" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};
*/

/*
const [showEditForm, setShowEditForm] = useState(false);
 
const updatePaciente = async (pacienteId) => {

try {
  const res = await fetch(`/api/pacientes/${pacienteId}`, {
    method: "PUT",
    body: JSON.stringify(editedPaciente),
    headers: {
      "Content-Type": "application/json"
    },

  });

  const json = await res.json();
  if (json.acknowledged) {
    setPacientes(currentPacientes => {
      return currentPacientes.map((currentPaciente) => {
        if (currentPaciente._id === pacienteId) {
          return { ...currentPaciente, ...editedPaciente };
        }
        return currentPaciente;
      });

    });
    setShowEditForm(false);
  }
} catch (error) {
  console.log("Error al actualizar el paciente:", error);
}
};

const handleInputChange = (e) => {
const { name, value } = e.target;
setEditedPaciente({ ...editedPaciente, [name]: value });
};

{
    showEditForm ? (
        <div>
            <input type="text" name="active" value={editedPaciente.active} onChange={handleInputChange} />
            <input type="text" name="name" value={editedPaciente.name} onChange={handleInputChange} />
            <input type="text" name="gender" value={editedPaciente.gender} onChange={handleInputChange} />
            <input type="text" name="birthDate" value={editedPaciente.birthDate} onChange={handleInputChange} />
            <button onClick={() => updatePaciente(p._id)}>Guardar</button>
        </div>
    ) : (
        <div>
            <button className="edit" onClick={() => {
                setShowEditForm(true);
                setEditedPaciente(p); // Inicializa el formulario con los datos del paciente
            }}>Editar</button>
            <button className="delete" onClick={() => deletePaciente(p._id)}>Borrar</button>
        </div>
    )
}

};*/