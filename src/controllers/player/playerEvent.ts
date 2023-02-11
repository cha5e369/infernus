import {
  NOOP,
  OnPlayerCommandText,
  OnPlayerText,
  promisifyCallback,
} from "@/utils/helperUtils";
import * as cbs from "@/wrapper/native/callbacks";
import { I18n } from "../i18n";
import { BasePlayer } from "./basePlayer";
import { CmdBus } from "../command";
import { ICmdErr } from "@/interfaces";
import * as enums from "@/enums";
import { throttle } from "lodash";
import { BaseDialog } from "../promise/dialog";
import { delCCTask } from "../promise/client";
import { playerBus, playerHooks } from "./playerBus";
import { TCommonCallback } from "@/types";

// Each instance can be called to callbacks, so you can split the logic.

const ICmdErrInfo: Record<string, ICmdErr> = {
  format: { code: 0, msg: "incorrect command" },
  notExist: { code: 1, msg: "does not exist" },
};

export abstract class BasePlayerEvent<P extends BasePlayer> {
  private readonly players = new Map<number, P>();
  private readonly cmdBus = new CmdBus<P>();

  readonly onCommandText = this.cmdBus.on;
  readonly offCommandText = this.cmdBus.off;

  constructor(newPlayerFn: (id: number) => P) {
    cbs.OnPlayerConnect((playerid: number): number => {
      const p = newPlayerFn(playerid);
      this.players.set(playerid, p);
      const pFn = promisifyCallback(this, "onConnect", "OnPlayerConnect");
      return pFn(p);
    });

    cbs.OnPlayerDisconnect((playerid: number, reason: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      BaseDialog.close(p);
      delCCTask(playerid, true);
      const pFn = promisifyCallback(this, "onDisconnect", "OnPlayerDisconnect");
      const result = pFn(p, reason);
      this.players.delete(playerid);
      return result;
    });

    OnPlayerText((playerid: number, byteArr: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 1;
      const pFn = promisifyCallback(this, "onText", "OnPlayerTextI18n", 0);
      return pFn(p, I18n.decodeFromBuf(byteArr, p.charset));
    });

    OnPlayerCommandText((playerid: number, buf: number[]): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const cmdtext = I18n.decodeFromBuf(buf, p.charset);
      const regCmdtext = cmdtext.match(/[^/\s]+/gi);
      if (regCmdtext === null || regCmdtext.length === 0) {
        this.onCommandError &&
          this.onCommandError(p, cmdtext, ICmdErrInfo.format);
        return 0;
      }
      this.promiseCommand(p, regCmdtext);
      return 1;
    });

    cbs.OnEnterExitModShop(
      (playerid: number, enterexit: number, interior: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(this, "onEnterExitModShop");
        return pFn(p, enterexit, interior);
      }
    );

    cbs.OnPlayerClickMap(
      (playerid: number, fX: number, fY: number, fZ: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(this, "onClickMap", "OnPlayerClickMap");
        return pFn(p, fX, fY, fZ);
      }
    );

    cbs.OnPlayerClickPlayer(
      (playerid: number, clickedplayerid: number, source: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const cp = this.findPlayerById(clickedplayerid);
        if (!cp) return 0;
        const pFn = promisifyCallback(
          this,
          "onClickPlayer",
          "OnPlayerClickPlayer"
        );
        return pFn(p, cp, source);
      }
    );

    cbs.OnPlayerDeath(
      (playerid: number, killerid: number, reason: number): number => {
        const pFn = promisifyCallback(this, "onDeath", "OnPlayerDeath");
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (killerid === enums.InvalidEnum.PLAYER_ID) {
          return pFn(p, killerid, reason);
        }
        const k = this.findPlayerById(killerid);
        if (!k) return 0;
        return pFn(p, k, reason);
      }
    );

    cbs.OnPlayerGiveDamage(
      (
        playerid: number,
        damageid: number,
        amount: number,
        weaponid: enums.WeaponEnum,
        bodypart: enums.BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const d = this.findPlayerById(damageid);
        if (!d) return 0;
        const pFn = promisifyCallback(
          this,
          "onGiveDamage",
          "OnPlayerGiveDamage"
        );
        return pFn(p, d, amount, weaponid, bodypart);
      }
    );

    cbs.OnPlayerKeyStateChange(
      (playerid: number, newkeys: number, oldkeys: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(
          this,
          "onKeyStateChange",
          "OnPlayerKeyStateChange"
        );
        return pFn(p, newkeys, oldkeys);
      }
    );

    cbs.OnPlayerRequestClass((playerid: number, classid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback(
        this,
        "onRequestClass",
        "OnPlayerRequestClass"
      );
      return pFn(p, classid);
    });

    cbs.OnPlayerRequestSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback(
        this,
        "onRequestSpawn",
        "OnPlayerRequestSpawn"
      );
      return pFn(p);
    });

    cbs.OnPlayerSpawn((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const pFn = promisifyCallback(this, "onSpawn", "OnPlayerSpawn");
      return pFn(p);
    });

    cbs.OnPlayerStateChange(
      (playerid: number, newstate: number, oldstate: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (oldstate === enums.PlayerStateEnum.NONE)
          p.lastUpdateTick = Date.now();
        const pFn = promisifyCallback(
          this,
          "onStateChange",
          "OnPlayerStateChange"
        );
        return pFn(p, newstate, oldstate);
      }
    );

    cbs.OnPlayerStreamIn((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = promisifyCallback(this, "onStreamIn", "OnPlayerStreamIn");
      return pFn(p, fp);
    });

    cbs.OnPlayerStreamOut((playerid: number, forplayerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      const fp = this.findPlayerById(forplayerid);
      if (!fp) return 0;
      const pFn = promisifyCallback(this, "onStreamOut", "OnPlayerStreamOut");
      return pFn(p, fp);
    });

    cbs.OnPlayerTakeDamage(
      (
        playerid: number,
        issuerid: number,
        amount: number,
        weaponid: enums.WeaponEnum,
        bodypart: enums.BodyPartsEnum
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        if (issuerid === enums.InvalidEnum.PLAYER_ID) {
          const pFn = promisifyCallback(
            this,
            "onTakeDamage",
            "OnPlayerTakeDamage"
          );
          return pFn(p, issuerid, amount, weaponid, bodypart);
        }
        const i = this.findPlayerById(issuerid);
        if (!i) return 0;
        const pFn = promisifyCallback(
          this,
          "onTakeDamage",
          "OnPlayerTakeDamage"
        );
        return pFn(p, i, amount, weaponid, bodypart);
      }
    );

    /** 30 calls per second for a single player means a peak of 30,000 calls for 1000 players.
     * If there are 10 player event classes, that means there are 30,0000 calls per second.
     * By throttling down to 16.67 calls per second for a single player, performance should be optimized.
     */
    cbs.OnPlayerUpdate((playerid: number): number => {
      const p = this.findPlayerById(playerid);
      if (!p) return 0;
      if (!p.isNpc()) {
        const now = Date.now();
        if (p.isPaused) {
          p.isPaused = false;
          this.onResume && this.onResume(p, now - p.lastUpdateTick);
        }
        p.lastUpdateTick = now;
        BasePlayerEvent.fpsHeartbeat(p);
      }
      const pFn = promisifyCallback(this, "throttleUpdate", "OnPlayerUpdate");
      const res = pFn(p);
      if (res === undefined) return 0;
      return res;
    });

    cbs.OnPlayerInteriorChange(
      (
        playerid: number,
        newinteriorid: number,
        oldinteriorid: number
      ): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(
          this,
          "onInteriorChange",
          "OnPlayerInteriorChange"
        );
        return pFn(p, newinteriorid, oldinteriorid);
      }
    );

    cbs.OnPlayerRequestDownload(
      (playerid: number, type: number, crc: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(
          this,
          "onRequestDownload",
          "OnPlayerRequestDownload"
        );
        return pFn(p, type, crc);
      }
    );

    cbs.OnPlayerFinishedDownloading(
      (playerid: number, virtualworld: number): number => {
        const p = this.findPlayerById(playerid);
        if (!p) return 0;
        const pFn = promisifyCallback(
          this,
          "onFinishedDownloading",
          "OnPlayerFinishedDownloading"
        );
        return pFn(p, virtualworld);
      }
    );
    playerBus.emit(playerHooks.create, this.players);
    playerBus.on(playerHooks.pause, (player: P) => {
      player.isPaused = true;
      this.onPause && this.onPause(player, player.lastUpdateTick);
    });

    playerBus.on(playerHooks.setLocale, ({ player, value }) => {
      Reflect.set(player, "_locale", value);
    });
    playerBus.on(playerHooks.setCharset, ({ player, value }) => {
      Reflect.set(player, "_charset", value);
    });
    playerBus.on(playerHooks.setIsRecording, ({ player, value }) => {
      Reflect.set(player, "_isRecording", value);
    });
  }
  findPlayerById(playerid: number) {
    return this.players.get(playerid);
  }
  getPlayersArr(): Array<P> {
    return [...this.players.values()];
  }
  getPlayersMap(): Map<number, P> {
    return this.players;
  }
  readonly throttleUpdate = throttle(
    (player: P) => this.onUpdate && this.onUpdate(player),
    60
  );
  private static fpsHeartbeat = throttle((player: BasePlayer) => {
    if (!BasePlayer.isConnected(player)) return;
    const nowDrunkLevel = player.getDrunkLevel();
    if (nowDrunkLevel < 100) {
      player.setDrunkLevel(2000);
      player.lastDrunkLevel = 2000;
      player.lastFps = 0;
      return;
    }
    player.lastFps = player.lastDrunkLevel - nowDrunkLevel - 1;
    player.lastDrunkLevel = nowDrunkLevel;
  }, 1000);
  private promiseCommand = async (
    p: P,
    cmd: RegExpMatchArray
  ): Promise<any> => {
    const fullCommand = cmd.join(" ");
    const firstLevel = cmd[0];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let caller: any = this;
    const result = BasePlayerEvent.recurseCmdBus(caller, firstLevel);

    if (result && result.instance) caller = result.instance;

    let rFnRes =
      caller.onCommandReceived && caller.onCommandReceived(p, fullCommand);
    if (rFnRes instanceof Promise) rFnRes = await rFnRes;
    if (!rFnRes) return NOOP("OnPlayerCommandTextI18n");

    /**
     * Use eventBus to observe and subscribe to level 1 instructions,
     * support string and array pass, array used for alias.
     */

    if (result && (await result.cmdBus.emit(p, result.idx, cmd.slice(1)))) {
      let pFnRes =
        caller.onCommandPerformed && caller.onCommandPerformed(p, fullCommand);
      if (pFnRes instanceof Promise) pFnRes = await pFnRes;
      if (!pFnRes) return NOOP("OnPlayerCommandTextI18n");
      return;
    }

    const pFn = promisifyCallback(
      caller,
      "onCommandError",
      "OnPlayerCommandTextI18n"
    );
    pFn(p, fullCommand, ICmdErrInfo.notExist);
  };
  private static recurseCmdBus = (
    instance: object | null,
    firstLevel: string
  ): null | {
    idx: number;
    cmdBus: CmdBus<BasePlayer>;
    instance: any;
  } => {
    if (instance === null || !Reflect.has(instance, "cmdBus")) return null;
    const cmdBus = Reflect.get(instance, "cmdBus");
    const idx = cmdBus.findEventIdxByName(firstLevel);
    if (idx > -1) return { idx, cmdBus, instance };
    return BasePlayerEvent.recurseCmdBus(
      Reflect.getPrototypeOf(instance),
      firstLevel
    );
  };

  onConnect?(player: P): TCommonCallback;
  onDisconnect?(player: P, reason: number): TCommonCallback;
  onText?(player: P, text: string): TCommonCallback;
  onCommandReceived?(player: P, command: string): TCommonCallback;
  onCommandPerformed?(player: P, command: string): TCommonCallback;
  onCommandError?(player: P, command: string, err: ICmdErr): TCommonCallback;
  onEnterExitModShop?(
    player: P,
    enterexit: number,
    interiorid: number
  ): TCommonCallback;
  onClickMap?(player: P, fX: number, fY: number, fZ: number): TCommonCallback;
  onClickPlayer?(player: P, clickedPlayer: P, source: number): TCommonCallback;
  onDeath?(
    player: P,
    killer: P | enums.InvalidEnum.PLAYER_ID,
    reason: number
  ): TCommonCallback;
  onGiveDamage?(
    player: P,
    damage: P,
    amount: number,
    weaponid: enums.WeaponEnum,
    bodypart: enums.BodyPartsEnum
  ): TCommonCallback;
  onKeyStateChange?(
    player: P,
    newkeys: enums.KeysEnum,
    oldkeys: enums.KeysEnum
  ): TCommonCallback;
  onRequestClass?(player: P, classid: number): TCommonCallback;
  onRequestSpawn?(player: P): TCommonCallback;
  onSpawn?(player: P): TCommonCallback;
  onStateChange?(
    player: P,
    newstate: enums.PlayerStateEnum,
    oldstate: enums.PlayerStateEnum
  ): TCommonCallback;
  onStreamIn?(player: P, forPlayer: P): TCommonCallback;
  onStreamOut?(player: P, forPlayer: P): TCommonCallback;
  onTakeDamage?(
    player: P,
    damage: P | enums.InvalidEnum.PLAYER_ID,
    amount: number,
    weaponid: enums.WeaponEnum,
    bodypart: enums.BodyPartsEnum
  ): TCommonCallback;
  onUpdate?(player: P): TCommonCallback;
  onInteriorChange?(
    player: P,
    newinteriorid: number,
    oldinteriorid: number
  ): TCommonCallback;
  onPause?(player: P, timestamp: number): TCommonCallback;
  onResume?(player: P, pauseMs: number): TCommonCallback;
  onRequestDownload?(player: P, type: number, crc: number): TCommonCallback;
  onFinishedDownloading?(player: P, virtualworld: number): TCommonCallback;
}
