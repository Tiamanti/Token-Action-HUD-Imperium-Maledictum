import { tah } from './constants.mjs'

export function createRollHandler (coreModule) {
    return class RollHandlerImpmal extends coreModule.api.RollHandler {
        async handleActionClick (event, encodedValue) {
            const [actionType, actionId] = encodedValue.split(this.delimiter)

            if (actionType === tah.actions.weapon) {
                if (event.detail >= 2) return this.#openSheetOnCombatTab()
                if (this.isRenderItem()) return this.#handleWeaponEquip(actionId)
                await this.#handleWeapon(actionId)
                return
            }

            if (this.isRenderItem()) {
                return this.renderItem(this.actor, actionId)
            }

            switch (actionType) {
            case tah.actions.characteristic:
                await this.#handleCharacteristic(actionId)
                break
            case tah.actions.skill:
                await this.#handleSkill(actionId)
                break
            case tah.actions.power:
                await this.#handlePower(actionId)
                break
            case tah.actions.specialisation:
                await this.#handleSpecialisation(actionId)
                break
            case tah.actions.ammo:
                await this.#openSheetOnCombatTab()
                break
            case tah.actions.talent:
            case tah.actions.trait:
            case tah.actions.boonLiability:
                await this.#handleItemDisplay(actionId)
                break
            case tah.actions.utility:
                await this.#handleUtility(actionId)
                break
            default:
                await this.#handleItemDisplay(actionId)
            }
        }

        async #handleCharacteristic (charKey) {
            await this.actor.setupCharacteristicTest(charKey)
        }

        async #handleSkill (skillKey) {
            await this.actor.setupSkillTest({ key: skillKey })
        }

        async #handleWeapon (itemId) {
            await this.actor.setupWeaponTest(itemId)
        }

        async #handleWeaponEquip (itemId) {
            const item = this.actor.items.get(itemId)
            if (!item) return

            if (this.actor.type !== 'character') {
                if (item.system.isEquipped) await item.system.unequip()
                else await item.system.equip()
                return
            }

            const holding     = this.actor.system.hands.isHolding(item.id)
            const inLeft      = !!holding.left
            const inRight     = !!holding.right
            const isTwoHanded = item.system.traits.has('twohanded')

            if (!inLeft && !inRight) {
                // Unequipped → equip (sets both hands for two-handed weapons)
                await item.system.equip('right')
            } else if (isTwoHanded) {
                // Two-handed equipped → unequip
                await item.system.unequip()
            } else if (inRight) {
                // Right hand → left hand
                await item.system.unequip()
                await item.system.equip('left')
            } else {
                // Left hand → unequip
                await item.system.unequip()
            }
        }

        async #openSheetOnCombatTab () {
            const sheet = this.actor.sheet
            await sheet.render({ force: true })
            sheet.changeTab?.('combat', 'primary')
        }

        async #handlePower (itemId) {
            await this.actor.setupPowerTest(itemId)
        }

        async #handleSpecialisation (itemId) {
            await this.actor.setupSkillTest({ itemId: itemId })
        }

        async #handleItemDisplay (itemId) {
            const item = this.actor.items.get(itemId)
            if (!item) return
            if (item.sendToChat) await item.sendToChat()
            else item.sheet.render(true)
        }

        async #handleUtility (actionId) {
            switch (actionId) {
            case 'initiative':
                await this.actor.rollInitiative({ createCombatants: true })
                break
            case 'endTurn':
                if (game.combat?.combatant?.actor?.id === this.actor.id) {
                    await game.combat.nextTurn()
                }
                break
            case 'rest6h':
                await this.#handleRest(1)
                break
            case 'restDay':
                await this.#handleRest(2)
                break
            }
        }

        async #handleRest (multiplier) {
            const actor = this.actor
            const tghBonus = actor.system.characteristics.tgh.bonus
            const toHeal = tghBonus * multiplier
            const current = actor.system.combat.wounds.value
            const newValue = Math.max(0, current - toHeal)
            const healed = current - newValue

            await actor.update({ 'system.combat.wounds.value': newValue })

            const msgKey = multiplier === 1
                ? 'tokenActionHud.impmal.actions.rest6hMessage'
                : 'tokenActionHud.impmal.actions.restDayMessage'

            await ChatMessage.create({
                content: game.i18n.format(msgKey, { wounds: healed }),
                speaker: ChatMessage.getSpeaker({ actor })
            })
        }
    }
}
