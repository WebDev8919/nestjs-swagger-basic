import { createConnection } from "typeorm";
import { User } from "src/app/user/user.entity";
import { Admin } from "src/app/admin/admin.entity";

require("dotenv").config();

export const databaseProviders = [
  {
    provide: "DATABASE_CONNECTION",
    useFactory: async () =>
      await createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [User, Admin],
        synchronize: true,
      }),
  },
];
