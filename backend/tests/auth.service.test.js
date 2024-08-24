const { login, register } = require('../services/auth.service'); // Replace with your actual path
const { mockAuthModel, mockHashPassword, mockGenerateJWT, mockResetLoginCount } = require('./__mocks__/auth.util.mock'); // Mock file

jest.mock('../config/database', () => ({
  storage: {
    sync: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../models/auth.model', () => ({
  Auth: {
    findOne: mockAuthModel.findOne,
    create: mockAuthModel.create,
  },
}));

jest.mock('../helper/auth.util', () => ({
  comparePassword: mockHashPassword,
  generateJWT: mockGenerateJWT,
  reset_login_count: mockResetLoginCount,
}));

describe('auth controller tests', () => {
  // Your individual test cases here
});



////////////////////////////////////////////////////////////1
test('login with valid credentials', async () => {
	const email = 'test@example.com';
	const password = 'secret123';
	const userId = 1;

	mockAuthModel.findOne.mockResolvedValueOnce({ id: userId, password: 'hashedPassword' });
	mockHashPassword.mockResolvedValueOnce(true); // Simulate successful password comparison
	mockGenerateJWT.mockReturnValueOnce('your-jwt-token');

	const response = await login(email, password);

	expect(response).toEqual({ token: 'your-jwt-token', status: 200 });
	expect(mockGenerateJWT).toHaveBeenCalledWith(userId); // Verify JWT generation with user ID
  });


  ////////////////////////////////////////////////////////////2
test('login with invalid email', async () => {
  const email = 'nonexistent@example.com';
  const password = 'secret123';

  mockAuthModel.findOne.mockResolvedValueOnce(null); // No user found

  const response = await login(email, password);

  expect(response).toEqual({ message: 'Invalid email', status: 401 });
});



///////////////////////////////////////////////////////3
test('login with invalid password', async () => {
	const email = 'test@example.com';
	const password = 'wrongpassword';

	mockAuthModel.findOne.mockResolvedValueOnce({ id: 1, password: 'hashedPassword' });
	mockHashPassword.mockResolvedValueOnce(false); // Simulate failed password comparison

	const response = await login(email, password);

	expect(response).toEqual({ message: 'Invalid password', status: 401 });
  });



////////////////////////////////////////////////4
test('register with a new user', async () => {
	const email = 'newuser@example.com';
	const password = 'newpassword';

	mockAuthModel.findOne.mockResolvedValueOnce(null); // No existing user
	mockHashPassword.mockResolvedValueOnce('hashedPassword'); // Simulate password hashing

	const response = await register(email, password);

	expect(response).toEqual({ message: 'User created successfully', status: 201 });
	expect(mockAuthModel.create).toHaveBeenCalledWith({ email, password: 'hashedPassword' }); // Verify user creation with hashed password
  });



///////////////////////////////////////////////////////5
test('register with an existing user', async () => {
	const email = 'existinguser@example.com';
	const password = 'newpassword';

	mockAuthModel.findOne.mockResolvedValueOnce({ email }); // Existing user found

	const response = await register(email, password);

	expect(response).toEqual({ message: 'User already exists', status: 400 });
	expect(mockAuthModel.create).toHaveBeenCalledTimes(0); // Verify user creation not called
  });
