import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { Hotel } from "../hotel/hotel.entity"
import { Coordinador } from "../coordinador/coordinador.entity"

export enum EstadoPasajero {
  PENDIENTE = "pendiente",
  ENTREGADO = "entregado",
  DEVUELTO = "devuelto",
}

@Entity("pasajeros")
export class Pasajero {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column({ nullable: true })
  nombre: string

  @Column()
  hotel_id: string

  @Column()
  cantidad_sillas: number

  @Column({ unique: true })
  qr_token: string

  @Column()
  coordinador_id: string

  @Column({
    type: "enum",
    enum: EstadoPasajero,
    default: EstadoPasajero.PENDIENTE,
  })
  estado: EstadoPasajero

  @CreateDateColumn()
  fecha_creacion: Date

  @Column({ type: "timestamp", nullable: true })
  fecha_entrega: Date

  @Column({ type: "timestamp", nullable: true })
  fecha_devolucion: Date

  @UpdateDateColumn()
  fecha_actualizacion: Date

  @ManyToOne(
    () => Hotel,
    (hotel) => hotel.pasajeros,
  )
  @JoinColumn({ name: "hotel_id" })
  hotel: Hotel

  @ManyToOne(
    () => Coordinador,
    (coordinador) => coordinador.pasajeros,
  )
  @JoinColumn({ name: "coordinador_id" })
  coordinador: Coordinador
}
