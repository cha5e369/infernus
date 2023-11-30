/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DynamicArea } from "./entity";
import { GameMode } from "core/controllers/gamemode";
import {
  onItemStreamIn,
  onItemStreamOut,
  onPlayerEnterDynamicArea,
  onPlayerLeaveDynamicArea,
} from "../callbacks";
import { defineEvent } from "core/controllers/bus";
import type { Player } from "core/controllers/player/entity";
import { StreamerItemTypes } from "core/enums";

GameMode.onExit(({ next }) => {
  DynamicArea.getInstances().forEach((a) => a.destroy());
  return next();
});

const [onStreamIn, triggerStreamIn] = defineEvent({
  name: "OnDynamicAreaStreamIn",
  isNative: false,
  beforeEach(player: Player, instance: DynamicArea) {
    return { player, instance };
  },
});

const [onStreamOut, triggerStreamOut] = defineEvent({
  name: "OnDynamicAreaStreamOut",
  isNative: false,
  beforeEach(player: Player, instance: DynamicArea) {
    return { player, instance };
  },
});

onItemStreamIn(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.AREA) {
    return triggerStreamIn(forPlayer, DynamicArea.getInstance(id)!);
  }
  return next();
});

onItemStreamOut(({ type, id, forPlayer, next }) => {
  if (type === StreamerItemTypes.AREA) {
    return triggerStreamOut(forPlayer, DynamicArea.getInstance(id)!);
  }
  return next();
});

export const DynamicAreaEvent = {
  onStreamIn,
  onStreamOut,
  onPlayerEnter: onPlayerEnterDynamicArea,
  onPlayerLeave: onPlayerLeaveDynamicArea,
};
