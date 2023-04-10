import type { IDynamicPickup } from "@/interfaces";
import { logger } from "@/logger";
import {
  CreateDynamicPickup,
  CreateDynamicPickupEx,
  DestroyDynamicPickup,
  IsValidDynamicPickup,
  StreamerDistances,
  StreamerItemTypes,
} from "@infernus/streamer";
import { Streamer } from "../common";
import { pickupBus, pickupHooks } from "./pickupBus";

export class DynamicPickup {
  private sourceInfo: IDynamicPickup;
  private _id = -1;
  get id(): number {
    return this._id;
  }
  constructor(pickup: IDynamicPickup) {
    this.sourceInfo = pickup;
  }
  create(): void | this {
    if (this.id !== -1)
      return logger.warn("[StreamerPickup]: Unable to create pickup again");
    let { streamdistance, worldid, interiorid, playerid, areaid, priority } =
      this.sourceInfo;
    const { type, modelid, x, y, z, extended } = this.sourceInfo;

    if (type < 0 || type > 22)
      return logger.error("[StreamerPickup]: Invalid pickup type");

    streamdistance ??= StreamerDistances.PICKUP_SD;
    priority ??= 0;

    if (extended) {
      if (typeof worldid === "number") worldid = [-1];
      else worldid ??= [-1];
      if (typeof interiorid === "number") interiorid = [-1];
      else interiorid ??= [-1];
      if (typeof playerid === "number") playerid = [-1];
      else playerid ??= [-1];
      if (typeof areaid === "number") areaid = [-1];
      else areaid ??= [-1];

      this._id = CreateDynamicPickupEx(
        modelid,
        type,
        x,
        y,
        z,
        streamdistance,
        worldid,
        interiorid,
        playerid,
        areaid,
        priority
      );
    } else {
      if (Array.isArray(worldid)) worldid = -1;
      else worldid ??= -1;
      if (Array.isArray(interiorid)) interiorid = -1;
      else interiorid ??= -1;
      if (Array.isArray(playerid)) playerid = -1;
      else playerid ??= -1;
      if (Array.isArray(areaid)) areaid = -1;
      else areaid ??= -1;

      this._id = CreateDynamicPickup(
        modelid,
        type,
        x,
        y,
        z,
        worldid,
        interiorid,
        playerid,
        streamdistance,
        areaid,
        priority
      );
    }

    pickupBus.emit(pickupHooks.created, this);
    return this;
  }
  destroy(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[StreamerPickup]: Unable to destroy the pickup before create"
      );
    DestroyDynamicPickup(this.id);
    pickupBus.emit(pickupHooks.destroyed, this);
    return this;
  }
  isValid(): boolean {
    return IsValidDynamicPickup(this.id);
  }
  toggleCallbacks(toggle = true): void | number {
    if (this.id === -1)
      return logger.warn(
        "[StreamerPickup]: Unable to toggle callbacks before create"
      );
    return Streamer.toggleItemCallbacks(
      StreamerItemTypes.PICKUP,
      this.id,
      toggle
    );
  }
  isToggleCallbacks(): boolean {
    if (this.id === -1) false;
    return Streamer.isToggleItemCallbacks(StreamerItemTypes.PICKUP, this.id);
  }
}
