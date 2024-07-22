const mongoose = require('mongoose');
const Server = require('./models/server.model');

// Connect to MongoDB
mongoose.connect('mongodb+srv://seracyris:JHzgwdZq4G0WB0OX@privsea.vksgqbj.mongodb.net/privsea', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const servers = [
    {
        name: 'Hillsboro',
        location: 'USA',
        type: 'OVH',
        slots: 10,
        flagUrl: 'https://t4.ftcdn.net/jpg/00/65/12/49/360_F_65124908_UpNHzTdQn2HNAIT8yYqybMQeGfsRmVc7.jpg',
        plans: [
            { duration: '1 Month', priceId: 'price_1PeRYsBHxmLuJS3wlQGyvuMx', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1PeRc2BHxmLuJS3wLjxmy4Zh', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1PeRcnBHxmLuJS3w3oXVfAdT', price: '$24.99' },
        ],
    },
    {
        name: 'Vint Hill',
        location: 'USA',
        type: 'OVH',
        slots: 9,
        flagUrl: 'https://t4.ftcdn.net/jpg/00/65/12/49/360_F_65124908_UpNHzTdQn2HNAIT8yYqybMQeGfsRmVc7.jpg',
        plans: [
            { duration: '1 Month', priceId: 'price_1PeRXoBHxmLuJS3wVahkmS0e', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1PeRdNBHxmLuJS3wZhhhis1A', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1PeRdwBHxmLuJS3wsY7inKN8', price: '$24.99' },
        ],
    },
    {
        name: 'Oregon',
        location: 'USA',
        type: 'OVH',
        slots: 10,
        flagUrl: 'https://t4.ftcdn.net/jpg/00/65/12/49/360_F_65124908_UpNHzTdQn2HNAIT8yYqybMQeGfsRmVc7.jpg',
        plans: [
            { duration: '1 Month', priceId: 'price_1PeAu9BHxmLuJS3wYT424SdK', price: '$4.99' },
            { duration: '3 Months', priceId: 'price_1PeRftBHxmLuJS3wXjlNd9iz', price: '$11.99' },
            { duration: '6 Months', priceId: 'price_1PeRgKBHxmLuJS3waM3GkWBN', price: '$24.99' },
        ],
    },
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
