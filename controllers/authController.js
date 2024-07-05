const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation, sequelize } = require('../models');
const config = require('../config/config');

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
    // Log the incoming registration data
    console.log('Register request received with data:', req.body);

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

    // Log the hashed password
    console.log('Hashed password:', hashedPassword);

        // Create user and organisation in transactions
        await sequelize.transaction(async (t) => {
            const user = await User.create({
                userId: `user-${Date.now()}`,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            }, { transaction: t });

console.log('User created:', user);

            const org = await Organisation.create({
                orgId: `org-${Date.now()}`,
                name: `${firstName}'s Organisation`,
                description: '',
            }, { transaction: t });

console.log('Organisation created:', org);

            await user.addOrganisation(org, { transaction: t });

      console.log('User added to Organisation

            // Generate JWT token
            const token = jwt.sign({ userId: user.userId }, config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRES_IN,
            });

// Log the generated token
      console.log('JWT token generated:', token);

            // Respond with success message and token
            res.status(201).json({
                status: 'success',
                message: 'Registration successful',
                data: {
                    accessToken: token,
                    user: {
                        userId: user.userId,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                    },
                },
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({
            status: 'Bad request',
            message: 'Registration unsuccessful',
            statusCode: 400,
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        // If user not found or password does not match, return authentication failed
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                status: 'Bad request',
                message: 'Authentication failed',
                statusCode: 401,
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.userId }, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN,
        });

        // Respond with success message and token
        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                accessToken: token,
                user: {
                    userId: user.userId,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                },
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(401).json({
            status: 'Bad request',
            message: 'Authentication failed',
            statusCode: 401,
        });
    }
};



















const { User, Organisation } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name: `${firstName}'s Organisation`,
    });

    await user.addOrganisation(organisation);

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
