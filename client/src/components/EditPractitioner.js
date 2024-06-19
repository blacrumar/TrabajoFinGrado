import React, { useState } from 'react';

export const EditPractitioner = ({ practitioner, onClose, updatePractitionerList }) => {

    // Obtener el prefijo, nombre y apellido del primer objeto de la lista de nombres
    const prefix = practitioner.name[0].prefix.join(' ');
    const givenName = practitioner.name[0].given.join(' ');
    const familyName = practitioner.name[0].family;

    // Obtener los datos de dirección del primer objeto de la lista de direcciones
    const addressLine = practitioner.address[0].line.join(', ');
    const city = practitioner.address[0].city;
    const state = practitioner.address[0].state;
    const postalCode = practitioner.address[0].postalCode;

    const [formData, setFormData] = useState({
        active: practitioner.active,
        prefix: prefix,
        givenName: givenName,
        familyName: familyName,
        //address: practitioner.address,
        addressLine: addressLine,
        city: city,
        state: state,
        postalCode: postalCode
        

        // Otros campos que puedas necesitar editar
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = name === 'active' ? value === 'true' : value;
        //convertir a booleano si se edita el campo active
        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try { 
            

            
            //enviamos los datos al servidor para que almacene lo nuevo en la BD
            const res = await fetch(`/api/practitioners/${practitioner._id}`, {
                method: "PUT",
                body: JSON.stringify({
                    active: formData.active,
                    name: [{
                        prefix: [formData.prefix],
                        given: [formData.givenName],
                        family: formData.familyName
                    }],
                    //address: formData.address
                    address: [{
                        use: "home",
                        line: [formData.addressLine],
                        city: formData.city,
                        state: formData.state,
                        postalCode: formData.postalCode
                    }]
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const data = await res.json();
            console.log(data); // Aquí puedes manejar la respuesta del servidor, como mostrar un mensaje de éxito
            await updatePractitionerList(); //actualizamos la lista de pacientes despues de realizar los cambios
            onClose(); // Cierra el formulario después de guardar los cambios
        } catch (error) {
            console.error('Error al guardar cambios:', error);
            // Aquí puedes manejar errores, como mostrar un mensaje de error al usuario
        }
    };

    


    return (
        <div className="edit-practitioner">
            <h2>Editar profesional {practitioner.name[0].prefix + ' ' + practitioner.name[0].given + ' ' + practitioner.name[0].family}</h2>
            <form onSubmit={handleSubmit} className='form'>
                <label>
                    Estado:
                    <select name="active" value={formData.active} onChange={handleChange} className="form_input">

                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>
                </label>
                
                <label>
                    Prefijo:
                    <input type="text" name="prefix" value={formData.prefix} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Nombre:
                    <input type="text" name="givenName" value={formData.givenName} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Apellido:
                    <input type="text" name="familyName" value={formData.familyName} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Dirección:
                    <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} className="form_input" />
                </label>
                
                <label>
                    Ciudad:
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Estado:
                    <input type="text" name="state" value={formData.state} onChange={handleChange} className="form_input"/>
                </label>
                
                <label>
                    Código Postal:
                    <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="form_input"/>
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
