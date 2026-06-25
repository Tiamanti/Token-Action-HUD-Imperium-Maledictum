# Token Action HUD — Imperium Maledictum

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/Tiamanti/Token-Action-HUD-Imperium-Maledictum?style=for-the-badge)
![Foundry Min Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FTiamanti%2FToken-Action-HUD-Imperium-Maledictum%2Fmaster%2Fmodule.json&label=Foundry%20Min%20Version&query=$.compatibility.minimum&colorB=orange&style=for-the-badge)
![Foundry Verified](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2FTiamanti%2FToken-Action-HUD-Imperium-Maledictum%2Fmaster%2Fmodule.json&label=Foundry%20Verified&query=$.compatibility.verified&colorB=orange&style=for-the-badge)
![License](https://img.shields.io/github/license/Tiamanti/Token-Action-HUD-Imperium-Maledictum?style=for-the-badge)
![GitHub Releases](https://img.shields.io/github/downloads/Tiamanti/Token-Action-HUD-Imperium-Maledictum/latest/module.zip?style=for-the-badge)
![GitHub All Releases](https://img.shields.io/github/downloads/Tiamanti/Token-Action-HUD-Imperium-Maledictum/module.zip?style=for-the-badge&label=Downloads+total)

A [Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core) adapter for the [Imperium Maledictum](https://github.com/moo-man/ImpMal-FoundryVTT) game system on Foundry VTT.

![Token Action HUD Imperium Maledictum](https://raw.githubusercontent.com/Tiamanti/Token-Action-HUD-Imperium-Maledictum/master/.github/assets/IMPMAL.gif)

## Features

### Characteristics
Click to open the test dialog for that characteristic. The current total is shown as a badge.

### Skills
All skills and their specialisations listed with current totals as badges. Click to roll.

### Talents & Traits
Talents, traits, boons, and liabilities. Click to send to chat. Right-click → **Open Sheet** to open the item sheet.

### Combat
**Actions** — All available combat actions (Aim, Charge, Defend, etc.). The currently active action is highlighted. Click to select; click again to clear. Right-click → **Open Journal** to open the Actions rules journal.

**Weapons** — Each weapon shows skill total and damage as badges. Ranged weapons also show magazine state in the damage badge (e.g. `5 3/15`). Which hand(s) the weapon is held in is shown as a third badge (characters only). Click to open the weapon test dialog. Right-click for a context menu:
- **Equip (Right Hand)** / **Equip (Left Hand)** — equip to the chosen hand (single-handed weapons only)
- **Equip (Both Hands)** — equip a two-handed weapon
- **Unequip** — remove from hand(s)
- **Open Sheet** — open the item sheet

For NPCs (no hand tracking), the context menu shows **Equip** / **Unequip** instead.

**Ammo** — Shows the name of the weapon currently loaded with this ammo as a badge. Click to open the character sheet on the Combat tab. Right-click for a context menu listing each compatible weapon — click a weapon to load this ammo into it. Also **Open Sheet**.

### Psychic Powers
Only shown for actors that have at least one psychic power.

**Warp Charge** — A single button displaying the current warp charge as filled (●) and empty (○) circles. Circles turn green when charge exceeds the threshold (Willpower bonus).
- Click when charge ≤ threshold: Purge roll
- Click when charge > threshold: Psychic Mastery test
- Right-click → **Purge** to force a Purge roll regardless of charge level

**Powers** — Each power shows Warp Rating, adjusted skill total, and damage (with +SL flag where applicable). Overt powers are displayed with a distinct colour. Click to cast. Right-click → **Open Sheet**.

### Inventory
Protection, force fields, equipment, and augmetics. Click to send to chat. Right-click → **Open Sheet**.

### Conditions
All ImpMal conditions listed with icon and name (matches the character sheet Effects tab). Click to cycle states:
- Inactive → Minor (for tiered conditions) or active (for non-tiered)
- Minor → Major (tiered conditions only)
- Major / active → removed

Active conditions show a **Min** / **Maj** severity badge.

### Utility
**Combat** — Roll Initiative and End Turn buttons (shown only during active combat).

**Rest & Recover** — Available outside and during combat:
- *6 Hour Rest*: heals Toughness bonus Wounds and posts a chat message
- *Entire Day Rest*: heals 2× Toughness bonus Wounds and posts a chat message

### Vehicles

**Actions** — Vehicle actions available to this vehicle's category (wheeled, tracked, flyer, walker). Click to execute; the system prompts for a crew member where a test is required.

**Weapons** — All weapons assigned to the vehicle, with damage and magazine badge. Click to open a weapon test dialog (prompts for crew member). A warning is shown if the vehicle has no crew or passengers assigned.

**Traits** — Vehicle traits with description tooltip. Click to open the item sheet. Right-click → **Open Sheet**.

**Utility** — Roll Initiative and End Turn, same as for characters and NPCs.

## Requirements

| Dependency | Minimum version |
|---|-----------------|
| Foundry VTT | 13 |
| Token Action HUD Core | 2.1.0 |
| Imperium Maledictum system | — |

## Installation

**Via Foundry VTT module manager (recommended):**

Search for "Token Action HUD Imperium Maledictum" in the Add-on Modules browser, or paste the manifest URL directly:

```
https://github.com/Tiamanti/Token-Action-HUD-Imperium-Maledictum/releases/latest/download/module.json
```

**Manual install:**

Download `module.zip` from the [latest release](https://github.com/Tiamanti/Token-Action-HUD-Imperium-Maledictum/releases/latest) and extract it into your `Data/modules/` directory.

## Development

### First-time setup

```bash
# From the monorepo root or this package directory
npm install

# Copy the example path file and set your local Foundry path
cp foundry-path.example.js foundry-path.js
# Edit foundry-path.js to point to your local FoundryVTT/Data/modules/token-action-hud-imperium-maledictum directory
```

### Watch mode (outputs to local Foundry on every save)

```bash
npm run build
```

### Production release

```bash
npm run release
```

The rollup config reads `module.json` for the module ID and copies `module.json`, `languages/`, and `styles/` alongside the bundled JS to the path returned by `foundry-path.js`.

## Contributing

Pull requests are welcome.

## License

This module is released under the [MIT License](LICENSE) and is free for anyone to use, modify, or maintain.
This work is licensed under Foundry Virtual Tabletop [EULA - Limited License for Package Development from March 2, 2023](https://foundryvtt.com/article/license/).