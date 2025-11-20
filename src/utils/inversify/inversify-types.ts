export const TYPES = {
  DATABASE_SOURCE: 'DATABASE_SOURCE',
  services: {
    USER_SERVICE: 'USER_SERVICE',
    AUTH_SERVICE: 'AUTH_SERVICE',
  },
  repositories: {
    USER_REPOSITORY: 'USER_REPOSITORY',
  },
  adapters: {
    ENCRYPTION_ADAPTER: 'ENCRYPTION_ADAPTER',
    JWT_ADAPTER: 'JWT_ADAPTER',
    EMAIL_ADAPTER: 'EMAIL_ADAPTER',
  },
  queue: {
    QUEUE_SERVER: 'QUEUE_SERVER',
    producers: {
      EMAIL_PUBLISHER: 'EMAIL_PUBLISHER',
    },
    consumers: {
      EMAIL_CONSUMER: 'EMAIL_CONSUMER',
    }
  }
}
