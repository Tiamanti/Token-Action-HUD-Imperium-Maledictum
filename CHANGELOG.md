# Changelog

All notable changes to Token Action HUD Imperium Maledictum are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
