import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany, ManyToOne, JoinColumn
} from 'typeorm';
import { Password } from '../../password/entities/password.entity';
import { Project } from '../../project/entities/project.entity';
import { RoleEntity } from '../../common/roles/entities/role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({
    length: 255,
    name: 'first_name',
  })
  public firstName: string;

  @Column({
    length: 255,
    name: 'last_name',
  })
  public lastName: string;

  @Column({
    length: 255,
  })
  public email: string;

  @CreateDateColumn({
    name: 'created_at',
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  public updatedAt!: Date;

  @OneToMany(() => Project, (project) => project.user)
  public projects: Project[];

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ foreignKeyConstraintName: 'id', name: 'role_id' })
  role: RoleEntity;

  @OneToMany(() => Password, (password) => password.user, {})
  public password: Password;
}
