const validPassword = 'ch4ng3m3';

const validEmail = 'natalia@trybe.com'

const noEmailLoginBody = { email: '', password: validPassword };

const notExistingUserBody = { email: 'notfound@email.com', password: validPassword };

const existingUserWithWrongPasswordBody = { email: validEmail, password: 'error' };

const existingUser = { 
  id: 1, 
  email: validEmail,
  password: validPassword,
  username: 'user1',
  role: 'admin', 
};

const validLoginBody = { email: validEmail, password: validPassword };

const validToken = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxfSwiaWF0IjoxNjk0Njk2NTY0fQ.lQaLFCpx3yB4VocrfEoX2ws44SFDob2diH5pLoBFFVM'
}

export default {
  noEmailLoginBody,
  notExistingUserBody,
  existingUserWithWrongPasswordBody,
  existingUser,
  validLoginBody,
  validToken,
};