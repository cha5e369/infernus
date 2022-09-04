import {
  OnNPCEnterVehicle,
  OnNPCExitVehicle,
  OnPlayerEnterVehicle,
  OnPlayerExitVehicle,
  OnVehicleDamageStatusUpdate,
  OnVehicleDeath,
  OnVehicleMod,
  OnVehiclePaintjob,
  OnVehicleRespray,
  OnVehicleSirenStateChange,
  OnVehicleSpawn,
  OnVehicleStreamIn,
  OnVehicleStreamOut,
  OnTrailerUpdate,
} from "@/wrapper/callbacks";
import { BasePlayer, BasePlayerEvent } from "../player";
import { BaseVehicle } from "./baseVehicle";
import { vehicleBus, vehicleHooks } from "./vehicleBus";

export abstract class BaseVehicleEvent<
  P extends BasePlayer,
  E extends BasePlayerEvent<P>,
  V extends BaseVehicle
> {
  public readonly vehicles: Array<V> = [];
  private playerEvent: E;

  constructor(playerEvent: E) {
    this.playerEvent = playerEvent;
    // The class event is extended through the event bus
    vehicleBus.on(vehicleHooks.created, (veh: V) => {
      this.vehicles.push(veh);
    });
    vehicleBus.on(vehicleHooks.destroyed, (veh: V) => {
      const vIdx = this.vehicles.findIndex((v) => v === veh);
      if (vIdx === -1) return;
      this.vehicles.splice(vIdx, 1);
    });
    OnVehicleDamageStatusUpdate((vehicleid, playerid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      const p = this.findPlayerById(playerid);
      if (!p) return;
      this.onDamageStatusUpdate(v, p);
    });
    OnVehicleDeath((vehicleid, killerid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      const k = this.findPlayerById(killerid);
      if (!k) return;
      this.onDeath(v, k);
    });
    OnVehicleMod((playerid, vehicleid, componentid) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onMod(p, v, componentid);
    });
    OnVehiclePaintjob((playerid, vehicleid, paintjobid) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onPaintjob(p, v, paintjobid);
    });
    OnVehicleRespray((playerid, vehicleid, color1, color2) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onRespray(p, v, color1, color2);
    });
    OnVehicleSirenStateChange((playerid, vehicleid, newstate) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onSirenStateChange(p, v, Boolean(newstate));
    });
    OnVehicleSpawn((vehicleid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onSpawn(v);
    });
    OnVehicleStreamIn((vehicleid, forplayerid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      const p = this.findPlayerById(forplayerid);
      if (!p) return;
      this.onStreamIn(v, p);
    });
    OnVehicleStreamOut((vehicleid, forplayerid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      const p = this.findPlayerById(forplayerid);
      if (!p) return;
      this.onStreamOut(v, p);
    });
    OnPlayerEnterVehicle((playerid, vehicleid, ispassenger) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onPlayerEnter(p, v, Boolean(ispassenger));
    });
    OnPlayerExitVehicle((playerid, vehicleid) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onPlayerExit(p, v);
    });
    OnNPCEnterVehicle((vehicleid, seatid) => {
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onNpcEnter(v, seatid);
    });
    OnNPCExitVehicle(this.onNpcExit);
    OnTrailerUpdate((playerid, vehicleid) => {
      const p = this.findPlayerById(playerid);
      if (!p) return;
      const v = this.findVehicleById(vehicleid);
      if (!v) return;
      this.onTrailerUpdate(p, v);
    });
  }

  protected abstract onDamageStatusUpdate(vehicle: V, player: P): void;
  protected abstract onDeath(vehicle: V, killer: P): void;
  protected abstract onMod(player: P, vehicle: V, componentid: number): void;
  protected abstract onPaintjob(
    player: P,
    vehicle: V,
    paintjobid: number
  ): void;
  protected abstract onRespray(
    player: P,
    vehicle: V,
    color1: number,
    color2: number
  ): void;
  protected abstract onSirenStateChange(
    player: P,
    vehicle: V,
    newstate: boolean
  ): void;
  protected abstract onSpawn(vehicle: V): void;
  protected abstract onStreamIn(vehicle: V, forplayer: P): void;
  protected abstract onStreamOut(vehicle: V, forplayer: P): void;
  protected abstract onPlayerEnter(
    player: P,
    vehicle: V,
    isPassenger: boolean
  ): void;
  protected abstract onPlayerExit(player: P, vehicle: V): void;
  protected abstract onNpcEnter(vehicle: V, seatid: number): void;
  protected abstract onNpcExit(): void;
  protected abstract onTrailerUpdate(player: P, vehicle: V): void;

  public findVehicleIdxById(vehicleid: number) {
    return this.vehicles.findIndex((v) => v.id === vehicleid);
  }
  public findVehicleById(vehicleid: number) {
    return this.vehicles.find((v) => v.id === vehicleid);
  }
  private findPlayerIdxById(playerid: number) {
    return this.playerEvent.findPlayerIdxById(playerid);
  }
  private findPlayerById(playerid: number) {
    return this.playerEvent.findPlayerById(playerid);
  }
}
