const mongoose = require('mongoose');
const Server = require('./models/server.model');

// Connect to MongoDB
mongoose.connect('mongodb+srv://seracyris:JHzgwdZq4G0WB0OX@privsea.vksgqbj.mongodb.net/privsea', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const servers = [
    {
        name: 'Virginia',
        location: 'USA',
        type: 'OVH',
        slots: 200,
        flagUrl: 'https://t4.ftcdn.net/jpg/00/65/12/49/360_F_65124908_UpNHzTdQn2HNAIT8yYqybMQeGfsRmVc7.jpg',
        downloadUrl: 'http://localhost/openvpn-configs/virginia.ovpn',
        plans: [
            { duration: '1 Month', priceId: 'price_1Pl5cRBHxmLuJS3wb1rS6fxV,prod_QcKGPr1b05ivp3', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1Pl5dFBHxmLuJS3wcdQhwfmx', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1Pl5dhBHxmLuJS3wh1mF5823', price: '$24.99' },
        ],
    },
    {
        name: 'Oregon',
        location: 'USA',
        type: 'OVH',
        slots: 200,
        flagUrl: 'https://t4.ftcdn.net/jpg/00/65/12/49/360_F_65124908_UpNHzTdQn2HNAIT8yYqybMQeGfsRmVc7.jpg',
        downloadUrl: 'http://localhost/openvpn-configs/oregon.ovpn',
        plans: [
            { duration: '1 Month', priceId: 'price_1Pl5e2BHxmLuJS3w3MsE6FBc', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1Pl5eOBHxmLuJS3wSjVoNqlR', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1Pl5enBHxmLuJS3wL0XYUNwc', price: '$24.99' },
        ],
    },
    {
        name: 'London',
        location: 'UK',
        type: 'OVH',
        slots: 200,
        flagUrl: 'https://cdn.britannica.com/25/4825-004-F1975B92/Flag-United-Kingdom.jpg',
        downloadUrl: 'http://localhost/openvpn-configs/london.ovpn',
        plans: [
            { duration: '1 Month', priceId: 'price_1Pl5fEBHxmLuJS3wflAOr8aa', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1Pl5fTBHxmLuJS3waBN18WOK', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1Pl5g2BHxmLuJS3wJgGjGqd5', price: '$24.99' },
        ]
    }
];

const seedServers = async () => {
    try {
        await Server.deleteMany({});
        await Server.insertMany(servers);
        console.log('Server data has been successfully seeded');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding server data:', error);
    }
};

seedServers();
