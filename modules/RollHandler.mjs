import { tah } from './constants.mjs'

export function createRollHandler (coreModule) {
    return class RollHandlerImpmal extends coreModule.api.RollHandler {
        async handleActionClick (event, encodedValue) {
            const [actionType, actionId] = encodedValue.split(this.delimiter)

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
            case tah.actions.weapon:
                await this.#handleWeapon(actionId)
                break
            case tah.actions.power:
                await this.#handlePower(actionId)
                break
            case tah.actions.specialisation:
                await this.#handleSpecialisation(actionId)
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
            }
        }
    }
}
