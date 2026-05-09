import { tah } from './constants.mjs'

const { groups: g } = tah

export const DEFAULTS = {
    layout: [
        {
            nestId: 'characteristics',
            id: 'characteristics',
            name: 'tokenActionHud.impmal.groups.characteristics',
            type: 'system',
            groups: [
                { ...g.characteristic, nestId: 'characteristics_characteristic' }
            ]
        },
        {
            nestId: 'skills',
            id: 'skills',
            name: 'tokenActionHud.impmal.groups.skills',
            type: 'system',
            groups: [
                { ...g.specialisation, nestId: 'skills_specialisation' }
            ]
        },
        {
            nestId: 'talents',
            id: 'talents',
            name: 'tokenActionHud.impmal.groups.talents',
            type: 'system',
            groups: [
                { ...g.talent,        nestId: 'talents_talent'        },
                { ...g.trait,         nestId: 'talents_trait'         },
                { ...g.boonLiability, nestId: 'talents_boonLiability' }
            ]
        },
        {
            nestId: 'combat',
            id: 'combat',
            name: 'tokenActionHud.impmal.groups.combat',
            type: 'system',
            groups: [
                { ...g.weapon,       nestId: 'combat_weapon'       },
                { ...g.ammo,         nestId: 'combat_ammo'         },
                { ...g.combatAction, nestId: 'combat_combatAction' }
            ]
        },
        {
            nestId: 'powers',
            id: 'powers',
            name: 'tokenActionHud.impmal.groups.powers',
            type: 'system',
            groups: [
                { ...g.power, nestId: 'powers_power' }
            ]
        },
        {
            nestId: 'inventory',
            id: 'inventory',
            name: 'tokenActionHud.impmal.groups.inventory',
            type: 'system',
            groups: [
                { ...g.protection, nestId: 'inventory_protection' },
                { ...g.forceField, nestId: 'inventory_forceField' },
                { ...g.equipment,  nestId: 'inventory_equipment'  },
                { ...g.augmetic,   nestId: 'inventory_augmetic'   }
            ]
        },
        {
            nestId: 'utility',
            id: 'utility',
            name: 'tokenActionHud.impmal.groups.utility',
            type: 'system',
            groups: [
                { ...g.utility,      nestId: 'utility_utility'      },
                { ...g.restRecover,  nestId: 'utility_restRecover'  }
            ]
        }
    ],
    groups: Object.values(g)
}
