# Token Action HUD — Imperium Maledictum

[![GitHub release](https://img.shields.io/github/v/release/Tiamanti/Token-Action-HUD-Imperium-Maledictum)](https://github.com/Tiamanti/Token-Action-HUD-Imperium-Maledictum/releases/latest)

A [Token Action HUD Core](https://github.com/Larkinabout/fvtt-token-action-hud-core) adapter for the [Imperium Maledictum](https://github.com/moo-man/ImpMal-FoundryVTT) game system on Foundry VTT.

## Features

### Characteristics
Click to open the test dialog for that characteristic. The current total is shown as a badge.

### Skills
All skills and their specialisations listed with current totals as badges. Click to roll.

### Talents & Traits
Talents, traits, boons, and liabilities. Click to send to chat.

### Combat
**Actions** — All available combat actions (Aim, Charge, Defend, etc.). The currently active action is highlighted. Click to select; click again to clear. Right-click to open the Actions rules journal.

**Weapons** — Each weapon shows skill total, damage, and which hand(s) it is held in:
- Left-click: open weapon test dialog
- Right-click: cycle equip state — Unequipped → Right hand → Left hand → Unequipped (two-handed weapons toggle directly between equipped and unequipped)
- Double-click: open character sheet on the Combat tab

**Ammo** — Click to open the character sheet on the Combat tab.

### Psychic Powers
Only shown for actors that have at least one psychic power.

**Warp Charge** — A single button displaying the current warp charge as filled (●) and empty (○) circles. Circles turn green when charge exceeds the threshold (Willpower bonus).
- Click when charge ≤ threshold: Purge roll
- Click when charge > threshold: Psychic Mastery test
- Right-click (any state): Purge roll

**Powers** — Each power shows Warp Rating, adjusted skill total, and damage (with +SL flag where applicable). Overt powers are displayed with a distinct colour. Click to cast; right-click to send the power card to chat.

### Inventory
Protection, force fields, equipment, and augmetics. Click to send to chat.

### Utility
**Combat** — Roll Initiative and End Turn buttons (shown only during active combat).

**Rest & Recover** — Available outside and during combat:
- *6 Hour Rest*: heals Toughness bonus Wounds and posts a chat message
- *Entire Day Rest*: heals 2× Toughness bonus Wounds and posts a chat message

## Limitations

Currently only supports Characters and NPCs. Vehicle support will be added in the future.

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