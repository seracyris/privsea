const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
    serverId: mongoose.Schema.Types.ObjectId,
    serverName: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true },
});

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    profilePicture: { type: String },
    discordId: { type: String, unique: true, sparse: true },
    plans: [PlanSchema],
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
