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
                await this.#buildCombatActions(groupIds)
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
                    name: game.i18n.localize(charConfig[key]),
                    encodedValue: ['characteristic', key].join(this.delimiter),
                    info1: { text: String(char.total) },
                    img: ''
                }))
            await this.addActions(actions, tah.groups.characteristic)
        }

        async #buildCombatActions (groupIds) {
            if (!groupIds.includes('combatAction')) return
            const currentAction = this.actor.system.combat?.action ?? ''
            const actions = Object.entries(game.impmal.config.actions).map(([key, data]) => ({
                id: `combatAction_${key}`,
                name: game.i18n.localize(data.label),
                encodedValue: ['combatAction', key].join(this.delimiter),
                active: currentAction === key,
                cssClass: currentAction === key ? 'tah-impmal-active' : ''
            }))
            await this.addActions(actions, tah.groups.combatAction)
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

            const info1 = item.system.skillTotal != null ? { text: String(item.system.skillTotal) } : undefined
            const info2 = item.system.damage?.value  != null ? { text: String(item.system.damage.value) }  : undefined

            if (this.actor.type !== 'character') return { ...base, info1, info2 }

            const holding     = this.actor.system.hands.isHolding(item.id)
            const inLeft      = !!holding.left
            const inRight     = !!holding.right
            const isTwoHanded = item.system.traits.has('twohanded')

            let info3
            if (inLeft && inRight && isTwoHanded) {
                info3 = { icon: '<i class="fa-solid fa-hand fa-flip-horizontal"></i><i class="fa-solid fa-hand"></i>' }
            } else if (inRight) {
                info3 = { icon: '<i class="fa-solid fa-hand"></i>' }
            } else if (inLeft) {
                info3 = { icon: '<i class="fa-solid fa-hand fa-flip-horizontal"></i>' }
            }

            return { ...base, info1, info2, info3 }
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
                    name: skillName,
                    encodedValue: ['skill', key].join(this.delimiter),
                    info1: { text: String(skill.total) }
                })

                const specs = [...(skill.specialisations ?? [])]
                    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                for (const spec of specs) {
                    actions.push({
                        id: spec.id,
                        name: `${skillName} – ${spec.name}`,
                        encodedValue: ['specialisation', spec.id].join(this.delimiter),
                        info1: { text: String(spec.system.total) },
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
            await this.addActions(items.map(i => this.#powerToAction(i)), tah.groups.power)
        }

        #powerToAction (item) {
            const sys = item.system

            const info1 = sys.rating != null
                ? { text: `WR ${sys.rating}` }
                : undefined

            const skill = sys.skill
            const skillTotal = skill instanceof Item
                ? skill.system.total
                : this.actor.system.skills[skill]?.total ?? 0
            const diffMod = game.impmal.config.difficulties?.[sys.difficulty]?.modifier ?? 0
            const adjusted = skillTotal + diffMod
            const info2 = adjusted ? { text: String(adjusted) } : undefined

            let info3
            if (sys.damage?.value > 0) {
                const dmgText = sys.damage.SL
                    ? `${sys.damage.value}+SL`
                    : String(sys.damage.value)
                info3 = { text: dmgText }
            }

            return {
                ...this.#itemToAction(item),
                cssClass: sys.overt ? 'tah-impmal-overt' : '',
                info1,
                info2,
                info3
            }
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
