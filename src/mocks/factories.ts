import { faker } from '@faker-js/faker'

export const createUser = () => ({
  id: faker.string.uuid(),
  username: faker.internet.username(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'user']),
  createdAt: faker.date.past().toISOString(),
})

export const createAuthResponse = (user = createUser()) => ({
  user,
  token: faker.string.alphanumeric(32),
})
