function renderHighlighted()
{
    if (highlighted != null) {
                                fill('yellow');
                                noStroke();
                                ellipse(highlighted['cx'], highlighted['cy'], objectRad,objectRad);
        
                                /*noStroke();
                                stroke('black');
                                strokeWeight(5);
                                noFill();
                                fill('purple');
                                ellipse(highlighted['cx'], highlighted['cy'], objectRad,objectRad);
                                */
                             }
}
function renderSelected() {
    if (selected != null) {
        stroke('black');
        strokeWeight(3);
        noFill();
        ellipse(selected['cx'], selected['cy'], objectRad,objectRad);    
    }
    
}
function renderBonds(bondArray, colour) 
{
    var typeSpace = 5;
    
    for (var i = 0; i < bondArray.length; i++) {
            var b = bondArray[i];
            var m1 = molecules[b['m1']['i']],
                m2 = molecules[b['m2']['i']];

            fill(colour);
            stroke(colour);
            var d = dist(m1['mcx'],m1['mcy'],m2['mcx'],m2['mcy']);

            for (j=0; j < b['type']; j++) {
                var xOffSet, yOffSet;
                var slope = Math.abs((m2['cy']-m1['cy'])/(m2['cx']-m1['cx']));
                var midPointX = ((m2['cx']+m1['cx'])/2);
                var midPointY = ((m2['cy']-m1['cy'])/2);
                if (slope >= 1) {
                    xOffSet=1;
                    yOffSet=0;
                    }
                else {
                    xOffSet=0;
                    yOffSet=1;  
                    }

                if (j % 2 != 0){
                    line(
                    m1['cx']-(typeSpace*xOffSet*j*2),
                    m1['cy']-(typeSpace*yOffSet*j*2),
                    m2['cx']-(typeSpace*xOffSet*j*2),
                    m2['cy']-(typeSpace*yOffSet*j*2)
                    )
                    }
                else{
                    line(
                    m1['cx']+(typeSpace*xOffSet*j),
                    m1['cy']+(typeSpace*yOffSet*j),
                    m2['cx']+(typeSpace*xOffSet*j),
                    m2['cy']+(typeSpace*yOffSet*j)
                    )
                    }
                }
            }
}

function renderMolecules() {
    for (var i = 0; i <  molecules.length; i++) {
        var o = molecules[i];
        fill('black');
        stroke('black');
        text(o['type'],o['cx'], o['cy']);
    }
}
function renderName() {
    //text(name,w/2, h/2);
    $('#name')[0].innerHTML = name
}
function renderChain() {
    if (isMethanePressed == true)
        drawMethane(0,0);
    else if (isEthanePressed == true)
        drawEthane(0,0);
    else if (isPropanePressed == true)
        drawPropane(0,0);
    else if (isButanePressed == true)
        drawButane(0,0);
    else if (isPentanePressed == true)
        drawPentane(0,0);
    else if (isHexanePressed == true)
        drawHexane(0,0);
    else if (isHeptanePressed == true)
        drawHeptane(0,0);
}
function buildEndTag(m) {
    var endTag = "CH"
    var numBonds = getNumBonds(m);
    endTag = endTag + (4-numBonds);
    return endTag;
}
function renderEndTags() { 
    fill('black');
    stroke('black');
    strokeWeight(1);
    if (molecules.length==1) {
        var m = molecules [0];
        text(buildEndTag(m),m['cx'],m['cy']);
    }
    else {
        for(var i=0; i<ends.length; i++) {
                var m = ends[i];
                text(buildEndTag(m),m['cx'],m['cy']);
            }
    }
}

function drawMethane(cx,cy) {
    createHydroCarbonChain(cx,cy,1);
}
function drawEthane(cx,cy) {
    createHydroCarbonChain(cx,cy,2);
}
function drawPropane(cx,cy) {
    createHydroCarbonChain(cx,cy,3);
}
function drawButane(cx,cy) {
    createHydroCarbonChain(cx,cy,4);
}
function drawPentane(cx,cy) { 
    createHydroCarbonChain(cx,cy,5);
}
function drawHexane(cx,cy) {
    createHydroCarbonChain(cx,cy,6);
}
function drawHeptane(cx,cy) {
    createHydroCarbonChain(cx,cy,7);
}