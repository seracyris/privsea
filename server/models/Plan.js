const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server', required: true },
    duration: { type: String, required: true },
    priceId: { type: String, required: true },
    price: { type: String, required: true },
});

module.exports = mongoose.model('Plan', planSchema);
