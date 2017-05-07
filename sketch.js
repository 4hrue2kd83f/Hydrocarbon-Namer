//begin
var w = window.innerWidth,
    h = window.innerHeight*3/4;
 
var molecules = [],
    bonds = [],
    primaryBondChain = [],
    primaryAtomChain = null,
    ends = [];

var objectRad = 20;

var highlighted = null,
    selected = null;

var selectedAtomType = "C";

var recordLongestChain = false;
var record_long_chain_button;

var alcoholRoots = [];

var alcohols = [],
    carboxylicAcids = [];

var numObjects = 0,
    numBonds = 0;

var place_molecule;
    
var placeMoleculeEnabled = false;

var isMethanePressed = false;
var isEthanePressed = false;
var isPropanePressed = false;
var isButanePressed = false;
var isPentanePressed = false;
var isHexanePressed = false;
var isHeptanePressed = false;

var chainLength = 0;
var maxNumBond = 1;

var name = "";

var selectRange = 15;

var prefixName = {
                    1:'meth',
                    2:'eth',
                    3:'prop',
                    4:'but',
                    5:'pent',
                    6:'hex',
                    7:'hept',
                    8:'oct',
                    9:'non',
                    10:'dec'
                 }
var suffixName = {
                    1:'ane',
                    2:'ene',
                    3:'yne'
                 }
var numPrefix = {
                    1:'an',
                    2:'di',
                    3:'tri',
                    4:'tetr',
                    5:'pent',
                    6:'hex',
                    7:'hept',
                    8:'oct',
                    9:'non',
                    10:'dec'
}
var carboxylicSuffix = {
                    1:'oic',
                    2:'dioic'
}

var alcoholSuffix = 'ol';
function setup() 
{
    console.log('Setup');
    
    var canvas = createCanvas(w, h);
    canvas.parent('canvas_container');
    
    place_molecule = createButton ("Enable Place Molecule","place_mol");
    place_molecule.mousePressed (toggle_place_mol);
    /*
    record_long_chain_button = createButton ("Record Longest Chain", "rec_long_chain");
    record_long_chain_button.mousePressed (toggleRecordLongestChain);
    */
}

function draw() 
{
    //Fresh coat of primer
    background('white');
    
    //Update for Objects
    updateHighlighted();
    updateSelected();
    
    //Render
    renderBonds(bonds,'black');
    renderBonds(primaryBondChain,'cyan');
    renderMolecules();
    renderHighlighted();
    renderSelected();
    //renderChain();
    renderName();
    renderEndTags();

}
