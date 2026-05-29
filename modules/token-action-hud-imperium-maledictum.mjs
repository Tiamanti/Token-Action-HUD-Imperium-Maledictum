import { constants } from './constants.mjs'
import { createActionHandler } from './ActionHandler.mjs'
import { createRollHandler } from './RollHandler.mjs'
import { createSystemManager } from './SystemManager.mjs'

Hooks.once('init', () => {
    Hooks.callAll(`${constants.moduleId}:afterInit`)
})

Hooks.once('setup', () => {
    Hooks.callAll(`${constants.moduleId}:afterSetup`)
})

Hooks.once('ready', () => {
    Hooks.callAll(`${constants.moduleId}:afterReady`)
})

// coreModule is passed by TAH core when its API is ready.
// Classes that extend core base classes must be created here, not at module load time.
Hooks.on('tokenActionHudCoreApiReady', async (coreModule) => {
    const ActionHandlerImpmal = createActionHandler(coreModule)
    const RollHandlerImpmal = createRollHandler(coreModule)
    const SystemManagerImpmal = createSystemManager(coreModule, ActionHandlerImpmal, RollHandlerImpmal)

    const module = game.modules.get(constants.moduleId)
    module.api = {
        requiredCoreModuleVersion: constants.requiredCoreModuleVersion,
        SystemManager: SystemManagerImpmal
    }
    Hooks.call('tokenActionHudSystemReady', module)

    Hooks.on('tokenActionHudCoreActionContextMenu', (items, hudManager) => {
        const getAction = target => hudManager.actionHandler.availableActions?.get(target.dataset.actionId)

        // hands.unequip() in ImpMal has a bug: it wraps DocumentReferenceModel.unset() (which already
        // returns a full-path key like {"system.hands.right": {...}}) in another {"system.hands": ...}
        // layer, producing a nonsense doubly-nested key that Foundry ignores. Build the update directly
        // using the same flat dot-notation format that hands.equip() uses.
        const unequipFromHands = async (actor, item) => {
            const hands = actor.system.hands
            const path  = hands.schema.fieldPath
            const update = {}
            if (hands.left.id  === item.id) update[`${path}.left.id`]  = ''
            if (hands.right.id === item.id) update[`${path}.right.id`] = ''
            if (Object.keys(update).length) {
                item.system.onEquipToggle(false)
                await actor.update(update)
            }
        }

        // For the equip/unequip visible checks, re-read the live item rather than relying on
        // cached action.system values — TAH Core may not preserve non-primitive system fields.
        const getLiveWeapon = target => {
            const a = getAction(target)
            if (a?.system?.actionType !== 'weapon' || !a.system.isCharacter) return null
            return hudManager.actor.items.get(target.dataset.actionId) ?? null
        }

        // Weapon — equip right hand (character, single-handed, not already in right)
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.equipRight'),
            icon: "<i class='fa-solid fa-hand'></i>",
            visible: target => {
                const item = getLiveWeapon(target)
                if (!item) return false
                return !item.system.traits.has('twohanded') && hudManager.actor.system.hands.right.id !== item.id
            },
            onClick: async (event, target) => {
                const actor = hudManager.actor
                const item = actor.items.get(target.dataset.actionId)
                if (!item) return
                await unequipFromHands(actor, item)
                await item.system.equip('right')
            }
        })

        // Weapon — equip left hand (character, single-handed, not already in left)
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.equipLeft'),
            icon: "<i class='fa-solid fa-hand fa-flip-horizontal'></i>",
            visible: target => {
                const item = getLiveWeapon(target)
                if (!item) return false
                return !item.system.traits.has('twohanded') && hudManager.actor.system.hands.left.id !== item.id
            },
            onClick: async (event, target) => {
                const actor = hudManager.actor
                const item = actor.items.get(target.dataset.actionId)
                if (!item) return
                await unequipFromHands(actor, item)
                await item.system.equip('left')
            }
        })

        // Weapon — equip both hands (character, two-handed, not already equipped)
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.equipBothHands'),
            icon: "<span><i class='fa-solid fa-hand fa-flip-horizontal'></i><i class='fa-solid fa-hand'></i></span>",
            visible: target => {
                const item = getLiveWeapon(target)
                if (!item) return false
                return !!item.system.traits.has('twohanded') && hudManager.actor.system.hands.right.id !== item.id
            },
            onClick: async (event, target) => {
                const actor = hudManager.actor
                const item = actor.items.get(target.dataset.actionId)
                if (!item) return
                await item.system.equip('right')
            }
        })

        // Weapon — unequip (character: when held in any hand; NPC: when equipped)
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.unequip'),
            icon: "<i class='fa-solid fa-xmark'></i>",
            visible: target => {
                const a = getAction(target)
                if (a?.system?.actionType !== 'weapon') return false
                if (a.system.isCharacter) {
                    const hands = hudManager.actor.system.hands
                    const id = target.dataset.actionId
                    return hands.left.id === id || hands.right.id === id
                }
                return hudManager.actor.items.get(target.dataset.actionId)?.system.isEquipped ?? false
            },
            onClick: async (event, target) => {
                const actor = hudManager.actor
                const item = actor.items.get(target.dataset.actionId)
                if (!item) return
                if (actor.type === 'character') {
                    await unequipFromHands(actor, item)
                } else {
                    await item.system.unequip()
                }
            }
        })

        // Weapon — equip (NPC only, when not equipped)
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.equip'),
            icon: "<i class='fa-solid fa-shield'></i>",
            visible: target => {
                const a = getAction(target)
                return a?.system?.actionType === 'weapon' && !a.system.isCharacter && !a.system.isEquipped
            },
            onClick: async (event, target) => {
                const item = hudManager.actor.items.get(target.dataset.actionId)
                await item?.system.equip()
            }
        })

        // Weapon + item — open item sheet
        // Ammo — load into compatible weapon (one item pushed per weapon, dynamic per hook call)
        for (const weapon of hudManager.actor.items.filter(w => w.type === 'weapon')) {
            const weaponId = weapon.id
            items.push({
                label: weapon.name,
                icon: "<i class='fa-solid fa-gun'></i>",
                visible: target => {
                    if (getAction(target)?.system?.actionType !== 'ammo') return false
                    const w = hudManager.actor.items.get(weaponId)
                    if (!w || w.system.selfAmmo) return false
                    const ammoId = target.dataset.actionId
                    return w.system.ammoList.some(a => a.id === ammoId)
                },
                onClick: async (event, target) => {
                    const w = hudManager.actor.items.get(weaponId)
                    if (w) await w.update({ 'system.ammo.id': target.dataset.actionId })
                }
            })
        }

        // Weapon + ammo + item — open item sheet
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.openSheet'),
            icon: "<i class='fa-solid fa-scroll'></i>",
            visible: target => {
                const type = getAction(target)?.system?.actionType
                return type === 'weapon' || type === 'ammo' || type === 'item' || type === 'vehicleWeapon'
            },
            onClick: (event, target) => {
                hudManager.actor.items.get(target.dataset.actionId)?.sheet.render(true)
            }
        })

        // Combat action — open actions journal
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.openJournal'),
            icon: "<i class='fa-solid fa-book-open'></i>",
            visible: target => getAction(target)?.system?.actionType === 'combatAction',
            onClick: async () => {
                const page = await fromUuid(constants.journals.actions)
                if (page) page.parent.sheet.render(true, { pageId: page.id })
            }
        })

        // Warp charge — purge
        items.push({
            label: game.i18n.localize('tokenActionHud.impmal.context.purge'),
            icon: "<i class='fa-solid fa-fire'></i>",
            visible: target => getAction(target)?.system?.actionType === 'warpCharge',
            onClick: async () => hudManager.actor.purge()
        })
    })
})
