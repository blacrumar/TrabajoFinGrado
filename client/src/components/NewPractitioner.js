import React, { useState } from 'react';

export const NewPractitioner = () => {
    const [practitionerState, setPractitionerState] = useState({ active: '', name: '', address: '' });

    const [message, setMessage] = useState('');



    const getDataPractitionerForm = async e => {
        e.preventDefault();
        const target = e.target;
        const newActive = target.active.value;
        const newFamilyName = target.FamilyName.value;
        const newGivenName = target.GivenName.value;
        const newPrefix = target.prefix.value;
        //const newAddress = target.address.value;
        const newAddressLine = target.addressLine.value; // Nuevo campo para la línea de dirección
        const newCity = target.city.value; // Nuevo campo para la ciudad
        const newState = target.state.value; // Nuevo campo para el estado
        const newPostalCode = target.postalCode.value; // Nuevo campo para el código postal


        //Construir el objeto name con el formato deseado
        const nameArray = [];

        // Nombre oficial y usual
        if (newGivenName || newFamilyName) {
            nameArray.push({

                family: newFamilyName, // No se requiere apellido para el nombre oficial
                given: [newGivenName],
                prefix: [newPrefix]
            });
        }

        // Construir el objeto address con el formato deseado
        const addressArray = [{
            use: 'home',
            line: [newAddressLine],
            city: newCity,
            state: newState,
            postalCode: newPostalCode
        }];

        // Actualizar el estado de patientState con los nuevos datos del formulario
        setPractitionerState(prevState => ({
            ...prevState,
            active: '',
            name: '',
            address: ''

        }));



        // Aquí podrías enviar los datos a la base de datos
        try {
            const response = await fetch('/api/practitioners', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resourceType: 'Practitioner', //añadir el tipo de recurso

                    active: newActive === 'true', //convertir a booleano
                    name: nameArray,
                    address: addressArray


                })
            });
            if (response.ok) {
                console.log('Sanitario guardado correctamente');
                setPractitionerState({ active: '', name: '', address: '' });
                // Aquí podrías mostrar un mensaje de éxito al usuario
                setMessage('Sanitario creado correctamente');
            } else {
                throw new Error('Error al guardar el sanitario en la base de datos');
            }
        } catch (error) {
            console.error(error.message);
            // Aquí podrías mostrar un mensaje de error al usuario
            setMessage('Error al crear el sanitario');
        }

    };

    return (
        <div className='edit-practitioner'>
            <h3 className='title'>Añadir sanitario</h3>

            {message && <p className='mensaje'>{message}</p>}

            <form className='form' onSubmit={getDataPractitionerForm}>
                <div className='form-group'>
                    <label htmlFor='active'>Estado:</label>
                    <select className='form_input' id='active' name='active'>
                        <option value="" disabled selected>Estado</option>
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='GivenName'>Nombre:</label>

                    <input type='text' className='form_input' id='GivenName' name='GivenName' placeholder='Nombre' />
                </div>
                <div className='form-group'>
                    <label htmlFor='FamilyName'>Apellidos:</label>

                    <input type='text' className='form_input' id='FamilyName' name='FamilyName' placeholder='Apellidos' />
                </div>
                <div className='form-group'>
                    <label htmlFor='prefix'>Prefijo:</label>

                    <input type='text' className='form_input' id='prefix' name='usualName' placeholder='Prefijo' />
                </div>

                <div className='form-group'>
                    <label htmlFor='addressLine'>Dirección:</label>

                    <input type='text' className='form_input' id='addressLine' name='addressLine' placeholder='Dirección' />
                </div>
                <div className='form-group'>
                    <label htmlFor='city'>Ciudad:</label>

                    <input type='text' className='form_input' id='city' name='city' placeholder='Ciudad' />
                </div>
                <div className='form-group'>
                    <label htmlFor='state'>País:</label>

                    <input type='text' className='form_input' id='state' name='state' placeholder='País' />
                </div>
                <div className='form-group'>
                    <label htmlFor='postalCode'>Código postal:</label>

                    <input type='text' className='form_input' id='postalCode' name='postalCode' placeholder='Código Postal' />
                </div>
                <div className='buttons'>
                    <button type='submit' className='form_button'>Añadir sanitario</button>
                </div>
            </form>
        </div>
    );
};

