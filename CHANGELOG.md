# Changelog

All notable changes to Token Action HUD Imperium Maledictum are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

---

## [1.3.0] — 2026-06-26

### Added
- **Familiar actor support** — tokens using the `impmal-inquisition.familiar` actor type (from the Inquisition Guide module) now show a full NPC-equivalent HUD: Characteristics, Skills, Talents & Traits, Combat Actions, Weapons, Psychic Powers, Inventory, Conditions, Rest & Recover, and Utility.
- **Multi-token selection** — selecting more than one token shows a reduced HUD with:
  - **Characteristics** — click to roll that characteristic for every selected actor.
  - **Skills** — click to roll that skill for every selected actor.
  - **Conditions** — click to cycle the condition for every selected actor.
  - **Utility** — *Roll Initiative (All)* to roll initiative for all selected actors at once.
- **Description tooltips** — hovering over talents, traits, boons/liabilities, and psychic powers now shows the item's description (with Foundry inline links rendered as bold text).
- **Condition tooltips** — hovering over any condition now shows a brief tooltip describing its mechanical effects and how Minor and Major tiers differ.

---

## [1.2.0] — 2026-05-29

### Added
- **Vehicle actor support** — selecting a vehicle token now shows a HUD with three sections:
  - **Actions** — vehicle actions from `game.impmal.config.vehicleActions`, filtered by vehicle category (wheeled/tracked/flyer/walker). Click to execute (prompts for crew member where applicable).
  - **Weapons** — all weapons assigned to the vehicle, with damage and magazine badge. Click to open a weapon test (prompts for crew member). Shows a warning notification if no crew or passengers are assigned.
  - **Traits** — vehicle traits with description tooltip. Click to open the item sheet. Right-click → **Open Sheet**.
  - **Utility** — Roll Initiative and End Turn (same as characters and NPCs).

### Fixed
- **Condition cycle** — clicking a major tiered condition now correctly removes it instead of cycling back to minor. The `isMajor` check was being evaluated after `removeCondition` had already mutated the effect document to minor state.

---

## [1.1.0] — 2026-05-29

### Added
- **Context menus** — right-clicking actions now shows a labelled context menu (TAH Core 2.1 `tokenActionHudCoreActionContextMenu`):
  - **Weapons (character)**: Equip (Right Hand), Equip (Left Hand) / Equip (Both Hands) for two-handed weapons, Unequip, Open Sheet.
  - **Weapons (NPC)**: Equip, Unequip, Open Sheet.
  - **Ammo**: one entry per compatible weapon in the actor — clicking loads the ammo into that weapon. Also Open Sheet.
  - **Talents, Traits, Boons/Liabilities, Powers, Inventory**: Open Sheet.
  - **Combat Actions**: Open Journal (links to the ImpMal Actions journal entry).
  - **Warp Charge**: Purge.
- **Ammo badge on weapon** (`info2`) — ranged weapons now show damage and magazine state together (e.g. `5 3/15`). Grenade/explosive weapons show damage and quantity (e.g. `5 ×3`). Melee weapons unchanged.
- **Loaded weapon badge on ammo** (`info1`) — ammo buttons show the name of the weapon currently using them.

### Changed
- All actions use TAH Core 2.0's `action.onClick` pattern; `encodedValue` and `RollHandler` logic removed.
- `requiredCoreModuleVersion` set to `'2'` (major-version-only, supported since core 2.1).
- Minimum `token-action-hud-core` dependency in `module.json` updated to `2.1.0`.

---

## [1.0.4]

### Added
- **Conditions section** — all ImpMal conditions listed with icon and name, matching the character sheet Effects tab. Clicking cycles states: inactive → minor → major (tiered) → inactive. A `Min` / `Maj` severity badge is shown on active tiered conditions.

---

## [1.0.3] — 2025-01-06

### Added
- **Roll Initiative (All)** — when multiple tokens are selected, a "Roll Initiative (All)" action appears in the Utility section to roll initiative for every controlled token at once.

---

## [1.0.2] — 2024-12-21

### Changed
- CI auto-tag workflow now uses a PAT so that the created tag triggers the release workflow correctly.

---

## [1.0.1] — 2024-12-21

### Added
- **Warp Charge section** — shows current charge vs. threshold as filled/empty pips. Clicking purges warp when over threshold, or initiates a Psychic skill test otherwise.
- **Info badges** — characteristics show their total value; skills show their total; weapons show skill total and damage; powers show Warp Rating, adjusted skill total, and damage.
- **Combat Action section** — lists all combat actions with the active one highlighted; clicking toggles the action on the actor. Alt-click opens the Actions journal entry.
- **Rest & Recover section** — 6 Hour Rest and Entire Day Rest actions that heal wounds based on Toughness Bonus and post a chat message.
- **Weapon equip cycling** — Alt-click a weapon to cycle it through right hand → left hand → unequipped (two-handed weapons toggle equipped/unequipped in one step).
- **Ammo navigation** — clicking an ammo entry opens the actor sheet on the Combat tab.

### Fixed
- Hand icons for held weapons now render correctly using `info3.icon`.
- Two-handed weapons correctly equip to both hands simultaneously.

---

## [1.0.0] — 2024-12-10

### Added
- Initial release.
- **Characteristics section** — all eight characteristics with their totals; clicking opens a characteristic test dialog.
- **Skills section** — all skills with totals, each expanded with any trained specialisations; clicking opens the relevant skill/specialisation test dialog.
- **Talents & Traits section** — talents, traits, and boons/liabilities; clicking sends the item to chat.
- **Combat section** — weapons (with skill total, damage, and held-hand indicators) and ammo grouped separately; clicking a weapon opens a weapon test dialog.
- **Psychic Powers section** — all powers with Warp Rating and adjusted roll total; clicking opens a power test dialog.
- **Inventory section** — protection, force fields, equipment, and augmetics.
- **Utility section** — Roll Initiative and End Turn actions (context-sensitive: only appear when a combat is active and/or it is the actor's turn).
