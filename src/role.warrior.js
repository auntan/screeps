let role = {

    /** @param {Creep} creep **/
    run: function(creep, attack) {
        // console.log("war")
        if(!attack) {
            var spawns = creep.room.find(FIND_MY_SPAWNS);
            creep.moveTo(spawns[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            return;
        }
        
        let targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if(creep.attack(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
	},
	
    /** @param {Creep} creep **/
    hasWork: function(creep) {
        return true;
	},
	
    icon: function() {
        return '⚔️️';
	}
};

module.exports = role;
