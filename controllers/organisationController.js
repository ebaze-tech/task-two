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
