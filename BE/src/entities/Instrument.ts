import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Facility } from "./Facility";
import { Reservation } from "./Reservation";

@Index("fk_instrument_category_idx", ["categoryId"], {})
@Index("fk_instrument_facility_idx", ["facilityId"], {})
@Index("uk_instrument_name", ["name"], { unique: true })
@Entity("instrument", { schema: "imi_reserve" })
export class Instrument {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "instrument_id",
    unsigned: true,
  })
  instrumentId: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("varchar", { name: "image_url", length: 255 })
  imageUrl: string;

  @Column("int", { name: "category_id", unsigned: true })
  categoryId: number;

  @Column("int", { name: "facility_id", unsigned: true })
  facilityId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(() => Category, (category) => category.instruments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @ManyToOne(() => Facility, (facility) => facility.instruments, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "facility_id", referencedColumnName: "facilityId" }])
  facility: Facility;

  @OneToMany(() => Reservation, (reservation) => reservation.instrument)
  reservations: Reservation[];
}
