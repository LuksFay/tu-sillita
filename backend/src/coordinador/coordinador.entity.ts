import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Pasajero } from "../pasajero/pasajero.entity"

@Entity("coordinadores")
export class Coordinador {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  nombre: string

  @Column()
  empresa: string

  @Column({ type: "date" })
  fecha_inicio: Date

  @Column({ type: "date" })
  fecha_fin: Date

  @Column({ unique: true })
  token_qr: string

  @Column({ default: true })
  activo: boolean

  @CreateDateColumn()
  fecha_creacion: Date

  @UpdateDateColumn()
  fecha_actualizacion: Date

  @OneToMany(
    () => Pasajero,
    (pasajero) => pasajero.coordinador,
  )
  pasajeros: Pasajero[]
}
