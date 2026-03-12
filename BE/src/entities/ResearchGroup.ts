import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Researcher } from "./Researcher";

@Index("uq_research_group_name", ["name"], { unique: true })
@Entity("research_group", { schema: "imi_reserve" })
export class ResearchGroup {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "research_group_id",
    unsigned: true,
  })
  researchGroupId: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("datetime", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("datetime", { name: "deleted_at", nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Researcher, (researcher) => researcher.researchGroup)
  researchers: Researcher[];
}
