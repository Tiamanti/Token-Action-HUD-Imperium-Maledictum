# Token Action HUD — Imperium Maledictum

[![GitHub release](https://img.shields.io/github/v/release/Tiamanti/Token-Action-HUD-Imperium-Maledictum)](https://github.com/Tiamanti/Token-Action-HUD-Imperium-Maledictum/releases/latest)

A [Token Action HUD Core](https://github.com/Drental/fvtt-tokenactionhud) adapter for the [Imperium Maledictum](https://github.com/moo-man/ImpMal-FoundryVTT) game system on Foundry VTT.

Adds a quick-access HUD above tokens with actions grouped into:

- **Combat** — weapons and ammo
- **Skills** — skill specialisations
- **Psychic Powers** — power items
- **Talents & Traits** — talents, traits, boons/liabilities
- **Inventory** — protection, force fields, equipment, augmetics
- **Utility** — initiative and turn management

## Limitations

Currently only supports Characters and NPCs. Vehicle support will be added in the future.

## Requirements

| Dependency | Minimum version |
|---|-----------------|
| Foundry VTT | 13              |
| Token Action HUD Core | 2.1.0           |
| Imperium Maledictum system | —               |

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