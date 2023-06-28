import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Admin  {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, default: null })
  username: string;

  @Column({ length: 500, default: null })
  email: string;

  @Column({ length: 500, default: null })
  password: string;

  @Column({ nullable: true, default: null })
  token: string;

  @Column({ default: false })
  email_verified: Boolean;

  @Column({default: 10})
  role_id: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
