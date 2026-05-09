# Token Action HUD — Imperium Maledictum

A [Token Action HUD Core](https://github.com/Drental/fvtt-tokenactionhud) adapter for the [Imperium Maledictum](https://github.com/moo-man/ImpMal-FoundryVTT) game system on Foundry VTT.

Adds a quick-access HUD above tokens with actions grouped into:

- **Combat** — weapons and ammo
- **Skills** — skill specialisations
- **Psychic Powers** — power items
- **Talents & Traits** — talents, traits, boons/liabilities
- **Inventory** — protection, force fields, equipment, augmetics
- **Utility** — initiative and turn management

## Requirements

| Dependency | Minimum version |
|---|---|
| Foundry VTT | 13 |
| Token Action HUD Core | 2.0.0 |
| Imperium Maledictum system | — |

## Installation

Install via the Foundry VTT module manager using the manifest URL from the GitHub releases page, or copy the module folder into your `Data/modules/` directory.

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

Pull requests are welcome. This module is released under the [MIT License](LICENSE) and is free for anyone to use, modify, or maintain.
