import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserChat } from '../../chat/models/user-chat.entity';
import { RoleEntity } from '../../common/roles/entities/role.entity';
import { FileModel } from '../../file/models/file.entity';
import { Password } from '../../password/models/password.entity';
import { Project } from '../../project/models/project.entity';

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
    unique: true,
    nullable: false,
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

  @OneToOne(() => FileModel, { nullable: true })
  @JoinColumn({ name: 'avatar_id' })
  public avatar?: FileModel;

  @OneToMany(() => Project, (project) => project.user)
  public projects: Project[];

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  public role: RoleEntity;

  @OneToMany(() => UserChat, (uc) => uc.user)
  public userChats: UserChat[];

  @OneToMany(() => Password, (password) => password.user, {})
  public password: Password[];
}
