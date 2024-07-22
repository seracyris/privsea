const express = require('express');
const Server = require('../models/server.model');
const router = express.Router();

// Get all servers
router.get('/servers', async (req, res) => {
    try {
        const servers = await Server.find();
        res.json(servers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new server
router.post('/servers', async (req, res) => {
    const { name, location, type, slots, flagUrl, plans } = req.body;

    const newServer = new Server({ name, location, type, slots, flagUrl, plans });

    try {
        const savedServer = await newServer.save();
        res.json(savedServer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a server
router.put('/servers/:id', async (req, res) => {
    try {
        const updatedServer = await Server.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedServer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a server
router.delete('/servers/:id', async (req, res) => {
    try {
        const deletedServer = await Server.findByIdAndDelete(req.params.id);
        res.json(deletedServer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
