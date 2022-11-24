// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Quiz, User } = initSchema(schema);

export {
  Quiz,
  User
};