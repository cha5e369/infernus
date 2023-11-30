/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Player } from "../player";
import { Vehicle } from "./entity";
import { GameMode } from "../gamemode";
import { defineEvent } from "../bus";

GameMode.onExit(({ next }) => {
  Vehicle.getInstances().forEach((v) => v.destroy());
  next();
});

const [onDamageStatusUpdate] = defineEvent({
  name: "OnVehicleDamageStatusUpdate",
  beforeEach(vid: number, pid: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      player: Player.getInstance(pid)!,
    };
  },
});

const [onDeath] = defineEvent({
  name: "OnVehicleDeath",
  beforeEach(vid: number, pid: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      killer: Player.getInstance(pid)!,
    };
  },
});

const [onMod] = defineEvent({
  name: "OnVehicleMod",
  beforeEach(pid: number, vid: number, componentId: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      componentId,
    };
  },
});

const [onPaintjob] = defineEvent({
  name: "OnVehiclePaintjob",
  beforeEach(pid: number, vid: number, paintjobId: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      paintjobId,
    };
  },
});

const [onRespray] = defineEvent({
  name: "OnVehicleRespray",
  beforeEach(pid: number, vid: number, color1: number, color2: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      color: [color1, color2],
    };
  },
});

const [onSirenStateChange] = defineEvent({
  name: "OnVehicleSirenStateChange",
  beforeEach(pid: number, vid: number, state: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      state: !!state,
    };
  },
});

const [onSpawn] = defineEvent({
  name: "OnVehicleSpawn",
  beforeEach(vid: number) {
    return { vehicle: Vehicle.getInstance(vid)! };
  },
});

const [onStreamIn] = defineEvent({
  name: "OnVehicleStreamIn",
  beforeEach(vid: number, forPlayer: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      forPlayer: Player.getInstance(forPlayer)!,
    };
  },
});

const [onStreamOut] = defineEvent({
  name: "OnVehicleStreamOut",
  beforeEach(vid: number, forPlayer: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      forPlayer: Player.getInstance(forPlayer)!,
    };
  },
});

const [onPlayerEnter] = defineEvent({
  name: "OnPlayerEnterVehicle",
  beforeEach(pid: number, vid: number, isPassenger: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
      isPassenger: !!isPassenger,
    };
  },
});

const [onPlayerExit] = defineEvent({
  name: "OnPlayerExitVehicle",
  beforeEach(pid: number, vid: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
    };
  },
});

const [onNpcEnter] = defineEvent({
  name: "OnNpcEnterVehicle",
  beforeEach(vid: number, seatId: number) {
    return {
      vehicle: Vehicle.getInstance(vid)!,
      seatId,
    };
  },
});

const [onNpcExit] = defineEvent({
  name: "OnNpcExitVehicle",
});

const [onTrailerUpdate] = defineEvent({
  name: "OnTrailerUpdate",
  beforeEach(pid: number, vid: number) {
    return {
      player: Player.getInstance(pid)!,
      vehicle: Vehicle.getInstance(vid)!,
    };
  },
});

export const VehicleEvent = {
  onDamageStatusUpdate,
  onDeath,
  onMod,
  onPaintjob,
  onRespray,
  onSirenStateChange,
  onSpawn,
  onStreamIn,
  onStreamOut,
  onPlayerEnter,
  onPlayerExit,
  onNpcEnter,
  onNpcExit,
  onTrailerUpdate,
};
