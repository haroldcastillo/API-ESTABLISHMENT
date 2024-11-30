import * as bcrypt from 'bcrypt';

export function hashPassword(password: string) {
  const saltRounds = 10; // Define the number of salt rounds
  const salt = bcrypt.genSaltSync(saltRounds); // Generate salt with specified rounds
  return bcrypt.hashSync(password, salt); // Hash the password with the generated salt
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash); // Compare the plain password with the hashed password
}
