import express from "express";
import { readFile, writeFile } from "fs/promises";

const app = express();
app.use(express.json());

const readData = async () => {
    try {
        const data = await readFile("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return null; // Devolver null si hay un error al leer los datos
    }
};

const writeData = async (data) => {
    try {
        await writeFile("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("API REST con Node.js!");
});

app.get("/Carreras", async (req, res) => {
    const data = await readData();
    res.json(data.Carreras);
});

app.get("/Carreras/:id", async (req, res) => {
    const data = await readData();
    const id = parseInt(req.params.id);
    const Carrera = data.Carreras.find((carrera) => carrera.id === id);
    if (Carrera) {
        res.json(Carrera);
    } else {
        res.status(404).json({ message: "Carrera no encontrada" });
    }
});

app.post("/Carreras", async (req, res) => {
    const data = await readData();
    const body = req.body;
    const newCarrera = {
        id: data.Carreras.length + 1,
        ...body,
    };
    data.Carreras.push(newCarrera);
    await writeData(data);
    res.status(201).json(newCarrera);
});

app.put("/Carreras/:id", async (req, res) => {
    const data = await readData();
    if (!data) {
        res.status(500).json({ message: "Error al leer datos" });
        return;
    }

    const body = req.body;
    const id = parseInt(req.params.id);
    const CarreraIndex = data.Carreras.findIndex((carrera) => carrera.id === id);
    if (CarreraIndex === -1) {
        res.status(404).json({ message: "Carrera no encontrada" });
        return;
    }

    data.Carreras[CarreraIndex] = {
        ...data.Carreras[CarreraIndex],
        ...body,
    };
    await writeData(data);
    res.json({ message: "Carrera actualizada con exito" });
});

app.delete("/Carreras/:id", async (req, res) => {
    const data = await readData();
    const id = parseInt(req.params.id);
    const CarreraIndex = data.Carreras.findIndex((carrera) => carrera.id === id);
    if (CarreraIndex === -1) {
        res.status(404).json({ message: "Carrera no encontrada" });
        return;
    }
    data.Carreras.splice(CarreraIndex, 1);
    await writeData(data);
    res.json({ message: "Carrera eliminada con exito" });
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});