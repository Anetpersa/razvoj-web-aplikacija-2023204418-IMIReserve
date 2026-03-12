import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Instrument } from "./Instrument";

@Index("uq_facility_name", ["name"], { unique: true })
@Entity("facility", { schema: "imi_reserve" })
export class Facility {
  @PrimaryGeneratedColumn({ type: "int", name: "facility_id", unsigned: true })
  facilityId: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("datetime", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Instrument, (instrument) => instrument.facility)
  instruments: Instrument[];
}
