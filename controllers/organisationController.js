const { Organisation, User } = require('../models');

exports.getOrganisations = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findByPk(userId);
    const organisations = await user.getOrganisations();

    res.status(200).json({
      status: 'success',
      message: 'Organisations retrieved successfully',
      data: {
        organisations,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to retrieve organisations',
      statusCode: 400,
    });
  }
};

exports.createOrganisation = async (req, res) => {
  const userId = req.user.userId;
  const { name, description } = req.body;

  try {
    const org = await Organisation.create({
      orgId: `org-${Date.now()}`,
      name,
      description,
    });

    const user = await User.findByPk(userId);
    await user.addOrganisation(org);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Failed to create organisation',
      statusCode: 400,
    });
  }
};

















const { Organisation, User } = require('../models');

exports.getAllOrganisations = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId, { include: Organisation });

    res.status(200).json({
      status: 'success',
      message: 'Organisations fetched successfully',
      data: {
        organisations: user.Organisations,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'Bad request',
      message: 'Failed to fetch organisations',
      statusCode: 400,
    });
  }
};

exports.getOrganisation = async (req, res) => {
  const { userId } = req.user;
  const { orgId } = req.params;

  try {
    const organisation = await Organisation.findByPk(orgId);

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    const user = await organisation.hasUser(userId);

    if (!user) {
      return res.status(403).json({
        status: 'Forbidden',
        message: 'Access denied',
        statusCode: 403,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Organisation fetched successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(500).json({
      status: 'Bad request',
      message: 'Failed to fetch organisation',
      statusCode: 400,
    });
  }
};

exports.createOrganisation = async (req, res) => {
  const { userId } = req.user;
  const { name, description } = req.body;

  try {
    const organisation = await Organisation.create({
      orgId: uuidv4(),
      name,
      description,
    });

    const user = await User.findByPk(userId);
    await user.addOrganisation(organisation);

    res.status(201).json({
      status: 'success',
      message: 'Organisation created successfully',
      data: organisation,
    });
  } catch (error) {
    res.status(400).json({
      status: 'Bad request',
      message: 'Client error',
      statusCode: 400,
    });
  }
};

exports.addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.body;

  try {
    const organisation = await Organisation.findByPk(orgId);

    if (!organisation) {
      return res.status(404).json({
        status: 'Not found',
        message: 'Organisation not found',
        statusCode: 404,
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: 'Not found',
        message: 'User not found',
        statusCode: 404,
      });
    }

    await organisation.addUser(user);

    res.status(200).json({
      status: 'success',
      message: 'User added to organisation successfully',
    });
  } catch (error) {
    res.status(500).json({
      status: 'Bad request',
      message: 'Failed to add user to organisation',
      statusCode: 400,
    });
  }
};
