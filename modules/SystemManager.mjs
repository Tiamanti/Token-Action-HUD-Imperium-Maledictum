import { DEFAULTS } from './defaults.mjs'
import { registerSettings } from './settings.mjs'

export function createSystemManager (coreModule, ActionHandlerImpmal, RollHandlerImpmal) {
    return class SystemManagerImpmal extends coreModule.api.SystemManager {
        getActionHandler () {
            return new ActionHandlerImpmal()
        }

        getAvailableRollHandlers () {
            return { core: 'Core Imperium Maledictum' }
        }

        getRollHandler (_rollHandlerId) {
            return new RollHandlerImpmal()
        }

        registerSettings (coreUpdate) {
            registerSettings(coreUpdate)
        }

        async registerDefaults () {
            const loc = key => game.i18n.localize(key)
            const localizeGroup = g => ({ ...g, name: loc(g.name), listName: loc(g.listName ?? g.name) })
            return {
                layout: DEFAULTS.layout.map(cat => ({
                    ...cat,
                    name: loc(cat.name),
                    groups: (cat.groups ?? []).map(localizeGroup)
                })),
                groups: DEFAULTS.groups.map(localizeGroup)
            }
        }
    }
}
