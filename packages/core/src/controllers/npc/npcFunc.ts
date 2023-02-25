import { ERecordStatus, RecordTypesEnum } from "@/enums";
import { logger } from "@/logger";
import {
  ConnectNPC,
  StartRecordingPlayback,
  StopRecordingPlayback,
  PauseRecordingPlayback,
  ResumeRecordingPlayback,
  StartRecordingPlayerData,
  StopRecordingPlayerData,
} from "@/wrapper/native/functions";
import { BasePlayer } from "../player";

export class BaseNpcFunc {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  private static recordStatus: ERecordStatus;
  static readonly connectNPC = ConnectNPC;
  static startRecordingPlayerData<P extends BasePlayer>(
    player: P,
    recordtype: RecordTypesEnum,
    recordname: string
  ): void {
    if (player.isRecording)
      return logger.warn(
        "[BaseNpcFunc]: It should be stopped before recording"
      );
    StartRecordingPlayerData(player.id, recordtype, recordname);
    player.isRecording = true;
  }
  static stopRecordingPlayerData<P extends BasePlayer>(player: P): void {
    if (!player.isRecording)
      return logger.warn("[BaseNpcFunc]: It should be started before stop");
    StopRecordingPlayerData(player.id);
    player.isRecording = false;
  }
  static startRecordingPlayback(
    playbacktype: RecordTypesEnum,
    recordname: string
  ): void {
    if (BaseNpcFunc.recordStatus >= ERecordStatus.start)
      return logger.warn(
        "[BaseNpcFunc]: The current status cannot be replayed"
      );
    StartRecordingPlayback(playbacktype, recordname);
    BaseNpcFunc.recordStatus = ERecordStatus.start;
  }
  static stopRecordingPlayback(): void {
    if (BaseNpcFunc.recordStatus < ERecordStatus.start)
      return logger.warn("[BaseNpcFunc]: The current status cannot be stopped");
    StopRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.none;
  }

  static pauseRecordingPlayback() {
    if (BaseNpcFunc.recordStatus !== ERecordStatus.start)
      return logger.warn("[BaseNpcFunc]: The current status cannot be paused");
    PauseRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.pause;
  }
  static resumeRecordingPlayback() {
    if (BaseNpcFunc.recordStatus !== ERecordStatus.pause)
      return logger.warn("[BaseNpcFunc]: The current status cannot be paused");
    ResumeRecordingPlayback();
    BaseNpcFunc.recordStatus = ERecordStatus.start;
  }
}
