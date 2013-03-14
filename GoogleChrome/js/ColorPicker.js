/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 10.03.13
 * Time: 17:56
 * To change this template use File | Settings | File Templates.
 */

var pointerOffset;
var squareMarkerOffset;

var squareMarkerLowBounds;
var squareMarkerUpBounds;

//CallBackFunction
var pickerValueChanged;
var pickerValueChanging;

var currentColor;
var arrowsOffset;
var arrowsLowBounds;
var arrowsUpBounds;

var squareCursor;
var circleCursor;

function initColorPicker( _pickerValueChanging, _pickerValueChanged, _currentColor)
{
     pointerOffset = new Position(0, navigator.userAgent.indexOf("Firefox") >= 0 ? 1 : 0);
     squareMarkerOffset = new Position(7, 7);

     squareMarkerLowBounds = new Position(-7, -7);
     squareMarkerUpBounds = new Position(45, 45);

     arrowsOffset = new Position(7, 7);
     arrowsLowBounds = new Position(-7, -7);
     arrowsUpBounds = new Position(88, 88);


     pickerValueChanged = _pickerValueChanged;
     pickerValueChanging = _pickerValueChanging;

     currentColor = _currentColor;

    squareCursor = new dragObject("square_marker", "colorspace-picker", squareMarkerLowBounds, squareMarkerUpBounds,
        circleDown, circleMoved, endMovement, false);

    circleCursor = new dragObject("colorspace-picker_marker", "colorspace-ring", arrowsLowBounds, arrowsUpBounds,
        arrowsDown, arrowsMoved, endMovement, true);

    setColorPickerMarkers(currentColor);

}

function setColorPickerMarkers(_currentColor)
{
    currentColor = _currentColor;
    squareCursor.setCursor();
    circleCursor.setCursor();
}

function endMovement()
{
    pickerValueChanged(currentColor);
  //  document.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
}

function arrowsDown(e, arrows)
{
    var pos = getMousePos(e);

    if(getEventTarget(e) == arrows)
    {
        pos.X += parseInt(arrows.style.left);
        pos.Y += parseInt(arrows.style.top);
    }

    pos = correctOffset(pos, arrowsOffset, true);

    pos = pos.Bound(arrowsLowBounds, arrowsUpBounds);

    //angle
    var angle = getAngle(pos);
    var x = 40.5 + 42.0*Math.cos(Math.PI/2.0 - angle) ; //42 radius 40 + 2 - shift of circle
    var y = 40.5 - 42.0*Math.sin(Math.PI/2.0 - angle) ; //40.5 - coordinates of center circle
    pos = new Position(x, y);

    pos.Apply(arrows);

    arrowsMoved(angle);
}

function arrowsMoved(angle, element)
{
    currentColor.SetHSV(180*angle/Math.PI, currentColor.Saturation(), currentColor.Value());
    pickerValueChanging(currentColor);
}


function circleDown(e, circle)
{
    var pos = getMousePos(e);

    if(getEventTarget(e) == circle)
    {
        pos.X += parseInt(circle.style.left);
        pos.Y += parseInt(circle.style.top);
    }

    pos = correctOffset(pos,  squareMarkerOffset , true);

    pos = pos.Bound(squareMarkerLowBounds, squareMarkerUpBounds);

    pos.Apply(circle);

    circleMoved(pos);
}

function circleMoved(pos, element)
{
    pos = correctOffset(pos,  squareMarkerOffset, false);
    console.log("Red: " + currentColor.Red());
    console.log("Green: " + currentColor.Red());
    console.log("Blue: " + currentColor.Red());
    currentColor.SetHSV(currentColor.Hue(), (pos.X/52.0)*100.0, (1-pos.Y/52.0)*100);

    pickerValueChanging(currentColor);
   // colorChanged("circle");
}