const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const stripe = require('stripe')('pk_live_51PeAYLBHxmLuJS3wvISfgVXLjYWLqQrKxhqFnP3ZRDxAsTtvAcsW6Dvz1bmqw3vUVMI05b7beUxbUyC4ZszGZYKx00wawJMuzUJ'); // Use your actual secret key
const jwt = require('jsonwebtoken');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const session = require('express-session');
const User = require('./models/user.model');
const Server = require('./models/server.model');
const profileRoutes = require('./routes/profile.routes'); // Import the profile routes

const app = express();
const PORT = 1337;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(session({ secret: 'MQlaYtLjqRWkHfJeGycx', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

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
            // Check if a user exists with the same email
            user = await User.findOne({ email: profile.email });
            if (user) {
                user.discordId = profile.id;
                user.username = profile.username;
                user.email = profile.email;
                user.profilePicture = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
                await user.save();
            } else {
                // Check if a user exists with the same username
                user = await User.findOne({ username: profile.username });
                if (user) {
                    user.discordId = profile.id;
                    user.username = profile.username;
                    user.email = profile.email;
                    user.profilePicture = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
                    await user.save();
                } else {
                    user = new User({
                        discordId: profile.id,
                        username: profile.username,
                        email: profile.email,
                        profilePicture: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                    });
                    await user.save();
                }
            }
        } else {
            user.discordId = profile.id;
            user.username = profile.username;
            user.email = profile.email;
            user.profilePicture = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`;
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
        console.log("Received data for creating payment intent:", req.body);

        // Retrieve the price from Stripe using priceId
        const price = await stripe.prices.retrieve(priceId);
        if (!price) {
            return res.status(404).json({ error: 'Price not found' });
        }

        // Create a new payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price.unit_amount,
            currency: price.currency,
            payment_method_types: ['card'],
            metadata: { userId, serverId, duration }
        });

        console.log("Payment Intent created successfully:", paymentIntent);
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).json({ error: error.message });
    }
});


app.get('/transactions', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, 'MQlaYtLjqRWkHfJeGycx');
        const userId = decoded.userID;

        const user = await User.findById(userId).select('plans transactions');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transactionsWithStatus = user.transactions.map(transaction => {
            const plan = user.plans.find(plan =>
                plan.serverId.toString() === transaction.serverId.toString() &&
                plan.duration === transaction.duration
            );
            return {
                ...transaction._doc,
                status: plan ? plan.status : 'unknown'
            };
        });

        res.json({ transactions: transactionsWithStatus });
    } catch (error) {
        console.error('Failed to fetch transactions:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/purchase', async (req, res) => {
    const { paymentMethodId, userId, serverId, duration } = req.body;

    try {
        const server = await Server.findById(serverId);
        if (!server) {
            return res.status(404).send('Server not found');
        }

        const plan = server.plans.find(plan => plan.duration === duration);
        if (!plan) {
            return res.status(404).send('Plan not found for the specified duration');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: plan.price,  // Use the plan's price
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
        });

        console.log('Payment intent confirmed:', paymentIntent);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Add transaction to user document
        user.transactions.push({
            userId: user._id,
            serverId,
            duration,
            planDetails: {
                serverId: plan.serverId,
                serverName: plan.serverName,
                duration: plan.duration
            },
            price: plan.price,
        });

        await user.save(); // Save the updated user document

        // Log the updated user document to verify changes
        console.log('Updated User:', user);

        res.json({ message: 'Purchase successful and transaction added to user.' });
    } catch (error) {
        console.error('Purchase failed:', error);
        res.status(500).send('Internal Server Error');
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
    const { userId, serverId, duration, serverName, transaction } = req.body;
    console.log('Received data:', req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Exclude the password field when fetching the user
        const user = await User.findById(userId).select('-password').session(session);
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

        // Add transaction to the user
        user.transactions.push(transaction);

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

// Add this endpoint to fetch user by Discord ID
app.get('/user/by-discord-id/:discordId', async (req, res) => {
    try {
        const discordId = req.params.discordId;
        const user = await User.findOne({ discordId }).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/user/remove-plan', async (req, res) => {
    const { userId, serverId, duration } = req.body;
    console.log('Received data:', req.body);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).select('-password').session(session);
        const server = await Server.findById(serverId).session(session);

        if (!user) {
            throw new Error('User not found');
        }

        if (!server) {
            throw new Error('Server not found');
        }

        // Find the plan and update its status to 'inactive'
        const plan = user.plans.find(plan => plan.serverId.toString() === serverId && plan.duration === duration);
        if (!plan) {
            throw new Error('Plan not found');
        }

        plan.status = 'inactive';

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

// Add new embedded checkout session creation endpoint
app.post('/create-checkout-session', async (req, res) => {
    const { priceId, userId, serverId, duration } = req.body;
    try {
        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `http://localhost:3000/return?session_id={CHECKOUT_SESSION_ID}`,
            automatic_tax: { enabled: true },
        });
        res.send({ clientSecret: session.client_secret });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.use('/api', profileRoutes); // Use the profile routes

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords from the response
        res.json({ users });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.get('/users/total', async (req, res) => {
    try {
        const total = await User.countDocuments();
        res.json({ total });
    } catch (error) {
        console.error('Failed to fetch total users:', error);
        res.status(500).json({ error: 'Failed to fetch total users' });
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

app.get('/server-uptime', async (req, res) => {
    try {
        const urls = [
            'http://15.204.12.146:7384/server-uptime',
            'http://51.68.202.104:7384/server-uptime',
            'http://135.148.57.149:7384/server-uptime'
        ];

        const fetchUptime = async (url) => {
            try {
                const fetch = (await import('node-fetch')).default;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch from ${url} with status ${response.status}`);
                }
                const data = await response.json();
                return data.status;
            } catch (error) {
                console.error(`Error fetching data from ${url}:`, error.message); // Enhanced logging

                if (url.includes('15.204.12.146')) {
                    return { name: 'Oregon', location: 'USA', uptime: 'Offline', cpuUsage: 'N/A' };
                } else if (url.includes('51.68.202.104')) {
                    return { name: 'London', location: 'UK', uptime: 'Offline', cpuUsage: 'N/A' };
                } else if (url.includes('135.148.57.149')) {
                    return { name: 'Virginia', location: 'USA', uptime: 'Offline', cpuUsage: 'N/A' };
                }
                return { name: 'Unknown', location: 'Unknown', uptime: 'Offline', cpuUsage: 'N/A' };
            }
        };

        const uptimes = await Promise.all(urls.map(fetchUptime));

        res.json({ uptimes });
    } catch (error) {
        console.error('Error fetching server uptime:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/transactions', async (req, res) => {
    try {
        const users = await User.find().select('transactions');
        const transactions = users.flatMap(user => user.transactions);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
