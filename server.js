const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const orgRoutes = require('./routes/organisationRoutes');
const { sequelize } = require('./models');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/api/organisations', orgRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


module.exports = app;