

var gameConfig = {

    path: {
        exploreRate: .55,
        exploreCost: 5,
        discoverRate: .20,
        discoverCost: 10
    }
}


var shipConfig = {

    fighter: {
        shipSizes: {
            small: {
                cost: 400,
                technology: 0,
                role: 'fighter',
                size: 'small',
                unlocked: true,
                infrastructureLevel: 0
            },
            medium: {
                cost: 14000,
                technology: 3,
                role: 'fighter',
                size: 'medium',
                unlocked: false,
                infrastructureLevel: 5
            },
            large: {
                cost: 28000,
                technology: 5,
                role: 'fighter',
                size: 'large',
                unlocked: false,
                infrastructureLevel: 10
            },
            capital: {
                cost: 120000,
                technology: 8,
                role: 'fighter',
                size: 'capital',
                unlocked: false,
                infrastructureLevel: 15
            }
        }
    },

    missile: {
        shipSizes: {
            small: {
                cost: 12000,
                technology: 1,
                role: 'missile',
                size: 'small',
                unlocked: false,
                infrastructureLevel: 0
            },
            medium: {
                cost: 20000,
                technology: 4,
                role: 'missile',
                size: 'medium',
                unlocked: false,
                infrastructureLevel: 5
            },
            large: {
                cost: 40000,
                technology: 7,
                role: 'missile',
                size: 'large',
                unlocked: false,
                infrastructureLevel: 10
            },
            capital: {
                cost: 200000,
                technology: 10,
                role: 'missile',
                size: 'capital',
                unlocked: false,
                infrastructureLevel: 15
            }
        }
    },

    support: {
        shipSizes: {
            small: {
                cost: 6000,
                technology: 2,
                role: 'support',
                size: 'small',
                unlocked: false,
                infrastructureLevel: 0
            },
            medium: {
                cost: 12000,
                technology: 4,
                role: 'support',
                size: 'medium',
                unlocked: false,
                infrastructureLevel: 5
            },
            large: {
                cost: 30000,
                technology: 6,
                role: 'support',
                size: 'large',
                unlocked: false,
                infrastructureLevel: 10
            },
            capital: {
                cost: 90000,
                technology: 9,
                role: 'support',
                size: 'capital',
                unlocked: false,
                infrastructureLevel: 15
            }
        }
    }
}


var infrastructureConfig = {

    thresholdStart: 1000,
    levelIncrement: 1.05, // each threshold doubles
    baseBonus: .05,       // 5% base bonus every level
    bonusIncrement: .5   // 50% increase to the base bonus for every level
}


/*
    This configures every level of tech. When a new tech is researched this object is searched by the name of the tech (Example: 'speed'),
    which has an array with an array for every level. The level array can have one or more 'bonuses' for a user which gets handled based 
    on it's type.

    Types
    STAT PERCENT BOOST : Updates the 'percentageBonuses' object in the players stats handler for bonuses
    UNLOCK ABILITY : Unlocks an ability that the user will now have access too


*/


var technologyConfig = {

    engines: [
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "speedBonus",
                value: "5",
                source: "Speed Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    science: [
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "sciencePointResearchBonus",
                value: "5",
                source: "Science Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    exploration: [
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "discoverRateBonus",
                value: "200",
                source: "Exploration Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "discoverCostBonus",
                value: "10",
                source: "Speed Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 2",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 2",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 3",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 3",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 4",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 4",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 5",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 5",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "discoverRateBonus",
                value: "100",
                source: "Exploration Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "discoverCostBonus",
                value: "40",
                source: "Speed Tech Level 1",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 6",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 6",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 7",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 7",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 8",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 8",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 9",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 9",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "explorationRateBonus",
                value: "10",
                source: "Exploration Tech Level 10",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "explorationCostBonus",
                value: "10",
                source: "Speed Tech Level 10",
                type: "STAT PERCENT BOOST"
            },
            {
                name: "sensorBonus",
                value: "15",
                source: "Speed Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    culture: [
        [
            {
                name: "populationGrowthRateBonus",
                value: "25",
                source: "Population Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "25",
                source: "Population Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "50",
                source: "Population Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "10",
                source: "Population Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "populationGrowthRateBonus",
                value: "100",
                source: "Population Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    defenses: [
        [
            {
                name: "planitaryDefenseBonus",
                value: "25",
                source: "Defense Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defense Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defense Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defense Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "25",
                source: "Defensive Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defensive Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "50",
                source: "Defensive Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defensive Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "10",
                source: "Defensive Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "planitaryDefenseBonus",
                value: "100",
                source: "Defensive Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    military: [
        [
            {
                name: "offensiveWeaponBonus",
                value: "25",
                source: "Military Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "25",
                source: "Military Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "50",
                source: "Military Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "10",
                source: "Military Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "offensiveWeaponBonus",
                value: "100",
                source: "Military Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ],
    economy: [
        [
            {
                name: "economicGrowthRateBonus",
                value: "25",
                source: "Economy Tech Level 1",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 2",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 3",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 4",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "25",
                source: "Economy Tech Level 5",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 6",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "50",
                source: "Economy Tech Level 7",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 8",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "10",
                source: "Economy Tech Level 9",
                type: "STAT PERCENT BOOST"
            }
        ],
        [
            {
                name: "economicGrowthRateBonus",
                value: "100",
                source: "Economy Tech Level 10",
                type: "STAT PERCENT BOOST"
            }
        ]
    ]

}

var technologyBonusesConfig = [
    {
        name: "Espionage - Major Paths",
        description: "Our understanding of space and the quality of our pilots allow us access to the explored paths of our enemies.",
        active: false,
        requirements: [

                {
                    technology: "military",
                    level: 3
                },
                {
                    technology: "exploration",
                    level: 1
                }

        ]
    }
]