// Example FilterScript for the Dillimore Gas Station Objects
// ----------------------------------------------------------
// By Matite in March 2015
//
//
// This script creates the edited Dillimore Gas Station Building objects and
// removes the existing GTASA building objects.
//
// Warning...
// This script uses a total of:
// * 2 objects = 1 for the replacement building exterior object and 1 for the
//   the replacement building interior object
// * Enables the /dgs command to teleport the player to the Dillimore Gas Station

import type { IFilterScript } from "@infernus/core";
import { DynamicObject, GameText, Player, PlayerEvent } from "@infernus/core";

// Stores the created object numbers of the replacement building objects so
// they can be destroyed when the filterScript is unloaded
let DillimoreGasObject1: DynamicObject | null = null; // Building exterior object
let DillimoreGasObject2: DynamicObject | null = null; // Building interior object

function removeBuilding(p: Player) {
  if (p.isNpc()) return;
  // Remove default GTASA Dillimore Gas Station Building exterior, interior
  // and LOD map objects for the player
  p.removeBuilding(12853, 666.711, -565.133, 17.3359, 250.0); // Building exterior
  p.removeBuilding(12854, 666.492, -571.18, 17.3125, 250.0); // Building interior
  p.removeBuilding(13245, 666.711, -565.133, 17.3359, 250.0); // LOD
}

export const DillimoreGasStation: IFilterScript = {
  name: "dillimore_gas",
  load() {
    // Display information in the Server Console
    console.log("\n");
    console.log("  |---------------------------------------------------");
    console.log("  |--- Dillimore Gas Station FilterScript");
    console.log("  |--  Script v1.01");
    console.log("  |--  3rd March 2015");
    console.log("  |---------------------------------------------------");

    // Create the Dillimore Gas Station exterior object
    DillimoreGasObject1 = new DynamicObject({
      modelId: 19876,
      x: 666.711,
      y: -565.133,
      z: 17.3359,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    DillimoreGasObject1.create();

    // Display information in the Server Console
    console.log("  |--  Dillimore Gas Station exterior object created");

    // Create the Dillimore Gas Station interior object
    DillimoreGasObject2 = new DynamicObject({
      modelId: 19877,
      x: 666.492,
      y: -571.18,
      z: 17.3125,
      rx: 0,
      ry: 0,
      rz: 0,
    });
    DillimoreGasObject2.create();

    // Display information in the Server Console
    console.log("  |--  Dillimore Gas Station interior object created");
    console.log("  |---------------------------------------------------");

    // Loop
    Player.getInstances().forEach((player) => {
      removeBuilding(player);
    });

    const onConnect = PlayerEvent.onConnect(({ player, next }) => {
      removeBuilding(player);
      return next();
    });

    const dgs = PlayerEvent.onCommandText("dgs", ({ player, next }) => {
      // Set the interior
      player.setInterior(0);

      // Set player position and facing angle
      player.setPos(658.37, -573.9, 16.8);
      player.setFacingAngle(280);

      // Fix camera position after teleporting
      player.setCameraBehind();

      // Send a gametext message to the player
      new GameText("~b~~h~Dillimore Gas Station!", 3000, 3).forPlayer(player);
      return next();
    });

    return [onConnect, dgs];
  },
  unload() {
    // Check for valid object
    if (DillimoreGasObject1 && DillimoreGasObject1.isValid()) {
      // Destroy the Dillimore Gas Station exterior object
      DillimoreGasObject1.destroy();
      DillimoreGasObject1 = null;

      // Display information in the Server Console
      console.log("  |---------------------------------------------------");
      console.log("  |--  Dillimore Gas Station exterior object destroyed");
    }

    // Check for valid object
    if (DillimoreGasObject2 && DillimoreGasObject2.isValid()) {
      // Destroy the Dillimore Gas Station interior object
      DillimoreGasObject2.destroy();
      DillimoreGasObject2 = null;

      // Display information in the Server Console
      console.log("  |--  Dillimore Gas Station interior object destroyed");
    }

    // Display information in the Server Console
    console.log("  |---------------------------------------------------");
    console.log("  |--  Dillimore Gas Station FilterScript Unloaded");
    console.log("  |---------------------------------------------------");
  },
};
