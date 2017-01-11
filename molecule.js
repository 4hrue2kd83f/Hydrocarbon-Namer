function getChain(a1, a2) {
    //return the shortest chain between two atoms
    
    //BUILD ALL CHAINS from a1 to all atoms
    var frontier = [a1],
        explored = [a1],
        chains = [[a1]]; //chains keeps track of all chains being explored
    
    //starting with a1
    //for each atom
        //traverse all bonded atoms
    //the number of loops is limited to number of atoms in molecule
    while(frontier.length > 0) {
        //Remove the next atom from the frontier
        var a = frontier.splice(0,1)[0];
        //get all bonded Atoms to the frontier atom
        var bondedAtoms = getBondedAtoms(a);
        //for all bondedAtoms,  and frontier
        for (var i = 0; i < bondedAtoms.length; i++) {
            //skip all explored atoms
            var ba = bondedAtoms[i]; //bondedAtom
            if (indexOfAtom(explored, ba) == -1) {
                //add to explored
                explored.push(ba);
                //add to frontier
                frontier.push(ba);
                //create chain branches
                addChainBranch(chains, a, ba)
            }
        }
    }
    
    //Find the shortest chain beginning in a1 and ending in a2
    var minDist = Number.POSITIVE_INFINITY;
    var shortestChain = null;
    //for each chain
    for (var i = 0; i < chains.length; i++) {
        var c = chains[i];
        //if chain begins with a1 and ends with a2
        if (c[0]['i']==a1['i'] && c[c.length-1]['i']==a2['i']) {
            //if the chain is the shortest
            if (c.length < minDist)  {
                minDist = c.length;
                shortestChain = c;
            }
        }
    }
    return shortestChain;
}

function addChainBranch(chains, a, ba) {
    //add ba, and add to chains
    for (var i = 0; i < chains.length; i++) {
        var c = chains[i]; //chain
        //find the chain that ends in a
        if (c[c.length - 1]['i'] == a['i']) {
            //duplicate it
            var nc = c.slice(0); //new chain
            //add ba
            nc.push(ba);
            //add to chain
            chains.push(nc);
        }
    }
}

function indexOfAtom (array, a) {
    //checks if an array contains 
    for (var i = 0; i < array.length; i++) {
        if (array[i]['i'] == a['i'])
            return i
    }
    return -1;
}

function getBondedAtoms(a) {
    //return an array of all bonded atoms
    var bondedAtoms = [];
    for (var i = 0; i< bonds.length; i++) {
        var b = bonds[i];
        if (b['m1']['i'] == a['i'])
            bondedAtoms.push(b['m2'])
        if (b['m2']['i'] == a['i'])
            bondedAtoms.push(b['m1'])
    }
    return bondedAtoms
}

function buildPrimaryChain() {
    //builds primary atom and bond chains
    var chains = [];
    var maxLength = 0;
    var maxAlcohol = 0;
    var maxCarboxyl = 0;
    primaryAtomChain = null;
    //for each end
    for (var i=0; i < ends.length; i++) {
        //get Chains to all other ends
        for (var j=0; j < ends.length; j++) {
            //dont search for chains to themselves
            if (i != j) {
                var c = getChain(ends[i],ends[j])
                var nAlcohol = numAlcohols(c);
                var nCarboxyl = numCarboxylicAcidGroups(c);
                if (nCarboxyl > maxCarboxyl) {
                    maxCarboxyl = nCarboxyl;
                    maxAlcohol = nAlcohol
                    maxLength = c.length;
                    primaryAtomChain = c;   
                } else if (nCarboxyl == maxCarboxyl){
                    if (nAlcohol > maxAlcohol) {
                        maxAlcohol = nAlcohol
                        maxLength = c.length;
                        primaryAtomChain = c;
                    } else if (nAlcohol == maxAlcohol) {
                        if (c.length > maxLength){
                            maxLength = c.length;
                            primaryAtomChain = c;
                        }   
                    }
                }
                
            }
        }
    }
    
    //build primary bond chain
    primaryBondChain = [];
    if (primaryAtomChain != null && primaryAtomChain.length > 1) {
        for (var i = 0; i < primaryAtomChain.length - 1; i++) {
            var a1 = primaryAtomChain[i];
            var a2 = primaryAtomChain[i+1];
            primaryBondChain.push(findBond(a1,a2))
        }
    }
}

function numAlcohols(array) {
    //returns the number of alcohols bonded to atoms in an array
    var num = 0;
    for (var i =0; i < array.length; i++ ){
        var a= array[i];
        num += numAlcoholGroups(a)
        /*var bondedAtoms = getBondedAtoms(a)
        for (var j = 0; j < bondedAtoms.length; j++) {
            if (numAlcoholGroups(bondedAtoms[j]) > 0)
                num++
        }
        */
    }
    return num;
}

function findBond(a1,a2) {
    for (var i =0; i < bonds.length; i++) {
        var b = bonds[i];
        if ((b['m1']['i'] == a1['i'] && b['m2']['i'] == a2['i']) ||
           (b['m2']['i'] == a1['i'] && b['m1']['i'] == a2['i']))
            return b
    }
}