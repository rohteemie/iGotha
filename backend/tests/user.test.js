const { storage } = require('../config/database');
const { User } = require('../models/user.model');
const _Validate = require('../helper/validate');



describe('User Model', () => {

  beforeAll(async () => {
    await storage.sync({ force: true });
  });


  afterEach(async () => {
    await User.truncate({ cascade: true });
  });


  afterAll(async () => {
    await storage.close();
  });


  test('Should create all User model fields', async () => {

    const first_name =  "John";
    const last_name =  "Doe";
    const username =  "jonnydoe";
    const email = 'John@Doe.com';

    await User.create({
      first_name,
      last_name,
      username,
	  email
    });

    const user = await User.findOne({ where: { email } });

    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
	expect(user.username).toBeDefined();
    expect(user.first_name).toBeDefined();
	expect(user.last_name).toBeDefined();

    await user.destroy({
      where: {
        email,
      },
    });
  });


  test('Should generate a unique ID using UUID4', async () => {
    const first_name =  "John";
    const last_name =  "Doe";
    const username =  "jonnydoe";
    const email = 'John@Doe.com';

    await User.create({
		first_name,
		last_name,
		username,
		email
	  });

    const user = await User.findOne({ where: { email } });

    expect(_Validate.validate_uuid(user.id)).toBeTruthy();

    expect(user.id.length).toBe(36);

    await user.destroy({
      where: {
        email,
      },
    });
  });


  test('Should not create a user with an invalid email', async () => {
    const first_name =  "John";
    const last_name =  "Doe";
    const username =  "jonnydoe";
    const email = 'JohnDoe.com';

    try {
      await User.create({
        first_name,
        last_name,
        username,
        email
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  }
  );


  // test('Should not create a user with an invalid email', async () => {});


  // test('Should not create a user with an invalid email', async () => {});


  // test('Should not create a user with an invalid email', async () => {});


  // test('Should not create a user with an invalid email', async () => {});


});