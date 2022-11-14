let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleWarrior = require('role.warrior');

let roles = {
    'harvester': require('role.harvester'),
    'upgrader': require('role.upgrader'),
    'builder': require('role.builder'),
    'warrior': require('role.warrior'),
}

///////////
//asdasd

let rolesPlan = {
    'harvester': 3,
    'builder': 0,
    'upgrader': 2,
    'warrior': 0,
};

let totalPlan = 5;

let attack = false;
///////////



module.exports.loop = function () {
    
    labelCreeps();
    buildCreeps();
    assignRoles();
    

    Game.get

    let tower = Game.getObjectById('4f45ef9ce58a519984b3b3d8');
    if(tower) {
        let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }


    const backupRole = roleUpgrader

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        let role = roles[creep.memory.role];
        if(role == null) {
            continue;
        }
        
        if(role.hasWork(creep)) {
            role.run(creep);
        } else {
            // console.log('backup role: ' + creep.name);
            backupRole.run(creep);
        }
    }
    
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        if(creep.memory.role == 'warrior') {
            roleWarrior.run(creep, attack);
        }
        
        
    }
    
    
    // cleanup
    
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

let buildCreeps = function() {
    let cnt = Object.keys(Game.creeps).length;
    
    if(cnt > totalPlan) {
        let c = findFiredCreep();
        if(c == null) {
            console.log("error: no fired creeps to suicide")
            return;
        }
        console.log('creep suicide: role: ' + c.memory.role + ' name: ', c.name);
        c.suicide();
        delete Memory.creeps[c.name];
        return;
    }
    
    if(cnt < totalPlan) {
        let newName = 'creep' + Game.time;
        let res = Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {}});
        if(res == OK) {
            console.log('Spawning new creep: ' + newName);
        }
    }
    
    if(Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
}

let assignRoles = function() {
    Game.map.visual.text(JSON.stringify(rolesMap()), Game.spawns['Spawn1'].pos,
        {color: '#FF0000', fontSize: 10});

    
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(rolesPlan[creep.memory.role] == undefined) {
            console.log('remove unused role: ' + creep.memory.role + ' name: ', creep.name);
            creep.memory.role = undefined;
        }
    }

    for(let role in rolesPlan) {
        let current = 0;
        for(let name in Game.creeps) {
            if(Game.creeps[name].memory.role == role) {
                current++;
            }
        }
        
        if(current > rolesPlan[role]) {
            let creep;
            for(let name in Game.creeps) {
                let c = Game.creeps[name];
                if(c.memory.role == role) {
                    creep = c;
                    break;
                }
            }
            
            console.log('creep fired: role: ' + creep.memory.role + ' name: ', creep.name);
            creep.memory.role = undefined;
        }
    }
    
    for(let role in rolesPlan) {
        let current = 0;
        for(let name in Game.creeps) {
            if(Game.creeps[name].memory.role == role) {
                current++;
            }
        }
        
        if(current < rolesPlan[role]) {
            let creep;
            for(let name in Game.creeps) {
                let c = Game.creeps[name];
                if(c.memory.role == undefined) {
                    creep = c;
                    break;
                }
            }
            
            if (creep == undefined) {
                console.log('error: not enough creeps free for plan!');
                return;
            } 
            
            console.log('creep assigned: role: ' + role + ' name:', creep.name);
            creep.memory.role = role
        }
    }
}


let labelCreeps = function() {
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        creep.say(roles[creep.memory.role].icon());
    }
}


let rolesMap = function() {
    let r = {};
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if (r[creep.memory.role] == undefined) {
            r[creep.memory.role] = 0;
        }
        r[creep.memory.role]++;
    }
    return r;
}

let findFiredCreep = function() {
    for(let name in Game.creeps) {
        let c = Game.creeps[name];
        if(c.memory.role == undefined) {
            return c;
        }
    }
}
