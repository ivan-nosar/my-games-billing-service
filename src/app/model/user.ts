import { Entity, Column, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    email: string;

    @Column({ name: "score_value", type: "double precision" })
    score: number;
}
