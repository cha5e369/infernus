/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { defineEvent } from "../bus";
import { GameMode } from "../gamemode";
import { Player } from "../player";
import { GangZone } from "./entity";

GameMode.onExit(({ next }) => {
  GangZone.getInstances(true).forEach((g) => g.destroy());
  GangZone.getInstances(false).forEach((g) => g.destroy());
  return next();
});

const [onPlayerEnterGlobal] = defineEvent({
  name: "OnPlayerEnterGangZone",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, true)!,
    };
  },
});

const [onPlayerLeaveGlobal] = defineEvent({
  name: "OnPlayerLeaveGangZone",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, true)!,
    };
  },
});

const [onPlayerEnterPlayer] = defineEvent({
  name: "OnPlayerEnterPlayerGangZone",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, false)!,
    };
  },
});

const [onPlayerLeavePlayer] = defineEvent({
  name: "OnPlayerLeavePlayerGangZone",
  beforeEach(pid: number, gid: number) {
    return {
      player: Player.getInstance(pid)!,
      gangZone: GangZone.getInstance(gid, false)!,
    };
  },
});

export const GangZoneEvent = Object.freeze({
  onPlayerEnterGlobal,
  onPlayerLeaveGlobal,
  onPlayerEnterPlayer,
  onPlayerLeavePlayer,
});
