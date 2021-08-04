import { Entity, Column, Index, PrimaryGeneratedColumn } from "typeorm";

export enum TransactionType {
    TRANSFER = "transfer",
    REFILL = "refill",
    RETRIEVAL = "retrieval"
}


@Entity()
export class AccountTransaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    accountFrom?: number;

    @Column({ nullable: true })
    accountTo?: number;

    @Column({
        type: "enum",
        enum: TransactionType
    })
    type: TransactionType;

    @Column({ type: "double precision" })
    amount: number;

    @Column({ nullable: true })
    @Index()
    paymentId: string;
}
