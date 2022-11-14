let roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        console.log("work")
        let closestDamagedStructure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return;
        }

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	},
	
    /** @param {Creep} creep **/
    hasWork: function(creep) {
        if (creep.room.find(FIND_CONSTRUCTION_SITES).length > 0) {
            return true;
        }
        
        
        // console.log(creep.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // }))
        if (creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        })) {
            return true;
        }
        
        return false;
	},
	
    icon: function() {
        return '🚧';
	}
};

module.exports = roleBuilder;
