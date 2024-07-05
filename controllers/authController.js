const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Organisation } = require('../models');
const config = require('../config/config');

exports.register = async (req, res) => {
    const { firstName, lastName, email, password, phone } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user and organisation in transactions for consistency
        await sequelize.transaction(async (t) => {
            const user = await User.create({
                userId: `user-${Date.now()}`,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            }, { transaction: t });

            const org = await Organisation.create({
                orgId: `org-${Date.now()}`,
                name: `${firstName}'s Organisation`,
                description: '',
            }, { transaction: t });

            await user.addOrganisation(org, { transaction: t });

            // Generate JWT token
            const token = jwt.sign({ userId: user.userId }, config.JWT_SECRET, {
                expiresIn: config.JWT_EXPIRES_IN,
            });

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
