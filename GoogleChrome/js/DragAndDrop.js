/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 10.03.13
 * Time: 18:47
 * To change this template use File | Settings | File Templates.
 */
function Position(x, y)
{
    this.X = x;
    this.Y = y;

    this.Add = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if(val != null)
        {
            if(!isNaN(val.X))
                newPos.X += val.X;
            if(!isNaN(val.Y))
                newPos.Y += val.Y
        }
        return newPos;
    }

    this.Subtract = function(val)
    {
        var newPos = new Position(this.X, this.Y);
        if(val != null)
        {
            if(!isNaN(val.X))
                newPos.X -= val.X;
            if(!isNaN(val.Y))
                newPos.Y -= val.Y
        }
        return newPos;
    }

    this.Min = function(val)
    {
        var newPos = new Position(this.X, this.Y)
        if(val == null)
            return newPos;

        if(!isNaN(val.X) && this.X > val.X)
            newPos.X = val.X;
        if(!isNaN(val.Y) && this.Y > val.Y)
            newPos.Y = val.Y;

        return newPos;
    }

    this.Max = function(val)
    {
        var newPos = new Position(this.X, this.Y)
        if(val == null)
            return newPos;

        if(!isNaN(val.X) && this.X < val.X)
            newPos.X = val.X;
        if(!isNaN(val.Y) && this.Y < val.Y)
            newPos.Y = val.Y;

        return newPos;
    }

    this.Bound = function(lower, upper)
    {
        var newPos = this.Max(lower);
        return newPos.Min(upper);
    }

    this.Check = function()
    {
        var newPos = new Position(this.X, this.Y);
        if(isNaN(newPos.X))
            newPos.X = 0;
        if(isNaN(newPos.Y))
            newPos.Y = 0;
        return newPos;
    }

    this.Apply = function(element)
    {
        if(typeof(element) == "string")
            element = document.getElementById(element);
        if(element == null)
            return;
        if(!isNaN(this.X))
            element.style.left = this.X + 'px';
        if(!isNaN(this.Y))
            element.style.top = this.Y + 'px';
    }
}


function correctOffset(pos, offset, neg)
{
    if(neg)
        return pos.Subtract(offset);
    return pos.Add(offset);
}

function hookEvent(element, eventName, callback)
{
    if(typeof(element) == "string")
        element = document.getElementById(element);
    if(element == null)
        return;
    if(element.addEventListener)
    {
        element.addEventListener(eventName, callback, false);
    }
    else if(element.attachEvent)
        element.attachEvent("on" + eventName, callback);
}

function unhookEvent(element, eventName, callback)
{
    if(typeof(element) == "string")
        element = document.getElementById(element);
    if(element == null)
        return;
    if(element.removeEventListener)
        element.removeEventListener(eventName, callback, false);
    else if(element.detachEvent)
        element.detachEvent("on" + eventName, callback);
}

function cancelEvent(e)
{
    e = e ? e : window.event;
    if(e.stopPropagation)
        e.stopPropagation();
    if(e.preventDefault)
        e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    return false;
}

function getMousePos(eventObj)
{
    eventObj = eventObj ? eventObj : window.event;
    var pos;
    if(isNaN(eventObj.layerX))
        pos = new Position(eventObj.offsetX, eventObj.offsetY);
    else
        pos = new Position(eventObj.layerX, eventObj.layerY);
    return correctOffset(pos, pointerOffset, true);
}

function getEventTarget(e)
{
    e = e ? e : window.event;
    return e.target ? e.target : e.srcElement;
}

function absoluteCursorPostion(eventObj)
{
    eventObj = eventObj ? eventObj : window.event;

    if(isNaN(window.scrollX))
        return new Position(eventObj.clientX + document.documentElement.scrollLeft + document.body.scrollLeft,
            eventObj.clientY + document.documentElement.scrollTop + document.body.scrollTop);
    else
        return new Position(eventObj.clientX + window.scrollX, eventObj.clientY + window.scrollY);
}

function getAngle(newPos) {

    var x = newPos.X - 40.5; //40.5 - coordinates of center circle, 95/2 - 7 where -7 is shift
    var y = newPos.Y - 40.5;
    // a =  Math.atan2(y,x)*180.0/Math.PI;

    if(x==0) return (y>0) ? 180 : 0;
    var a = Math.atan2(y,x); //*180/Math.PI;
    a = a+Math.PI/2.0;

    if(a < 0)
        a = Math.PI*2 + a;
    console.log("Angle: " + a);
    return a;
}

function dragObject(element, attachElement, lowerBound, upperBound, startCallback, moveCallback, endCallback, _isCircle, attachLater)
{
    if(typeof(element) == "string")
        element = document.getElementById(element);
    if(element == null)
        return;
    var isCircle = _isCircle;

    if(lowerBound != null && upperBound != null)
    {
        var temp = lowerBound.Min(upperBound);
        upperBound = lowerBound.Max(upperBound);
        lowerBound = temp;
    }

    var cursorStartPos = null;
    var elementStartPos = null;
    var dragging = false;
    var listening = false;
    var disposed = false;

    function dragStart(eventObj)
    {
        if(dragging || !listening || disposed) return;
        dragging = true;

        if(startCallback != null)
            startCallback(eventObj, element);

        cursorStartPos = absoluteCursorPostion(eventObj);

        elementStartPos = new Position(parseInt(element.style.left), parseInt(element.style.top));

        elementStartPos = elementStartPos.Check();

        hookEvent(document, "mousemove", dragGo);
        hookEvent(document, "mouseup", dragStopHook);

        return cancelEvent(eventObj);
    }



    function dragGo(eventObj)
    {
        if(!dragging || disposed) return;

        var newPos = absoluteCursorPostion(eventObj);
        newPos = newPos.Add(elementStartPos).Subtract(cursorStartPos);
        newPos = newPos.Bound(lowerBound, upperBound);
        //console.log("X: " + newPos.X + "Y: " + newPos.Y);
        if(isCircle)
        {
            var angle = getAngle(newPos);
            var x = 40.5 + 42.0*Math.cos(Math.PI/2.0 - angle) ; //42 radius 40 + 2 - shift of circle
            var y = 40.5 - 42.0*Math.sin(Math.PI/2.0 - angle) ; //40.5 - coordinates of center circle
            newPos = new Position(x, y);
            console.log("X: " + newPos.X + "Y: " + newPos.Y);

            newPos.Apply(element);
            if(moveCallback != null)
                moveCallback(angle, element);
        }
        else
        {
            newPos.Apply(element);
            if(moveCallback != null)
                moveCallback(newPos, element);
        }
        return cancelEvent(eventObj);
    }

    function dragStopHook(eventObj)
    {
        dragStop();
        return cancelEvent(eventObj);
    }

    function dragStop()
    {
        if(!dragging || disposed) return;
        unhookEvent(document, "mousemove", dragGo);
        unhookEvent(document, "mouseup", dragStopHook);
        cursorStartPos = null;
        elementStartPos = null;
        if(endCallback != null)
            endCallback(element);
        dragging = false;
    }

    this.setCursor = function(){
        if(!isCircle)
        {
            var position = new Position(currentColor.Saturation()*52.0/100.0,(1 -currentColor.Value()/100.0)*52.0);
          //  currentColor.SetHSV(currentColor.Hue(), (pos.X/52.0)*100.0, (1-pos.Y/52.0)*100);
            position = correctOffset(position, squareMarkerOffset, true);
            position.Apply(element);
        }
        else
        {
            var angle = Math.PI*currentColor.Hue()/180.0;
            var x = 40.5 + 42.0*Math.cos(Math.PI/2.0 - angle) ; //42 radius 40 + 2 - shift of circle
            var y = 40.5 - 42.0*Math.sin(Math.PI/2.0 - angle) ; //40.5 - coordinates of center circle
            var position2 = new Position(x, y);
            position2.Apply(element);
        }
    };

    this.Dispose = function()
    {
        if(disposed) return;
        this.StopListening(true);
        element = null;
        attachElement = null
        lowerBound = null;
        upperBound = null;
        startCallback = null;
        moveCallback = null
        endCallback = null;
        disposed = true;
    }

    this.StartListening = function()
    {
        if(listening || disposed) return;
        listening = true;
        hookEvent(attachElement, "mousedown", dragStart);
    }

    this.StopListening = function(stopCurrentDragging)
    {
        if(!listening || disposed) return;
        unhookEvent(attachElement, "mousedown", dragStart);
        listening = false;

        if(stopCurrentDragging && dragging)
            dragStop();
    }

    this.IsDragging = function(){ return dragging; }
    this.IsListening = function() { return listening; }
    this.IsDisposed = function() { return disposed; }

    if(typeof(attachElement) == "string")
        attachElement = document.getElementById(attachElement);
    if(attachElement == null)
        attachElement = element;

    if(!attachLater)
        this.StartListening();
}