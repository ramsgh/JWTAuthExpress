const mockAuthenticate = (roleType) => {
  return (req, res, next) => {
    req.user = {
      id: 'usr_123456',
      username: 'johndoe',
      role: roleType,
    };
    next();
  };
};

module.exports = mockAuthenticate;
