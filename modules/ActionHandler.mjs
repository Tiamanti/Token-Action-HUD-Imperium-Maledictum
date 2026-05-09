import { tah } from './constants.mjs'

const COMBAT_ITEM_TYPES    = ['weapon', 'ammo']
const INVENTORY_ITEM_TYPES = ['protection', 'forceField', 'equipment', 'augmetic', 'modification']
const TALENT_ITEM_TYPES    = ['talent', 'trait', 'boonLiability']

const LOG = 'TAH-ImpMal |'

export function createActionHandler (coreModule) {
    return class ActionHandlerImpmal extends coreModule.api.ActionHandler {
        async buildSystemActions (groupIds) {
            const { actor } = this
            if (!actor) return

            if (actor.type === 'character' || actor.type === 'npc') {
                await this.#buildCharacteristics(groupIds)
                await this.#buildSkills(groupIds)
                await this.#buildTalents(groupIds)
                await this.#buildCombat(groupIds)
                await this.#buildPowers(groupIds)
                await this.#buildInventory(groupIds)
                await this.#buildRestRecover(groupIds)
            }
            await this.#buildUtility(groupIds)
        }

        async #buildCharacteristics (groupIds) {
            if (!groupIds.includes('characteristic')) return
            const charConfig = game.impmal.config.characteristics
            const actions = Object.entries(this.actor.system.characteristics)
                .sort(([a], [b]) => (game.i18n.localize(charConfig[a]) ?? a).localeCompare(game.i18n.localize(charConfig[b]) ?? b))
                .map(([key, char]) => ({
                    id: `char_${key}`,
                    name: `${game.i18n.localize(charConfig[key])} (${char.total})`,
                    encodedValue: ['characteristic', key].join(this.delimiter),
                    img: ''
                }))
            await this.addActions(actions, tah.groups.characteristic)
        }

        async #buildCombat (groupIds) {
            const items = [...this.actor.items.filter(i => COMBAT_ITEM_TYPES.includes(i.type))]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            for (const item of items) {
                if (!groupIds.includes(item.type)) continue
                const action = item.type === 'weapon'
                    ? this.#weaponToAction(item)
                    : this.#ammoToAction(item)
                await this.addActions([action], tah.groups[item.type])
            }
        }

        #weaponToAction (item) {
            const base = this.#itemToAction(item)
            if (this.actor.type !== 'character') return base

            const holding = this.actor.system.hands.isHolding(item.id)
            const inLeft = !!holding.left
            const inRight = !!holding.right

            let cssClass = ''
            if (inLeft && inRight) cssClass = 'tah-impmal-equipped-both'
            else if (inRight)      cssClass = 'tah-impmal-equipped-right'
            else if (inLeft)       cssClass = 'tah-impmal-equipped-left'

            return { ...base, cssClass }
        }

        #ammoToAction (item) {
            return {
                ...this.#itemToAction(item),
                encodedValue: ['ammo', item.id].join(this.delimiter)
            }
        }

        async #buildSkills (groupIds) {
            if (!groupIds.includes('specialisation')) return
            const actions = []
            const skillConfig = game.impmal.config.skills

            const skillKeys = Object.keys(this.actor.system.skills)
                .sort((a, b) => (skillConfig[a] ?? a).localeCompare(skillConfig[b] ?? b))

            for (const key of skillKeys) {
                const skill = this.actor.system.skills[key]
                const skillName = skillConfig[key] ?? key

                actions.push({
                    id: `skill_${key}`,
                    name: `${skillName} (${skill.total})`,
                    encodedValue: ['skill', key].join(this.delimiter)
                })

                const specs = [...(skill.specialisations ?? [])]
                    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                for (const spec of specs) {
                    actions.push({
                        id: spec.id,
                        name: `${skillName} - ${spec.name} (${spec.system.total})`,
                        encodedValue: ['specialisation', spec.id].join(this.delimiter),
                        img: ''
                    })
                }
            }

            await this.addActions(actions, tah.groups.specialisation)
        }

        async #buildPowers (groupIds) {
            if (!groupIds.includes('power')) return
            const items = [...this.actor.items.filter(i => i.type === 'power')]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            await this.addActions(items.map(i => ({
                ...this.#itemToAction(i),
                cssClass: i.system.overt ? 'tah-impmal-overt' : ''
            })), tah.groups.power)
        }

        async #buildTalents (groupIds) {
            const items = [...this.actor.items.filter(i => TALENT_ITEM_TYPES.includes(i.type))]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            for (const item of items) {
                if (!groupIds.includes(item.type)) continue
                await this.addActions([this.#itemToAction(item)], tah.groups[item.type])
            }
        }

        async #buildInventory (groupIds) {
            const items = [...this.actor.items.filter(i => INVENTORY_ITEM_TYPES.includes(i.type))]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            for (const item of items) {
                if (!groupIds.includes(item.type)) continue
                await this.addActions([this.#itemToAction(item)], tah.groups[item.type])
            }
        }

        async #buildRestRecover (groupIds) {
            if (!groupIds.includes('restRecover')) return
            await this.addActions([
                {
                    id: 'rest6h',
                    name: game.i18n.localize('tokenActionHud.impmal.actions.rest6h'),
                    encodedValue: ['utility', 'rest6h'].join(this.delimiter)
                },
                {
                    id: 'restDay',
                    name: game.i18n.localize('tokenActionHud.impmal.actions.restDay'),
                    encodedValue: ['utility', 'restDay'].join(this.delimiter)
                }
            ], tah.groups.restRecover)
        }

        async #buildUtility (groupIds) {
            if (!groupIds.includes('utility')) return
            const actions = []
            if (game.combat) {
                actions.push({
                    id: 'initiative',
                    name: game.i18n.localize('tokenActionHud.impmal.actions.rollInitiative'),
                    encodedValue: ['utility', 'initiative'].join(this.delimiter)
                })
                if (game.combat?.combatant?.actor?.id === this.actor.id) {
                    actions.push({
                        id: 'endTurn',
                        name: game.i18n.localize('tokenActionHud.impmal.actions.endTurn'),
                        encodedValue: ['utility', 'endTurn'].join(this.delimiter)
                    })
                }
            }
            await this.addActions(actions, tah.groups.utility)
        }

        #itemToAction (item) {
            return {
                id: item.id,
                name: item.name,
                img: coreModule.api.Utils.getImage(item),
                encodedValue: [item.type, item.id].join(this.delimiter),
                tooltip: item.system.description?.value ?? ''
            }
        }
    }
}
