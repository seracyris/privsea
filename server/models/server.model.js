const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    name: String,
    location: String,
    type: String,
    slots: Number,
    flagUrl: String,
    downloadUrl: String,
    plans: [{
        duration: String,
        priceId: String,
        price: String,
    }]
});

module.exports = mongoose.model('Server', ServerSchema);
