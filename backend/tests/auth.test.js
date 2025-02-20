const { storage } = require('../config/database');
const { Auth } = require('../models/auth.model');
const validate = require('../helper/validate');



describe('Auth Model', () => {

  beforeAll(async () => {
    await storage.sync({ force: true });
  });

  afterEach(async () => {
    await Auth.truncate({ cascade: true });
  });

  afterAll(async () => {
    await storage.close();
  });


  test('Create all Auth model fields', async () => {
    const email = 'testmail@testmail.com';
    const password = 'TestPass123@.';

    await Auth.create({
      email,
      password
    });

    const user = await Auth.findOne({ where: { email } });

    expect(user.id).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.password).toBeDefined();
    expect(user.account_locked).toBeDefined();
    expect(user.account_locked_date).toBeDefined();
    expect(user.failed_login_count).toBeDefined();

    await user.destroy({
      where: {
        email,
      },
    });
  });



  test('Generate a unique ID to users using UUID4', async () => {
    const email = 'testmail@testmail.com';
    const password = 'TestPass123@.';

    const auth = await Auth.create({
      email,
      password
    });

    const user = await Auth.findOne({ where: { email } });

    expect(validate.validate_uuid(user.id)).toBeTruthy();

    expect(user.id.length).toBe(36);

    await user.destroy({
      where: {
        email,
      },
    });
  });


  test(`Check if it's valid for email and password`, async () => {
    const email = 'testmail@testmail.com';
    const password = 'TestPass123@.';

    expect(validate.my_email(email)).toBeTruthy();
    expect(validate.my_password(password)).toBeTruthy();


  });

});