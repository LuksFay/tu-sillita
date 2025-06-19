import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import { Pasajero } from "../pasajero/pasajero.entity"

@Entity("hoteles")
export class Hotel {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ unique: true })
  nombre: string

  @CreateDateColumn()
  fecha_creacion: Date

  @OneToMany(
    () => Pasajero,
    (pasajero) => pasajero.hotel,
  )
  pasajeros: Pasajero[]
}
