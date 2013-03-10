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
function initColorPicker( _pickerValueChanging, _pickerValueChanged, _currentColor)
{
     pointerOffset = new Position(0, navigator.userAgent.indexOf("Firefox") >= 0 ? 1 : 0);
     squareMarkerOffset = new Position(7, 7);

     squareMarkerLowBounds = new Position(-7, -7);
     squareMarkerUpBounds = new Position(45, 45);

    pickerValueChanged = _pickerValueChanged;
    pickerValueChanging = _pickerValueChanging;

    currentColor = _currentColor;
    new dragObject("square_marker", "colorspace-picker", squareMarkerLowBounds, squareMarkerUpBounds,
        circleDown, circleMoved, endMovement);

}

function endMovement()
{
    pickerValueChanged(currentColor);
  //  document.getElementById("staticColor").style.backgroundColor = currentColor.HexString();
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