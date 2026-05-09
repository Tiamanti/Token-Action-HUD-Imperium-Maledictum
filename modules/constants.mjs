export const constants = {
    moduleId: 'token-action-hud-imperium-maledictum',
    modulePath: 'modules/token-action-hud-imperium-maledictum',
    moduleLabel: 'Token Action HUD Imperium Maledictum',
    requiredCoreModuleVersion: '2.1',
    journals: {
        actions: 'JournalEntry.hdElQAwiBr5AyoRf.JournalEntryPage.xf46pBDy93sT0ZDl'
    }
}

export const tah = {
    actions: {
        characteristic: 'characteristic',
        skill: 'skill',
        weapon: 'weapon',
        ammo: 'ammo',
        protection: 'protection',
        forceField: 'forceField',
        equipment: 'equipment',
        augmetic: 'augmetic',
        modification: 'modification',
        talent: 'talent',
        boonLiability: 'boonLiability',
        trait: 'trait',
        power: 'power',
        specialisation: 'specialisation',
        duty: 'duty',
        utility: 'utility',
        combatAction: 'combatAction'
    },
    // Leaf groups — these are the user-configurable sections shown in HUD settings.
    // Top-level categories are defined inline in defaults.mjs.
    groups: {
        characteristic: { id: 'characteristic', name: 'tokenActionHud.impmal.groups.characteristics', listName: 'tokenActionHud.impmal.groups.characteristics', type: 'system' },
        weapon:        { id: 'weapon',        name: 'tokenActionHud.impmal.items.weapon',        listName: 'tokenActionHud.impmal.items.weapon',        type: 'system' },
        ammo:          { id: 'ammo',          name: 'tokenActionHud.impmal.items.ammo',          listName: 'tokenActionHud.impmal.items.ammo',          type: 'system' },
        specialisation:{ id: 'specialisation',name: 'tokenActionHud.impmal.items.specialisation',listName: 'tokenActionHud.impmal.items.specialisation',type: 'system' },
        power:         { id: 'power',         name: 'tokenActionHud.impmal.items.power',         listName: 'tokenActionHud.impmal.items.power',         type: 'system' },
        talent:        { id: 'talent',        name: 'tokenActionHud.impmal.items.talent',        listName: 'tokenActionHud.impmal.items.talent',        type: 'system' },
        trait:         { id: 'trait',         name: 'tokenActionHud.impmal.items.trait',         listName: 'tokenActionHud.impmal.items.trait',         type: 'system' },
        boonLiability: { id: 'boonLiability', name: 'tokenActionHud.impmal.items.boonLiability', listName: 'tokenActionHud.impmal.items.boonLiability', type: 'system' },
        protection:    { id: 'protection',    name: 'tokenActionHud.impmal.items.protection',    listName: 'tokenActionHud.impmal.items.protection',    type: 'system' },
        forceField:    { id: 'forceField',    name: 'tokenActionHud.impmal.items.forceField',    listName: 'tokenActionHud.impmal.items.forceField',    type: 'system' },
        equipment:     { id: 'equipment',     name: 'tokenActionHud.impmal.items.equipment',     listName: 'tokenActionHud.impmal.items.equipment',     type: 'system' },
        augmetic:      { id: 'augmetic',      name: 'tokenActionHud.impmal.items.augmetic',      listName: 'tokenActionHud.impmal.items.augmetic',      type: 'system' },
        utility:       { id: 'utility',       name: 'tokenActionHud.impmal.groups.utility',       listName: 'tokenActionHud.impmal.groups.utility',       type: 'system' },
        restRecover:   { id: 'restRecover',   name: 'tokenActionHud.impmal.groups.restRecover',   listName: 'tokenActionHud.impmal.groups.restRecover',   type: 'system' },
        combatAction:  { id: 'combatAction',  name: 'tokenActionHud.impmal.groups.combatAction',  listName: 'tokenActionHud.impmal.groups.combatAction',  type: 'system' }
    }
}
