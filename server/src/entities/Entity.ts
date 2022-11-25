import {BaseEntity,CreateDateColumn,PrimaryGeneratedColumn,UpdateDateColumn,} from "typeorm";
import { instanceToPlain } from "class-transformer";

//엔터티는 데이터베이스 테이블에 매핑되는 클래스
export default abstract class Entity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    toJSON() {
      return instanceToPlain(this); //클래스(생성자) 개체를 일반(리터럴) 개체로 변환합니다. 반대는  plainToClass
    }
  }
  