import { ICmd } from "@/interfaces";
import { TEventFunc, TEventName } from "@/types";
import { BasePlayer } from "../player/basePlayer";

// This is an event bus for distributing instructions entered by the user.
// You can bind a single instruction as a string, or you can bind multiple alias instructions as an array string
export class CmdBus<T extends BasePlayer> {
  private eventList: Array<ICmd> = [];
  // eslint-disable-next-line @typescript-eslint/no-empty-function

  public on(eventName: TEventName, eventFunction: TEventFunc) {
    const idx: number = this.findEventIdxByName(eventName);
    if (idx > -1)
      return console.log(
        "[CommandBus]: It is not supported to listen for the same event more than once"
      );
    this.eventList.push({ name: eventName, fn: eventFunction });
  }

  public off(eventName: TEventName) {
    const idx: number = this.findEventIdxByName(eventName);
    if (idx === -1) return;
    this.eventList.splice(idx, 1);
  }

  public async emit(
    player: T,
    userEventName: TEventName,
    userEventArgs: Array<string>
  ): Promise<number> {
    const idx: number = this.findEventIdxByName(userEventName);
    if (idx > -1) {
      let result = this.eventList[idx].fn.apply(player, userEventArgs);
      if (result instanceof Promise) result = await result;
      if (result === undefined || result === null) return 0;
      if (typeof result === "boolean") return Number(result);
      return result;
    }
    return -1;
  }

  public findEventIdxByName(eventName: TEventName): number {
    return this.eventList.findIndex((v) => {
      const { name: registered } = v;
      if (registered instanceof Array) {
        if (eventName instanceof Array) {
          return registered.some((e) => eventName.includes(e));
        }
        return registered.includes(eventName);
      }
      if (typeof registered === "string" && eventName instanceof Array) {
        return eventName.includes(registered);
      }
      return registered === eventName;
    });
  }
}
