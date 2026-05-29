import { tah } from './constants.mjs'

const COMBAT_ITEM_TYPES    = ['weapon', 'ammo']
const INVENTORY_ITEM_TYPES = ['protection', 'forceField', 'equipment', 'augmetic', 'modification']
const TALENT_ITEM_TYPES    = ['talent', 'trait', 'boonLiability']

export function createActionHandler (coreModule) {
    return class ActionHandlerImpmal extends coreModule.api.ActionHandler {
        async buildSystemActions (groupIds) {
            const { actor } = this

            if (actor?.type === 'character' || actor?.type === 'npc') {
                await this.#buildCharacteristics(groupIds)
                await this.#buildSkills(groupIds)
                await this.#buildTalents(groupIds)
                await this.#buildCombatActions(groupIds)
                await this.#buildCombat(groupIds)
                if (actor.items.some(i => i.type === 'power')) {
                    await this.#buildWarpCharge(groupIds)
                    await this.#buildPowers(groupIds)
                }
                await this.#buildInventory(groupIds)
                await this.#buildRestRecover(groupIds)
                await this.#buildConditions(groupIds)
            }
            await this.#buildUtility(groupIds)
        }

        async #buildCharacteristics (groupIds) {
            if (!groupIds.includes('characteristic')) return
            const actor = this.actor
            const charConfig = game.impmal.config.characteristics
            const actions = Object.entries(actor.system.characteristics)
                .sort(([a], [b]) => (game.i18n.localize(charConfig[a]) ?? a).localeCompare(game.i18n.localize(charConfig[b]) ?? b))
                .map(([key, char]) => ({
                    id: `char_${key}`,
                    name: game.i18n.localize(charConfig[key]),
                    info1: { text: String(char.total) },
                    img: '',
                    onClick: async () => actor.setupCharacteristicTest(key)
                }))
            await this.addActions(actions, tah.groups.characteristic)
        }

        async #buildCombatActions (groupIds) {
            if (!groupIds.includes('combatAction')) return
            const actor = this.actor
            const currentAction = actor.system.combat?.action ?? ''
            const actions = Object.entries(game.impmal.config.actions).map(([key, data]) => ({
                id: `combatAction_${key}`,
                name: game.i18n.localize(data.label),
                active: currentAction === key,
                cssClass: currentAction === key ? 'tah-impmal-active' : '',
                hasContextMenu: true,
                system: { actionType: 'combatAction' },
                onClick: async () => {
                    if (actor.system.combat.action === key) await actor.clearAction()
                    else await actor.useAction(key)
                }
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
            const actor = this.actor
            const base = this.#itemBase(item)

            const info1 = item.system.skillTotal != null ? { text: String(item.system.skillTotal) } : undefined
            const info2 = this.#weaponInfo2(item)

            if (actor.type !== 'character') {
                return {
                    ...base,
                    info1,
                    info2,
                    hasContextMenu: true,
                    system: { actionType: 'weapon', isCharacter: false, isEquipped: item.system.isEquipped },
                    onClick: async () => actor.setupWeaponTest(item.id)
                }
            }

            const holding     = actor.system.hands.isHolding(item.id)
            const inLeft      = !!holding.left
            const inRight     = !!holding.right
            const isTwoHanded = !!item.system.traits.has('twohanded')

            let info3
            if (inLeft && inRight && isTwoHanded) {
                info3 = { icon: '<i class="fa-solid fa-hand fa-flip-horizontal"></i><i class="fa-solid fa-hand"></i>' }
            } else if (inRight) {
                info3 = { icon: '<i class="fa-solid fa-hand"></i>' }
            } else if (inLeft) {
                info3 = { icon: '<i class="fa-solid fa-hand fa-flip-horizontal"></i>' }
            }

            return {
                ...base,
                info1,
                info2,
                info3,
                hasContextMenu: true,
                system: { actionType: 'weapon', isCharacter: true, inLeft, inRight, isTwoHanded },
                onClick: async () => actor.setupWeaponTest(item.id)
            }
        }

        #ammoToAction (item) {
            const actor = this.actor
            const usingWeapon = actor.items.find(w => w.type === 'weapon' && w.system.ammo?.id === item.id)
            return {
                ...this.#itemBase(item),
                info1: usingWeapon ? { text: usingWeapon.name } : undefined,
                hasContextMenu: true,
                system: { actionType: 'ammo' },
                onClick: async () => this.#openSheetOnCombatTab(actor)
            }
        }

        async #buildSkills (groupIds) {
            if (!groupIds.includes('specialisation')) return
            const actor = this.actor
            const actions = []
            const skillConfig = game.impmal.config.skills

            const skillKeys = Object.keys(actor.system.skills)
                .sort((a, b) => (skillConfig[a] ?? a).localeCompare(skillConfig[b] ?? b))

            for (const key of skillKeys) {
                const skill = actor.system.skills[key]
                const skillName = skillConfig[key] ?? key

                actions.push({
                    id: `skill_${key}`,
                    name: skillName,
                    info1: { text: String(skill.total) },
                    onClick: async () => actor.setupSkillTest({ key })
                })

                const specs = [...(skill.specialisations ?? [])]
                    .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                for (const spec of specs) {
                    actions.push({
                        id: spec.id,
                        name: `${skillName} – ${spec.name}`,
                        info1: { text: String(spec.system.total) },
                        img: '',
                        onClick: async () => actor.setupSkillTest({ itemId: spec.id })
                    })
                }
            }

            await this.addActions(actions, tah.groups.specialisation)
        }

        async #buildWarpCharge (groupIds) {
            if (!groupIds.includes('warpCharge')) return
            const actor = this.actor
            const warp      = actor.system.warp
            const charge    = warp.charge    ?? 0
            const threshold = warp.threshold ?? 0
            const isOver    = charge > threshold

            let label
            if (isOver) {
                label = `<span style="color:var(--impmal-lightgreen)">${'●'.repeat(charge)}</span>`
            } else {
                label = '●'.repeat(charge) + '○'.repeat(threshold - charge)
            }

            await this.addActions([{
                id: 'warpCharge',
                name: label || '○',
                useRawHtmlName: true,
                info1: { text: String(charge) },
                info2: { text: String(threshold) },
                hasContextMenu: true,
                system: { actionType: 'warpCharge' },
                onClick: async () => {
                    if (isOver) await actor.setupSkillTest({ key: 'psychic' }, { warp: actor.system.warp.state })
                    else await actor.purge()
                }
            }], tah.groups.warpCharge)
        }

        async #buildPowers (groupIds) {
            if (!groupIds.includes('power')) return
            const items = [...this.actor.items.filter(i => i.type === 'power')]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            await this.addActions(items.map(i => this.#powerToAction(i)), tah.groups.power)
        }

        #powerToAction (item) {
            const actor = this.actor
            const sys = item.system

            const info1 = sys.rating != null ? { text: `WR ${sys.rating}` } : undefined

            const skill = sys.skill
            const skillTotal = skill instanceof Item
                ? skill.system.total
                : actor.system.skills[skill]?.total ?? 0
            const diffMod = game.impmal.config.difficulties?.[sys.difficulty]?.modifier ?? 0
            const adjusted = skillTotal + diffMod
            const info2 = adjusted ? { text: String(adjusted) } : undefined

            let info3
            if (sys.damage?.value > 0) {
                const dmgText = sys.damage.SL ? `${sys.damage.value}+SL` : String(sys.damage.value)
                info3 = { text: dmgText }
            }

            return {
                ...this.#itemBase(item),
                cssClass: sys.overt ? 'tah-impmal-overt' : '',
                info1,
                info2,
                info3,
                onClick: async () => actor.setupPowerTest(item.id)
            }
        }

        async #buildTalents (groupIds) {
            const actor = this.actor
            const items = [...actor.items.filter(i => TALENT_ITEM_TYPES.includes(i.type))]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            for (const item of items) {
                if (!groupIds.includes(item.type)) continue
                await this.addActions([this.#itemDisplayAction(item)], tah.groups[item.type])
            }
        }

        async #buildInventory (groupIds) {
            const actor = this.actor
            const items = [...actor.items.filter(i => INVENTORY_ITEM_TYPES.includes(i.type))]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
            for (const item of items) {
                if (!groupIds.includes(item.type)) continue
                await this.addActions([this.#itemDisplayAction(item)], tah.groups[item.type])
            }
        }

        async #buildRestRecover (groupIds) {
            if (!groupIds.includes('restRecover')) return
            const actor = this.actor
            await this.addActions([
                {
                    id: 'rest6h',
                    name: game.i18n.localize('tokenActionHud.impmal.actions.rest6h'),
                    onClick: async () => this.#rest(actor, 1)
                },
                {
                    id: 'restDay',
                    name: game.i18n.localize('tokenActionHud.impmal.actions.restDay'),
                    onClick: async () => this.#rest(actor, 2)
                }
            ], tah.groups.restRecover)
        }

        async #buildUtility (groupIds) {
            if (!groupIds.includes('utility')) return
            const actor = this.actor
            const actions = []
            if (game.combat) {
                if (canvas.tokens.controlled.length === 1) {
                    actions.push({
                        id: 'initiative',
                        name: game.i18n.localize('tokenActionHud.impmal.actions.rollInitiative'),
                        onClick: async () => actor.rollInitiative({ createCombatants: true })
                    })
                }
                if (canvas.tokens.controlled.length > 1) {
                    actions.push({
                        id: 'initiativeAll',
                        name: game.i18n.localize('tokenActionHud.impmal.actions.rollInitiativeAll'),
                        onClick: async () => {
                            for (const token of canvas.tokens.controlled) {
                                if (token.actor) await token.actor.rollInitiative({ createCombatants: true })
                            }
                        }
                    })
                }
                if (actor && game.combat?.combatant?.actor?.id === actor.id) {
                    actions.push({
                        id: 'endTurn',
                        name: game.i18n.localize('tokenActionHud.impmal.actions.endTurn'),
                        onClick: async () => {
                            if (game.combat?.combatant?.actor?.id === actor.id) await game.combat.nextTurn()
                        }
                    })
                }
            }
            await this.addActions(actions, tah.groups.utility)
        }

        async #buildConditions (groupIds) {
            if (!groupIds.includes('condition')) return
            const actor = this.actor
            const tieredConfig = game.impmal.config.tieredCondition
            const actions = CONFIG.statusEffects.map(c => {
                const existing = actor.hasCondition(c.id)
                const isTiered = !!tieredConfig[c.id]
                let info1
                if (existing?.isMajor) info1 = { text: game.i18n.localize('tokenActionHud.impmal.conditions.major') }
                else if (existing?.isMinor) info1 = { text: game.i18n.localize('tokenActionHud.impmal.conditions.minor') }
                return {
                    id: `condition_${c.id}`,
                    name: c.name,
                    img: c.img ?? c.icon,
                    active: !!existing,
                    cssClass: existing?.isMajor ? 'tah-impmal-active' : '',
                    info1,
                    onClick: async () => {
                        const curr = actor.hasCondition(c.id)
                        const tiered = !!tieredConfig[c.id]
                        if (!curr) {
                            await actor.addCondition(c.id, 'minor')
                        } else if (tiered && curr.isMinor) {
                            await actor.addCondition(c.id, 'major')
                        } else {
                            await actor.removeCondition(c.id)
                            if (tiered && curr.isMajor) await actor.removeCondition(c.id)
                        }
                    }
                }
            })
            await this.addActions(actions, tah.groups.condition)
        }

        // --- Helpers ---

        #weaponInfo2 (item) {
            const dmg = item.system.damage?.value
            const dmgStr = dmg != null ? String(dmg) : ''
            const mag = item.system.mag
            if (item.system.selfAmmo) {
                const qty = item.system.quantity ?? 0
                return { text: dmgStr ? `${dmgStr} ×${qty}` : `×${qty}` }
            }
            if ((mag?.value ?? 0) > 0) {
                return { text: dmgStr ? `${dmgStr} ${mag.current}/${mag.value}` : `${mag.current}/${mag.value}` }
            }
            return dmg != null ? { text: dmgStr } : undefined
        }

        #itemBase (item) {
            return {
                id: item.id,
                name: item.name,
                img: coreModule.api.Utils.getImage(item),
                tooltip: item.system.description?.value ?? ''
            }
        }

        #itemDisplayAction (item) {
            return {
                ...this.#itemBase(item),
                hasContextMenu: true,
                system: { actionType: 'item' },
                onClick: async () => {
                    if (item.sendToChat) await item.sendToChat()
                    else item.sheet.render(true)
                }
            }
        }

        async #openSheetOnCombatTab (actor) {
            const sheet = actor.sheet
            await sheet.render({ force: true })
            sheet.changeTab?.('combat', 'primary')
        }

        async #rest (actor, multiplier) {
            const tghBonus = actor.system.characteristics.tgh.bonus
            const toHeal   = tghBonus * multiplier
            const current  = actor.system.combat.wounds.value
            const newValue = Math.max(0, current - toHeal)
            const healed   = current - newValue

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
