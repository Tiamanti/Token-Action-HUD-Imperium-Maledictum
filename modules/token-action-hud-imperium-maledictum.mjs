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
})
