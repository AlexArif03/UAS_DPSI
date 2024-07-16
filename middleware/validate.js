const validateAddMember = (req, res, next) => {
    const { id, name, class: memberClass, birthDate, address } = req.body;
    if (!id || !name || !memberClass || !birthDate || !address) {
      return res.status(400).send('All fields are required.');
    }
    next();
  };
  
  module.exports = { validateAddMember };
  