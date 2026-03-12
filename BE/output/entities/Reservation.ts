import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Instrument } from "./Instrument";
import { Researcher } from "./Researcher";

@Index("fk_reservation_instrument_idx", ["instrumentId"], {})
@Index("fk_reservation_researcher_idx", ["researcherId"], {})
@Index("idx_instrument_time", ["instrumentId", "startTime", "endTime"], {})
@Entity("reservation", { schema: "imi_reserve" })
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "researcher_id", unsigned: true })
  researcherId: number;

  @Column("int", { name: "instrument_id", unsigned: true })
  instrumentId: number;

  @Column("datetime", { name: "start_time" })
  startTime: Date;

  @Column("datetime", { name: "end_time" })
  endTime: Date;

  @Column("enum", {
    name: "status",
    enum: ["pending", "confirmed", "cancelled"],
    default: () => "'pending'",
  })
  status: "pending" | "confirmed" | "cancelled";

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Instrument, (instrument) => instrument.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "instrument_id", referencedColumnName: "instrumentId" }])
  instrument: Instrument;

  @ManyToOne(() => Researcher, (researcher) => researcher.reservations, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "researcher_id", referencedColumnName: "researcherId" }])
  researcher: Researcher;
}
