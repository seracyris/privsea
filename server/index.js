const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')('sk_test_51PeAYLBHxmLuJS3w0gkD3LtTdKZxMh2MEvdA9OP5YJA4RJvZWOMkTM8wc7hpydJ2vTeQQf2JER1TMjtFsEBk5Zv300tv4gchsJ');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const User = require('./models/user.model');
const Server = require('./models/server.model');

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({ secret: 'MQlaYtLjqRWkHfJeGycx', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const PORT = 1337;

mongoose.connect('mongodb+srv://seracyris:JHzgwdZq4G0WB0OX@privsea.vksgqbj.mongodb.net/privsea', { useNewUrlParser: true, useUnifiedTopology: true });

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new DiscordStrategy({
    clientID: '1263894818514403339',
    clientSecret: 'vTb0mKgDuKnD7FqlnTG784eqbfGmYUTn',
    callbackURL: 'http://localhost:1337/auth/discord/callback',
    scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });
        if (!user) {
            user = new User({
                discordId: profile.id,
                username: profile.username,
                email: profile.email,
                profilePicture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
            });
            await user.save();
        }
        done(null, user);
    } catch (err) {
        done(err, null);
    }
}));

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), (req, res) => {
    const token = jwt.sign({ userID: req.user._id }, 'MQlaYtLjqRWkHfJeGycx');
    res.redirect(`http://localhost:3000/auth/discord/callback?token=${token}`);
});

app.post('/create-payment-intent', async (req, res) => {
    const { priceId, userId, serverId, duration } = req.body;
    try {
        const price = await stripe.prices.retrieve(priceId);
        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            payment_method_types: ['card'],
            metadata: { userId, serverId, duration }
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/purchase', async (req, res) => {
    const { paymentMethodId, userId, serverId, duration } = req.body;

    try {
        const server = await Server.findById(serverId);
        const plan = server.plans.find(plan => plan.duration === duration);

        if (!plan) {
            throw new Error('Plan not found for the specified duration');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: plan.price,  // Use the plan's price
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        console.log('Payment intent confirmed:', paymentIntent);

        const user = await User.findById(userId);
        user.plans.push({
            serverId,
            duration,
            status: 'active'
        });
        await user.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.json({ success: false, error: error.message });
    }
});

app.post('/auth/create', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({
            username,
            email,
            password,
            plans: [],
            userType: 'regular',
        });

        await user.save();
        const token = jwt.sign({ userID: user._id }, 'MQlaYtLjqRWkHfJeGycx');
        res.json({ status: 'success', user: token });
    } catch (err) {
        console.error(err);
        res.json({ status: 'error', error: 'Account Generation Issue' });
    }
});

app.post('/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await user.matchPassword(password)) {
        const token = jwt.sign(
            { userID: user._id },
            'MQlaYtLjqRWkHfJeGycx'
        );

        res.json({ status: 'success', user: token });
    } else {
        res.json({ status: 'error', error: 'Invalid Credentials' });
    }
});

app.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/user', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'MQlaYtLjqRWkHfJeGycx');
        const userId = decoded.userID;

        const user = await User.findById(userId).select('-password');
        if (user) {
            res.json({ status: 'success', user });
        } else {
            res.json({ status: 'error', error: 'User not found' });
        }
    } catch (error) {
        res.json({ status: 'error', error: 'Failed to authenticate token' });
    }
});

app.post('/user/update-plan', async (req, res) => {
    const { userId, serverId, duration, serverName } = req.body;
    console.log('Received data:', req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        const server = await Server.findById(serverId).session(session);

        if (!user) {
            throw new Error('User not found');
        }

        if (!server) {
            throw new Error('Server not found');
        }

        // Deduct a slot from the server
        if (server.slots > 0) {
            server.slots -= 1;
        } else {
            throw new Error('No slots available');
        }

        // Add plan to the user
        user.plans.push({
            serverId,
            duration,
            status: 'active',
            serverName,
        });

        await server.save({ session });
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ status: 'success', user });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error updating plan:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.post('/user/remove-plan', async (req, res) => {
    const { userId, serverId, duration } = req.body;
    console.log('Received data:', req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session);
        const server = await Server.findById(serverId).session(session);

        if (!user) {
            throw new Error('User not found');
        }

        if (!server) {
            throw new Error('Server not found');
        }

        // Find and remove the plan from the user
        const planIndex = user.plans.findIndex(plan => plan.serverId.toString() === serverId && plan.duration === duration);
        if (planIndex === -1) {
            throw new Error('Plan not found');
        }

        user.plans.splice(planIndex, 1);

        // Add a slot back to the server
        server.slots += 1;

        await server.save({ session });
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({ status: 'success', user });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error removing plan:', error);
        res.status(500).json({ status: 'error', error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the response
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/servers', async (req, res) => {
    try {
        const servers = await Server.find();
        res.json({ servers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch servers' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
