import {BaseEntity,CreateDateColumn,PrimaryGeneratedColumn,UpdateDateColumn,} from "typeorm";
import { instanceToPlain } from "class-transformer";

export default abstract class Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    toJSON() {
      return instanceToPlain(this);
    }
  }
  