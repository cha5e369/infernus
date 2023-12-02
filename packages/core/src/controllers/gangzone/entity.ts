import * as w from "@infernus/wrapper";
import * as f from "../../wrapper/native/functions";
import { LimitsEnum } from "../../enums";
import type {
  IGangZone,
  GangZonePos,
  ICommonGangZoneKey,
} from "../../interfaces";
import { logger } from "../../logger";
import { PlayerEvent, type Player } from "../player";
import { rgba } from "../../utils/colorUtils";

export class GangZone {
  static readonly gangZones = new Map<ICommonGangZoneKey, GangZone>();

  private static createdGlobalCount = 0;
  private static createdPlayerCount = 0;
  readonly sourceInfo: IGangZone;

  constructor(gangZone: IGangZone) {
    this.sourceInfo = gangZone;
  }

  private _id = -1;
  get id() {
    return this._id;
  }

  create(): void {
    if (this.id !== -1)
      return logger.warn("[GangZone]: Unable to create the gangzone again");

    const { player } = this.sourceInfo;
    if (!player) {
      if (GangZone.createdGlobalCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[GangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = f.GangZoneCreate(minX, minY, maxX, maxY);
      GangZone.createdGlobalCount++;
    } else {
      if (GangZone.createdPlayerCount === LimitsEnum.MAX_GANG_ZONES)
        return logger.warn(
          "[GangZone]: Unable to continue to create gangzone, maximum allowable quantity has been reached"
        );
      const { minX, minY, maxX, maxY } = this.sourceInfo;
      this._id = w.CreatePlayerGangZone(player.id, minX, minY, maxX, maxY);
      GangZone.createdPlayerCount++;
      // PlayerGangZones automatically destroyed when player disconnect
      const off = PlayerEvent.onDisconnect(({ player, next }) => {
        next();
        if (player === this.sourceInfo.player) {
          this.destroy();
          off();
        }
      });
    }
    GangZone.gangZones.set({ id: this.id, global: player === undefined }, this);
  }

  destroy() {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to destroy the gangzone before create"
      );

    const { player } = this.sourceInfo;
    if (!player) {
      f.GangZoneDestroy(this.id);
      GangZone.createdGlobalCount--;
    } else {
      w.PlayerGangZoneDestroy(player.id, this.id);
      GangZone.createdPlayerCount--;
    }

    GangZone.gangZones.delete({
      id: this.id,
      global: player === undefined,
    });

    this._id = -1;
  }

  showForAll(color: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      f.GangZoneShowForAll(this.id, color);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be show for all."
    );
  }

  showForPlayer(color: string | number, player?: Player): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to show the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) w.PlayerGangZoneShow(p.id, this.id, rgba(color));
    else {
      if (player) f.GangZoneShowForPlayer(player.id, this.id, color);
      else return logger.warn("[GangZone]: invalid player for show");
    }
    return this;
  }

  hideForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      f.GangZoneHideForAll(this.id);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be hide for all."
    );
  }

  hideForPlayer(player?: Player): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to hide the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) w.PlayerGangZoneHide(p.id, this.id);
    else {
      if (player) f.GangZoneHideForPlayer(player.id, this.id);
      else return logger.warn("[GangZone]: invalid player for hide");
    }
    return this;
  }

  flashForAll(flashColor: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      f.GangZoneFlashForAll(this.id, flashColor);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be flash for all."
    );
  }

  flashForPlayer(player: Player, flashColor: string | number): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) w.PlayerGangZoneFlash(p.id, this.id, rgba(flashColor));
    else {
      if (player) f.GangZoneFlashForPlayer(player.id, this.id, flashColor);
      else return logger.warn("[GangZone]: invalid player for flash");
    }
    return this;
  }

  stopFlashForAll(): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (!p) {
      f.GangZoneStopFlashForAll(this.id);
      return this;
    }
    return logger.warn(
      "[GangZone]: player's gangzone should not be stop flash for all."
    );
  }

  stopFlashForPlayer(player: Player): void | this {
    if (this.id === -1)
      return logger.warn(
        "[GangZone]: Unable to stop flash the gangzone before create"
      );
    const p = this.sourceInfo.player;
    if (p) w.PlayerGangZoneStopFlash(p.id, this.id);
    else {
      if (player) f.GangZoneStopFlashForPlayer(player.id, this.id);
      else return logger.warn("[GangZone]: invalid player for flash");
    }
    return this;
  }

  isValid(): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsValidPlayerGangZone(p.id, this.id);
    return w.IsValidGangZone(this.id);
  }

  isPlayerIn(player: Player): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsPlayerInPlayerGangZone(p.id, this.id);
    return w.IsPlayerInGangZone(player.id, this.id);
  }

  isVisibleForPlayer(player: Player): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsPlayerGangZoneVisible(p.id, this.id);
    return w.IsGangZoneVisibleForPlayer(player.id, this.id);
  }

  getColorForPlayer(player: Player): void | number {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to get color before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetColor(p.id, this.id);
    return w.GangZoneGetColorForPlayer(player.id, this.id);
  }

  getFlashColorForPlayer(player: Player): void | number {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to get flash color before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetFlashColor(p.id, this.id);
    return w.GangZoneGetFlashColorForPlayer(player.id, this.id);
  }

  isFlashingForPlayer(player: Player): boolean {
    if (this.id === -1) return false;
    const p = this.sourceInfo.player;
    if (p) return w.IsPlayerGangZoneFlashing(p.id, this.id);
    return w.IsGangZoneFlashingForPlayer(player.id, this.id);
  }

  getPos(): void | GangZonePos {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to get position before create");
    const p = this.sourceInfo.player;
    if (p) return w.PlayerGangZoneGetPos(p.id, this.id);
    return w.GangZoneGetPos(this.id);
  }

  useCheck(toggle: boolean): void | this {
    if (this.id === -1)
      return logger.warn("[GangZone]: Unable to use check before create");
    const p = this.sourceInfo.player;
    if (p) w.UsePlayerGangZoneCheck(p.id, this.id, toggle);
    else w.UseGangZoneCheck(this.id, toggle);
    return this;
  }

  static getInstance(g: { id: number; global: boolean }) {
    return this.gangZones.get(g);
  }

  static getInstances() {
    return [...this.gangZones.values()];
  }
}