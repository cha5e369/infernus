import { BasePlayer } from "@/controllers/player";
import { TCommonCallback } from "@/types";
import { promisifyCallback } from "@/utils/helperUtils";
import { OnGameModeExit } from "@/wrapper/native/callbacks";
import {
  OnPlayerEnterDynamicArea,
  OnPlayerLeaveDynamicArea,
  StreamerItemTypes,
} from "omp-wrapper-streamer";
import { Streamer } from "../common";
import { areaBus, areaHooks } from "./areaBus";
import { DynamicArea } from "./baseArea";

export abstract class DynamicAreaEvent<
  P extends BasePlayer,
  A extends DynamicArea
> {
  private readonly areas = new Map<number, A>();
  private readonly players;

  constructor(playersMap: Map<number, P>, destroyOnExit = true) {
    this.players = playersMap;

    areaBus.on(areaHooks.created, (res: A) => {
      this.areas.set(res.id, res);
    });
    areaBus.on(areaHooks.destroyed, (res: A) => {
      if (this.areas.has(res.id)) this.areas.delete(res.id);
    });

    if (destroyOnExit) {
      OnGameModeExit(() => {
        this.areas.forEach((a) => a.destroy());
        this.areas.clear();
      });
    }

    OnPlayerEnterDynamicArea((playerId, areaId) => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const a = this.areas.get(areaId);
      if (!a) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerEnter",
        "OnPlayerEnterDynamicArea"
      );
      return pFn(p, a);
    });
    OnPlayerLeaveDynamicArea((playerId, areaId) => {
      const p = this.players.get(playerId);
      if (!p) return 0;
      const a = this.areas.get(areaId);
      if (!a) return 0;
      const pFn = promisifyCallback(
        this,
        "onPlayerLeave",
        "OnPlayerLeaveDynamicArea"
      );
      return pFn(p, a);
    });
    Streamer.onItemStreamIn((type, item, player) => {
      if (type === StreamerItemTypes.AREA) {
        const a = this.areas.get(item);
        const p = this.players.get(player);
        if (a && p)
          return promisifyCallback(
            this,
            "onStreamIn",
            "Streamer_OnItemStreamIn"
          )(a, p);
      }
      return 1;
    });
    Streamer.onItemStreamOut((type, item, player) => {
      if (type === StreamerItemTypes.AREA) {
        const a = this.areas.get(item);
        const p = this.players.get(player);
        if (a && p)
          return promisifyCallback(
            this,
            "onStreamOut",
            "Streamer_OnItemStreamOut"
          )(a, p);
      }
      return 1;
    });
  }

  onPlayerEnter?(player: P, area: A): TCommonCallback;
  onPlayerLeave?(player: P, area: A): TCommonCallback;
  onStreamIn?(area: A, player: P): TCommonCallback;
  onStreamOut?(area: A, player: P): TCommonCallback;

  getAreasArr(): Array<A> {
    return [...this.areas.values()];
  }

  getAreasMap(): Map<number, A> {
    return this.areas;
  }
}
