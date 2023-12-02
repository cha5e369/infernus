import { StreamerDistances } from "../definitions/Distances";
import { MapIconStyles } from "./MapIcons";

export const CreateDynamicObjectEx = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  rx: number,
  ry: number,
  rz: number,
  streamDistance: number = StreamerDistances.OBJECT_SD,
  drawDistance: number = StreamerDistances.OBJECT_DD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicObjectEx",
    "iffffffffaaaaiiiii",
    modelId,
    x,
    y,
    z,
    rx,
    ry,
    rz,
    streamDistance,
    drawDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicPickupEx = (
  modelId: number,
  type: number,
  x: number,
  y: number,
  z: number,
  streamDistance: number = StreamerDistances.PICKUP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicPickupEx",
    "iiffffaaaaiiiii",
    modelId,
    type,
    x,
    y,
    z,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicCPEx = (
  x: number,
  y: number,
  z: number,
  size: number,
  streamDistance: number = StreamerDistances.CP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicCPEx",
    "fffffaaaaiiiii",
    x,
    y,
    z,
    size,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicRaceCPEx = (
  type: number,
  x: number,
  y: number,
  z: number,
  nextX: number,
  nextY: number,
  nextZ: number,
  size: number,
  streamDistance: number = StreamerDistances.RACE_CP_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicRaceCPEx",
    "iffffffffaaaaiiiii",
    type,
    x,
    y,
    z,
    nextX,
    nextY,
    nextZ,
    size,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicMapIconEx = (
  x: number,
  y: number,
  z: number,
  type: number,
  color: number,
  style = MapIconStyles.LOCAL,
  streamDistance: number = StreamerDistances.MAP_ICON_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicMapIconEx",
    "fffiiifaaaaiiiii",
    x,
    y,
    z,
    type,
    color,
    style,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamic3DTextLabelEx = (
  text: string,
  color: number,
  x: number,
  y: number,
  z: number,
  drawDistance: number,
  attachedPlayer = 0xffff,
  attachedVehicle = 0xffff,
  testLos = false,
  streamDistance: number = StreamerDistances.TEXT_3D_LABEL_SD,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamic3DTextLabelEx",
    "siffffiiifaaaaiiiii",
    text,
    color,
    x,
    y,
    z,
    drawDistance,
    attachedPlayer,
    attachedVehicle,
    testLos,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};

export const CreateDynamicCircleEx = (
  x: number,
  y: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCircleEx",
    "fffaaaiii",
    x,
    y,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCylinderEx = (
  x: number,
  y: number,
  minZ: number,
  maxZ: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCylinderEx",
    "fffffaaaiii",
    x,
    y,
    minZ,
    maxZ,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicSphereEx = (
  x: number,
  y: number,
  z: number,
  size: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicSphereEx",
    "ffffaaaiii",
    x,
    y,
    z,
    size,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicRectangleEx = (
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicRectangleEx",
    "ffffaaaiii",
    minX,
    minY,
    maxX,
    maxY,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCuboidEx = (
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCuboidEx",
    "ffffffaaaiii",
    minX,
    minY,
    minZ,
    maxX,
    maxY,
    maxZ,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicCubeEx = (
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicCubeEx",
    "ffffffaaaiii",
    minX,
    minY,
    minZ,
    maxX,
    maxY,
    maxZ,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicPolygonEx = (
  points: number[],
  minZ: number = Number.MIN_VALUE,
  maxZ: number = Number.MAX_VALUE,
  worlds: number[] = [-1],
  interiors: number[] = [-1],
  players: number[] = [-1]
): number => {
  return samp.callNative(
    "CreateDynamicPolygonEx",
    "affiaaaiii",
    points,
    minZ,
    maxZ,
    points.length,
    worlds,
    interiors,
    players,
    worlds.length,
    interiors.length,
    players.length
  );
};

export const CreateDynamicActorEx = (
  modelId: number,
  x: number,
  y: number,
  z: number,
  r: number,
  invulnerable = true,
  health = 100.0,
  streamDistance: number = StreamerDistances.ACTOR_SD,
  worlds: number[] = [0],
  interiors: number[] = [-1],
  players: number[] = [-1],
  areas: number[] = [-1],
  priority = 0
): number => {
  return samp.callNative(
    "CreateDynamicActorEx",
    "iffffiffaaaaiiiii",
    modelId,
    x,
    y,
    z,
    r,
    invulnerable,
    health,
    streamDistance,
    worlds,
    interiors,
    players,
    areas,
    priority,
    worlds.length,
    interiors.length,
    players.length,
    areas.length
  );
};
