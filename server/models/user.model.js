const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    serverId: mongoose.Schema.Types.ObjectId,
    serverName: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const TransactionSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Server' },
    duration: { type: String, required: true },
    planDetails: {
        serverId: mongoose.Schema.Types.ObjectId,
        serverName: { type: String, required: true },
        duration: { type: Number, required: true },
        status: { type: String, required: true },
    },
    price: { type: Number, required: true },
}, { timestamps: true });

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    profilePicture: { type: String },
    discordId: { type: String, unique: true, sparse: true },
    plans: [PlanSchema],
    transactions: [TransactionSchema], // Add transactions here
    userType: { type: String, enum: ['regular', 'admin'], default: 'regular' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
