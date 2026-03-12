import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ResearchGroup } from "./ResearchGroup";
import { Reservation } from "./Reservation";

@Index("fk_research_group_id_idx", ["researchGroupId"], {})
@Index("uq_researcher_name", ["name"], { unique: true })
@Entity("researcher", { schema: "imi_reserve" })
export class Researcher {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "researcher_id",
    unsigned: true,
  })
  researcherId: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("varchar", { name: "title", length: 255 })
  title: string;

  @Column("int", { name: "research_group_id", unsigned: true })
  researchGroupId: number;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @ManyToOne(
    () => ResearchGroup,
    (researchGroup) => researchGroup.researchers,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([
    { name: "research_group_id", referencedColumnName: "researchGroupId" },
  ])
  researchGroup: ResearchGroup;

  @OneToMany(() => Reservation, (reservation) => reservation.researcher)
  reservations: Reservation[];
}
