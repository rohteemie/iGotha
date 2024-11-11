const { User } = require('../models/user.model');
const { Auth } = require('../models/auth.model');
const userService = require('../services/user.service');

describe('doesUserExist', () => {
  it('should return true if the user exists in User or Auth model', async () => {
    const email = 'test@example.com';

    // Mock the findOne function for both User and Auth models
    User.findOne = jest.fn().mockResolvedValue({ email });
    Auth.findOne = jest.fn().mockResolvedValue(null);

    const result = await doesUserExist(email);
    expect(result).toBeTruthy();
  });

  it('should return false if the user does not exist in either model', async () => {
    const email = 'nonexistent@example.com';

    User.findOne = jest.fn().mockResolvedValue(null);
    Auth.findOne = jest.fn().mockResolvedValue(null);

    const result = await doesUserExist(email);
    expect(result).toBeFalsy();
  });
});
