const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { hash } = require('./../helpers/hash');
const { sign } = require('../helpers/jwt');

// dummy user
const user = {
  username: 'hafidh_ahmad_fauzan',
  email: 'hafidh_ahmad_fauzan@gmail.com',
  password: 'hafidh2001',
  createdAt: new Date(),
  updatedAt: new Date()
};
const userToken = sign({ id: 1, email: user.email });
const userNotExistsToken = sign({ id: 99, email: 'notexists@mail.com' });

// dummy photo
const defaultPhoto = {
  title: 'Default Photo',
  caption: 'Default Photo caption',
  image_url: 'http://image.com/defaultphoto.png',
  createdAt: new Date(),
  updatedAt: new Date(),
  UserId: 1
};

// data test
const photoData = {
  title: "hafidh programming javascript",
  caption: "keep learn until you won't to open stackoverflow",
  image_url: "http://image.com/hafidh.png",
};

beforeAll(async () => {
  await queryInterface.bulkDelete('Photos', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  await queryInterface.bulkDelete('Users', null, {
    truncate: true,
    restartIdentity: true,
    cascade: true
  });
  const hashedUser = { ...user };
  hashedUser.password = hash(hashedUser.password);
  await queryInterface.bulkInsert('Users', [hashedUser]);
  await queryInterface.bulkInsert('Photos', [defaultPhoto]);
});

afterAll(async () => {
  await sequelize.close();
});

describe('GET /photos', () => {
  test('should return HTTP status code 200', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body.length).toBe(1);
    expect(body[0]).toEqual({
      id: 1,
      title: defaultPhoto.title,
      caption: defaultPhoto.caption,
      image_url: defaultPhoto.image_url,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      UserId: 1
    });
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .get('/photos')
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .get('/photos')
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});

describe("POST /photos", () => {
  test("should send response with 201 status code", async () => {
    const res = await request(app).post('/photos').set('Authorization', `Bearer ${userToken}`).send(photoData).expect(201);
    expect(typeof res.body).toEqual("object");
    expect(res.body).toEqual({
      id: 2,
      title: photoData.title,
      caption: `${photoData.title.toUpperCase()} ${photoData.image_url}`,
      image_url: photoData.image_url,
      UserId: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const res = await request(app).post('/photos').send(photoData).expect(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const res = await request(app).post('/photos').set('Authorization', 'Bearer ').send(photoData).expect(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const res = await request(app).post('/photos').set('Authorization', 'Bearer wrong.token.input').send(photoData).expect(401);
    expect(res.body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const res = await request(app).post('/photos').set('Authorization', `Bearer ${userNotExistsToken}`).send(photoData).expect(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });
  test("should return HTTP code 400 when create-photo without username", async () => {
    const res = await request(app).post('/photos').set('Authorization', `Bearer ${userToken}`).send({ caption:photoData.caption, image_url:photoData.image_url }).expect(400);
    expect(res.body.message).toEqual(expect.arrayContaining(['Title cannot be omitted']));
  });
});

describe('GET /photos/:id', () => {
  test('should return HTTP status code 200', async () => {
    const { body } = await request(app)
      .get('/photos/1')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    expect(body).toEqual({
      id: 1,
      title: defaultPhoto.title,
      caption: defaultPhoto.caption,
      image_url: defaultPhoto.image_url,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      User: {
        id: 1,
        email: user.email,
        username: user.username,
      }
    });
  });
  test('should return HTTP status code 401 when no authorization', async () => {
    const { body } = await request(app)
      .get('/photos/1')
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos/1')
      .set('Authorization', 'Bearer ')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when no token provided', async () => {
    const { body } = await request(app)
      .get('/photos/1')
      .set('Authorization', 'Bearer wrong.token.input')
      .expect(401);
    expect(body.message).toMatch(/invalid token/i);
  });
  test('should return HTTP status code 401 when user does not exist', async () => {
    const { body } = await request(app)
      .get('/photos/1')
      .set('Authorization', `Bearer ${userNotExistsToken}`)
      .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
  });
});
