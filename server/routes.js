const express = require("express");
const router = express.Router();


const { getConnectedClient } = require("./database");

const { ObjectId } = require("mongodb");

const getCollectionPaciente = () => {
    const client = getConnectedClient();
    const collectionPaciente = client.db("centrorehab2").collection("pacientes");
    return collectionPaciente;
}


//GET /pacientes

router.get("/pacientes", async (req, res) => {
    const collectionPaciente = getCollectionPaciente();
    const pacientes = await collectionPaciente.find({}).toArray();
    res.status(200).json(pacientes);
});


//POST /pacientes
router.post("/pacientes", async (req, res) => {
    const collectionPaciente = getCollectionPaciente();
    let paciente = req.body;

    if (!paciente) {
        return res.status(400).json({ mssg: "error no paciente found" });

    }
    paciente.birthDate = new Date(paciente.birthDate);

    try {
        const newPaciente = await collectionPaciente.insertOne(paciente);
        res.status(201).json({ paciente, _id: newPaciente.insertedId });
    } catch (error) {
        console.log("Error al insertar paciente:", error);
        res.status(500).json({ error: "Error interno del servidor" })

    }
});


//DELETE /pacientes/:id
router.delete("/pacientes/:id", async (req, res) => {
    const collectionPaciente = getCollectionPaciente();
    const _id = new ObjectId(req.params.id);
    const deletedPaciente = await collectionPaciente.deleteOne({ _id });
    res.status(200).json(deletedPaciente);
});


//PUT /pacientes/:id
router.put("/pacientes/:id", async (req, res) => {
    const collectionPaciente = getCollectionPaciente();
    const _id = new ObjectId(req.params.id);
    try {
        // Obtener los datos actualizados del paciente del cuerpo de la solicitud
        const { active, name, gender, birthDate, telecom } = req.body;
        // Parsea la cadena de fecha de nacimiento a un objeto Date
        const parsedBirthDate = new Date(birthDate);

        // Construir un objeto con los datos actualizados del paciente
        const updatedPaciente = {
            active,
            name,
            gender,
            birthDate: parsedBirthDate,
            telecom
        };
        // Actualizar el paciente en la base de datos
        const result = await collectionPaciente.updateOne({ _id }, { $set: updatedPaciente });

        // Verificar si la operación de actualización fue exitosa
        if (result.modifiedCount === 1) {
            // Si la actualización fue exitosa, devolver el paciente actualizado como respuesta
            res.status(200).json(updatedPaciente);
        } else {
            // Si no se modificó ningún documento, devolver un mensaje de error
            res.status(404).json({ message: 'Paciente no encontrado o no se pudo actualizar' });
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la actualización del paciente
        console.error('Error al actualizar el paciente:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el paciente' });
    }
});

///////////////PRACTITIONER

const getCollectionPractitioner = () => {
    const client = getConnectedClient();
    const collectionPractitioner = client.db("centrorehab2").collection("practitioners");
    return collectionPractitioner;
}

//GET /practitioner
router.get("/practitioners", async (req, res) => {
    const collectionPractitioner = getCollectionPractitioner();
    const practitioners = await collectionPractitioner.find({}).toArray();
    res.status(200).json(practitioners);
    
});


//POST /practitioners
router.post("/practitioners", async (req, res) => {
    const collectionPractitioner = getCollectionPractitioner();
    let practitioner = req.body;

    if (!practitioner) {
        return res.status(400).json({ mssg: "error no practitioner found" });
    }

    try {
        const newPractitioner = await collectionPractitioner.insertOne(practitioner);
        res.status(201).json({ practitioner, _id: newPractitioner.insertedId });
    } catch (error) {
        console.log("Error al insertar practitioner:", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
});



//DELETE /practitioners/:id
router.delete("/practitioners/:id", async (req, res) => {
    const collectionPractitioner = getCollectionPractitioner();
    const _id = new ObjectId(req.params.id);

    const deletedPractitioner = await collectionPractitioner.deleteOne({ _id });

    res.status(200).json(deletedPractitioner);
});

//PUT /practitioners/:id
router.put("/practitioners/:id", async (req, res) => {
    const collectionPractitioner = getCollectionPractitioner();
    const _id = new ObjectId(req.params.id);
    try {
        // Obtener los datos actualizados del practitioner del cuerpo de la solicitud
        const { active, name, address } = req.body;
        // Construir un objeto con los datos actualizados del practitioner
        const updatedPractitioner = {
            active,
            name,
            address
        };
        // Actualizar el practitioner en la base de datos
        const result = await collectionPractitioner.updateOne({ _id }, { $set: updatedPractitioner });

        // Verificar si la operación de actualización fue exitosa
        if (result.modifiedCount === 1) {
            // Si la actualización fue exitosa, devolver el practitioner actualizado como respuesta
            res.status(200).json(updatedPractitioner);
        } else {
            // Si no se modificó ningún documento, devolver un mensaje de error
            res.status(404).json({ message: 'Practitioner no encontrado o no se pudo actualizar' });
        }
    } catch (error) {
        // Manejar cualquier error que ocurra durante la actualización del practitioner
        console.error('Error al actualizar el practitioner:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el practitioner' });
    }
});


///////////////OBSERVATION

const getCollectionObservation = () => {
    const client = getConnectedClient();
    const collectionObservation = client.db("centrorehab2").collection("observations");
    return collectionObservation;
}

//GET /practitioner
router.get("/observations", async (req, res) => {
    const collectionObservation = getCollectionObservation();
    const observations = await collectionObservation.find({}).toArray();
    res.status(200).json(observations);
    
});




module.exports = router;