function isBondValid(b) {
    var i1 = b['m1']['i'];
    var i2 = b['m2']['i'];
    var m1 = molecules[i1];
    var numBondsPerMol = getNumBonds(m1);
    if (numBondsPerMol > 3)
        return false;   
    var m2 = molecules[i2];
    var numBondsPerMol1 = getNumBonds(m2);
    if (numBondsPerMol1 > 3)
        return false;
        
    return true;
}
function getNumBonds(m) {
    var bondCounter = 0;
 for (var i=0;i<bonds.length;i++) {
    if (bonds[i]['m1']['i'] == m['i']) {
        bondCounter = bondCounter + bonds[i]['type'];
        }
    if (bonds[i]['m2']['i'] == m['i']) {
        bondCounter = bondCounter + bonds[i]['type'];
        }
 }
    return bondCounter;
}

function updateHighlighted() {
    highlighted = null;
    for (var i = 0; i < molecules.length; i++) {
        var o = molecules[i];
        var d = dist(o['cx'], o['cy'], mouseX, mouseY);
        if (d < objectRad/2) {
            highlighted = o;
            return true;
        }
    }

    return false;
}
function buildName () {
name = '';
    
if (primaryBondChain.length+1 != 0) {
    if (primaryAtomChain != null && numAlcohols(primaryAtomChain) > 0) {
        var alcoholIndices = getAlcoholIndices(primaryAtomChain);
        alcoholIndices.sort();
        console.log(alcoholIndices);
        for (var i = 0; i < alcoholIndices.length; i++) {
            name += alcoholIndices[i] + ', '   
        }
    }
    name += prefixName[primaryBondChain.length+1];
    if (alcohols.length != 0) {
           name += numPrefix[alcohols.length] + alcoholSuffix;
    }
    else
        name += suffixName[maxNumBond];
    if (primaryAtomChain != null && primaryAtomChain.length > 1) {
        if (numCarboxylicAcidGroups(primaryAtomChain) > 0)
            name += carboxylicSuffix[numCarboxylicAcidGroups(primaryAtomChain)]
        }
}
}
function getAlcoholIndices (array) {
    var alcoholIndices = [];
    console.log(isAlcoholClosestToBeginning(array));
    if (isAlcoholClosestToBeginning(array)) {
        array.reverse();
    }
    for (var i =0; i<alcoholRoots.length; i++) {
        if (indexOfAtom(array, alcoholRoots[i]) >= 0) {
                alcoholIndices.push(indexOfAtom(array, alcoholRoots[i]));
                for (var j =0; j < numAlcoholGroups(array[indexOfAtom(array, alcoholRoots[i])])-1; j++) {
                       alcoholIndices.push(indexOfAtom(array, alcoholRoots[i]));
                }
            }
    }
    return alcoholIndices;
}
function isAlcoholClosestToBeginning (array) {
       //testing only alcohol groups
    var index1 = null,
        indexLast = null;
    for (var i = 0; i<array.length; i++) {
           if (numAlcoholGroups(array[i]) > 0) {
                   if (index1 == null) {
                       index1 = i;
                   }
                    indexLast = i;
           }
    }
    return index1 > (array.length - indexLast - 1);
}
function numCarboxylicAcidGroups(array) {
    var carboxylCounter = 0;   
    
    if (isCarboxylicAcidGroup(array[0])) {
           carboxylCounter++;
       }
    if (array.length > 1 && isCarboxylicAcidGroup(array[array.length-1])) {
        carboxylCounter++;   
    }
    return carboxylCounter;
}
function updateSelected() {  
    if (mouseIsPressed) {
        if (selected != null && 
            objectClicked() != null && 
            objectClicked()['i'] == selected['i']) {
            selected['cx'] = mouseX;
            selected['cy'] = mouseY;
        }
        
    }
}

function selectPresets(selection) {
    
    if (selection == 1)
        drawMethane(0,0);
    if (selection == 2)
        drawEthane(0,0);
    if (selection == 3)
        drawPropane(0,0);
    if (selection == 4)
        drawButane(0,0);
    if (selection == 5)
        drawPentane(0,0);
    if (selection == 6)
        drawHexane(0,0);
    if (selection == 7)
        drawHeptane(0,0);
    
}
function setAtomType (index) {
 
    var atomOptions = document.getElementById('atomTypes').options;
    selectedAtomType = atomOptions[index].value;
    
}
function bondClicked() {
    var p = {x: mouseX, y: mouseY};  
  for (i=0; i<bonds.length; i++) {
      var b = bonds [i];
      var m1 = molecules [b['m1']['i']]
      var m2 = molecules [b['m2']['i']]
      var v = {x: m1['cx'], y: m1['cy'] };
        var w = {x: m2['cx'], y: m2['cy'] };
      var d = distToSegment(p,v,w);
      if (d < selectRange && !recordLongestChain) {
          if (b['type']==3)
              b['type']=1;
          else {
              if (!isBondValid(b)){
                console.log ('Warning: Carbon can only have 4 bonds.');
                b['type']=1;
                return b;
                }
              b['type']++;
            }
        checkMaxNumBond();  
          return b;
      }
      if (d < selectRange && recordLongestChain)
          return b;
      
  }
    return null;
    
}

function checkMaxNumBond() {
    maxNumBond = 0;
    for (i=0; i<bonds.length; i++) {
        var b = bonds[i];
        if (b['type']>maxNumBond)
         maxNumBond = b['type'];   
    }
}

function mousePressed() {
    var o = objectClicked()
    if (o == null) {
        if (placeMoleculeEnabled) {
            if (mouseX < w && mouseY < h)
                addAtom(mouseX,mouseY,selectedAtomType);
        }
        else {
            var o = bondClicked();
        }
    }
    else {
        selected = o;
    }
    analyzeMolecule();
}
function toggleRecordLongestChain() {
    if (!recordLongestChain) {
        recordLongestChain = true;
        record_long_chain_button['elt'].innerHTML = "Stop Recording Longest Chain";
        primaryBondChain = [];
    } 
    else {
        recordLongestChain = false;
        record_long_chain_button['elt'].innerHTML = "Record Longest Chain";
    } 
}

function toggle_place_mol() {
    if (!placeMoleculeEnabled) {
        placeMoleculeEnabled = true;
        place_molecule['elt'].innerHTML = "Disable Place Molecule";
    }
    else {
        placeMoleculeEnabled = false;
        place_molecule['elt'].innerHTML = "Enable Place Molecule";
    }
    
}


function addAtom(cx,cy,type) {
    var last_mol = molecules[molecules.length-1]
    var mol = createAtom(cx,cy,type)
    molecules.push(mol)
    if (selected != null) {
        var nB = createBond(mol,selected,1);
        if (isBondValid(nB)) {
            bonds.push(nB)
            selected = mol;
        }
        else{
         deleteMolecule(mol);   
        }
    }
    //Bond the last two molecules
    else if (last_mol != undefined) {
        var nB = createBond(mol,last_mol,1);
        if (isBondValid(nB)) {
            bonds.push(nB);
        }
        else
            deleteMolecule(mol);
    }
    
    //Analyze Molecule
    analyzeMolecule();
}

function deleteMolecule(m) {
    for (var i = 0; i<molecules.length; i++) {
        if (m['i'] == molecules[i]['i'])
            molecules.splice(i,1);
    }
}

function createBond(m1, m2, bondType) {
    //returns a bond object
    var b = {
        'i':numBonds,
        'm1':m1,
        'm2':m2,
        'type':bondType,
    }
    numBonds++;
    return b;
}

function createAtom(cx, cy, type) {
    //returns a molecule object
    //increment index
    var o = {
        'i':numObjects,
        'type':type,
        'cx':cx,
        'cy':cy,
    }
    numObjects++;
    return o;
}
function findChainBeginning() {
    var shortDistanceToFunctionalGroup = Number.POSITIVE_INFINITY,
        bestEndCandidate = null;
        //for each bond
       for (var i=0; i<primaryBondChain.length; i++) {
           //for each atom
            if (isEnd(primaryBondChain[i]['m1'])) {
                   
            }
                //if atom is end
                    //measure distance to highest priority functional group
                        //compare to best End candidate
       }
}
function isEnd (m) {
    for (var i =0; i<ends.length; i++) {
        if (m['i'] == ends[i]['i']) {
            return true;   
        }
    }
    return false;
}
function shortestDistToHighestPriorityFunctionalGroup() {
       
}
function getMolecule(index) {
    //get molecule by index
    for (var i = 0; i < molecules.length; i++) {
        var m = molecules[i];
        if (m['i'] == index)
            return m;
    }
    return null;
}

function objectClicked() {
    //Returns object is object was clicked, else null
    for (var i = 0; i < molecules.length; i++) {
        var o = molecules[i];
        var d = dist(o['cx'], o['cy'], mouseX, mouseY);
        if (d < objectRad) {
            return o;
        }
    }
    return null;
}
function createHydroCarbonChain (cx,cy,n) {
    molecules=[];
    primaryBondChain=[];
    ends = [];
    selected = null;
    highlighted = null;
    numObjects = 0;
    //create molecules
    for (var i = 0; i < n; i++) {
        var mcx = 0, mcy = 0;
        if (i==0) {
            mcx=cx +15;
            mcy=cy+15;
        }
        else {
         mcx=cx+15+(75*i);
            if (i%2==0) {
                mcy=cy+15   
            }
            else {
                mcy=cy+15+75
            }
        }
        var mol = createAtom(mcx,mcy,"C");
        molecules.push(mol)
    }
    //create bonds
    bonds = [];
    for (var i = 0;i < (n-1); i++) {
        var b = createBond (molecules[i],molecules[i+1],1);
        bonds.push(b);
        primaryBondChain.push(b);
    }
    analyzeMolecule();
}
function checkForFunctionalGroups() {
alcohols = [];
alcoholRoots = [];
carboxylicAcids = [];
for (var i =0;i<molecules.length;i++) {
    if (isCarboxylicAcidGroup(molecules[i])) {
        carboxylicAcids.push(molecules[i]);
        
        }
    if (numAlcoholGroups(molecules[i]) > 0) {
        
         alcoholRoots.push(molecules[i]);
        var bondedAtoms = getBondedAtoms(molecules[i])
        for (var j = 0; j < bondedAtoms.length; j++) {
            if (bondedAtoms[j]['type'] == 'O')
                alcohols.push(bondedAtoms[j])
                }
        //numAlcohols += numAlcoholGroups(molecules[i]);
     }
 }
}
function analyzeMolecule() {
    findEnds();
    checkForFunctionalGroups();
    buildPrimaryChain();
    buildName();
}
function isCarboxylicAcidGroup(a) {
    var hasDoubleBondedOxygen = false,
            hasOxyHydrogen = false,
            hasSingleBondedCarbon = false;
    if (a['type'] == 'C'){
           for (var i =0; i < bonds.length; i++) {
               var bondedAtom = null; 
               if (bonds[i]['m1']['i'] == a['i']) {
                       bondedAtom = bonds[i]['m2'];
                }
               else if (bonds[i]['m2']['i'] == a['i']){
                       bondedAtom = bonds[i]['m1'];
               }
               if (bondedAtom != null) {
                       hasDoubleBondedOxygen = hasDoubleBondedOxygen || (bonds[i]['type']==2 && bondedAtom['type'] == 'O');
                        hasOxyHydrogen = hasOxyHydrogen || (bonds[i]['type']==1 && bondedAtom['type'] == 'O');
                   hasSingleBondedCarbon = hasSingleBondedCarbon || (bonds[i]['type']==1 && bondedAtom['type'] == 'C');
               }
           }
    }
    return hasDoubleBondedOxygen && hasOxyHydrogen && hasSingleBondedCarbon;
}
function numAlcoholGroups(a) {
    if (a['type'] == 'C') {
        var numSingleBondedOxygen = 0,
            numBonds = 0;
           for (var i = 0;i<bonds.length;i++) {
                   var bondedAtom = null; 
               if (bonds[i]['m1']['i'] == a['i']) {
                       bondedAtom = bonds[i]['m2'];
                }
               else if (bonds[i]['m2']['i'] == a['i']){
                       bondedAtom = bonds[i]['m1'];
               }
               if (bondedAtom != null) {
                    if (bondedAtom['type'] == 'O' && bonds[i]['type'] == 1) {  
                        numSingleBondedOxygen++;   
                    }
                    if (bondedAtom['type'] != 'C')
                        numBonds++;
               }
           }
            if (numBonds == numSingleBondedOxygen) {
                return numSingleBondedOxygen;
            }
    }
    return 0;
}
function findEnds() {
    ends = [];
    if (molecules == 1)
        ends.push(molecules[0]);
    for (i = 0; i < molecules.length; i++){
        var a = molecules[i];
        var tracker = 0; //track number of bonds the atom has
        for (j=0; j <bonds.length; j++){
            //Count the number of bonds with other carbon atoms
            if (bonds[j]['m1']['i'] == a['i'])
                if (bonds[j]['m1']['type'] == 'C')
                    tracker++;
            if (bonds[j]['m2']['i'] == a['i'])
                if (bonds[j]['m1']['type'] == 'C')
                    tracker++;
        }
        //if a has only one bond and is a carbon atom
        if (tracker < 2 && a['type'] == 'C')
            ends.push(a);
    }   
}

 