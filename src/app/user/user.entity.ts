import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, default: null })
  fullName: string;

  @Column({ length: 500, default: "user" })
  role: string;

  @Column({ length: 500, default: null })
  email: string;

  @Column({ length: 500, default: null })
  password: string;

  @Column({ nullable: true, default: null })
  token: string;

  @Column({ default: false })
  email_verified: Boolean;

  @UpdateDateColumn({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @CreateDateColumn({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
