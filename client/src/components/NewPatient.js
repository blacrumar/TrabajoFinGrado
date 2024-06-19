/*
import React, { useState } from 'react'

export const NewPatient = () => {


    //El estado de los datos inicialmente esta vacío
    const [patientState, setPatientState] = useState({ active: '', name: '', gender: '', birthDate: '' });

    //Desestructuramos el estado para poder coger los valores por separado
    const { active, name, gender, birthDate } = patientState;

    const getDataPatientForm = e => {
        //Para evitar el refresco de pantalla cuando le de a enviar, que es el comportamiento por defecto
        e.preventDefault();
        //Conseguir los datos del form
        let target = e.target;
        //Conseguir el nombre y el apellido
        let active = target.active.value;
        let name = target.name.value;
        let gender = target.gender.value;
        let birthDate = target.birthDate.value;
        //Crear el objeto de nuevo paciente y que se guarden los datos
        let patient = {
            id: new Date().getTime(),
            active,
            name,
            gender,
            birthDate
        };
        //Asi tengo disponible dentro del estado el nuevo objeto patient creado
        setPatientState(patient);

        //Actualizar el estado del listado principal
        {/*}
        setListadoState(elementos => {
            return[...elementos, patient];
            //devolvemos todos los elementos que ya hubiera más el nuevo elemento creado
        });
        //Pasamos el metodo definido debajo para almacenr
        saveInStorage("patients", patient);
    */
/*
 }

 }


 return (
     <div>
         <h3 className='title'>Añadir paciente</h3>
         
         {active && name && gender && birthDate}

         <form className='form'>
             <input type='text'
                 className='form_input'
                 id='active'
                 name='active'
                 placeholder='Activo' />
<></>
             <input type='text'
                 className='form_input'
                 id='name'
                 name='name'
                 placeholder='Nombre' />

             <input type='text'
                 className='form_input'
                 id='gender'
                 name='gender'
                 placeholder='Género' />

             <input type='text'
                className='form_input'
                id='birthDate'
                name='birthDate'
                placeholder='Fecha nacimiento' />

             <input type='submit'
                 className='form_buttom'
                 id='addPatient'
                 name='addPatient'
                 placeholder='Añadir paciente' />
         </form>
     </div>
 )
}
*/


/////////////////////////////////////////////////////////////////

import React, { useState } from 'react';

export const NewPatient = () => {
    const [patientState, setPatientState] = useState({ active: '', name: '', gender: '', birthDate: '', telecom: [] });

    const [message, setMessage] = useState('');



    const getDataPatientForm = async e => {
        e.preventDefault();
        const target = e.target;
        const newActive = target.active.value;
        const newGender = target.gender.value;
        const newBirthDate = new Date(target.birthDate.value).toISOString();
        const newPhoneNumber = target.phoneNumber.value;

        //obtener los datos de los campos de nombre

        const officialGiven = target.GivenName.value;
        const officialFamily = target.FamilyName.value;
        const usualName = target.usualName.value;


        //Construir el objeto name con el formato deseado
        const nameArray = [];

        // Nombre oficial y usual
        if (officialGiven) {
            nameArray.push({
                use: 'official',
                family: officialFamily, // No se requiere apellido para el nombre oficial
                given: [officialGiven]
            });
        }
        //nombre usual
        if (usualName) {
            nameArray.push({
                use: 'usual',
                given: [usualName]
            });
        }

        // Apellido de soltera
        nameArray.push({
            use: 'maiden',
            family: '',
            given: [''], // dejo como un array vacío. no me interesa este campo
            period: {
                end: '' // dejo la fecha de finalización vacía. No me interesa este campo
            }
        });

        // Construir el objeto telecom con el formato deseado
        const telecomArray = [
            {
                use: 'home'
            }, // Primer objeto vacío
            {
                system: 'phone',
                value: '',
                use: 'work',
                rank: 1
            },
            {
                system: 'phone',
                value: newPhoneNumber,
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


        // Actualizar el estado de patientState con los nuevos datos del formulario
        setPatientState(prevState => ({
            ...prevState,
            active: '',
            name: '',
            gender: '',
            birthDate: '',
            telecom: ''
        }));



        // Aquí podrías enviar los datos a la base de datos
        try {
            const response = await fetch('/api/pacientes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resourceType: 'Patient', //añadir el tipo de recurso

                    active: newActive === 'true', //convertir a booleano
                    name: nameArray,
                    gender: newGender,
                    birthDate: newBirthDate,
                    telecom: telecomArray

                })
            });
            if (response.ok) {
                console.log('Paciente guardado correctamente');
                setPatientState({ active: '', name: '', gender: '', birthDate: '' });
                // Aquí podrías mostrar un mensaje de éxito al usuario
                setMessage('Paciente creado correctamente');
            } else {
                throw new Error('Error al guardar el paciente en la base de datos');
            }
        } catch (error) {
            console.error(error.message);
            // Aquí podrías mostrar un mensaje de error al usuario
            setMessage('Error al crear el paciente');
        }

    };

    return (
        <div className='edit-practitioner'>
            <h3 className='title'>Añadir paciente</h3>

            {message && <p className='mensaje'>{message}</p>}

            <form className='form' onSubmit={getDataPatientForm}>
                <div className='form-group'>
                    <label htmlFor='active'>Estado:</label>
                    <select className='form_input' id='active' name='active'>
                        <option value="" disabled selected>Estado</option>
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='GivenName'>Nombre oficial:</label>
                    <input type='text' className='form_input' id='GivenName' name='GivenName' placeholder='Nombre oficial' />
                </div>
                <div className='form-group'>
                    <label htmlFor='FamilyName'>Apellidos oficiales:</label>
                    <input type='text' className='form_input' id='FamilyName' name='FamilyName' placeholder='Apellidos oficiales' />
                </div>
                <div className='form-group'>
                    <label htmlFor='usualName'>Nombre usual o apodo:</label>
                    <input type='text' className='form_input' id='usualName' name='usualName' placeholder='Nombre usual o apodo' />
                </div>
                <input type='hidden' id='maidenName' name='maidenName' value='' />
                <div className='form-group'>
                    <label htmlFor='gender'>Género:</label>
                    <select className='form_input' id='gender' name='gender' >
                        <option value="" disabled selected>Género</option>
                        <option value="femenino">Femenino</option>
                        <option value="masculino">Masculino</option>
                        <option value="indefinido">Indefinido</option>
                        <option value="otro">Otro</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='birthDate'>Fecha de nacimiento:</label>
                    <input type='date' className='form_input' id='birthDate' name='birthDate' placeholder='Fecha nacimiento' />
                </div>
                <div className='form-group'>
                    <label htmlFor='phoneNumber'>Número de teléfono:</label>
                    <input type='text' className='form_input' id='phoneNumber' name='phoneNumber' placeholder='Número de teléfono' />
                </div>
                <div className='buttons'>
                <button type='submit' className='form_button'>Añadir paciente</button>
                </div>
            </form>
        </div>
    );
};

