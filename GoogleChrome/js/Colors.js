/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 26.02.13
 * Time: 22:03
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 10.03.13
 * Time: 15:36
 * To change this template use File | Settings | File Templates.
 */
var Colors = new function()
{
    this.ColorFromHSV = function (hue, sat, val) {
        var color = new Color();
        color.SetHSV(hue, sat, val);
        return color;
    };

    this.ColorFromRGB = function (r, g, b) {
        var color = new Color();
        color.SetRGB(r, g, b);
        return color;
    };

    this.ColorFromHex = function (hexStr) {
        var color = new Color();
        color.SetHexString(hexStr);
        return color;
    };

    this.TryParse = function(str)
    {
        var color = new Color();
        if(color.SetHexString(str))
            return color;
    }

    function Color()
    {
        //Stored as values between 0 and 1
        var red = 0;
        var green = 0;
        var blue = 0;

        //Stored as values between 0 and 360
        var hue = 0;

        //Strored as values between 0 and 1
        var saturation = 0;
        var value = 0;

        this.Name = "";
        /**
         * @return {boolean}
         */
        this.SetRGB = function (r, g, b) {
            if (isNaN(r) || isNaN(g) || isNaN(b))
                return false;

            r = r / 255.0;
            red = r > 1 ? 1 : r < 0 ? 0 : r;
            g = g / 255.0;
            green = g > 1 ? 1 : g < 0 ? 0 : g;
            b = b / 255.0;
            blue = b > 1 ? 1 : b < 0 ? 0 : b;

            calculateHSV();
            return true;
        };

        this.getDistance = function(color)
        {
            return Math.sqrt(Math.pow(this.Red() - color.Red(),2) + Math.pow(this.Green() - color.Green(),2) + Math.pow(this.Blue() - color.Blue(),2));
        }

        this.Y = function(){
            return red*0.3 + 0.59*green + 0.11*blue;
        }

        this.Red = function () {
            return Math.round(red * 255);
        };

        this.Green = function()
        { return Math.round(green*255); };

        this.Blue = function()
        { return Math.round(blue*255); };

        /**
         * @return {boolean}
         */
        this.SetHSV = function (h, s, v) {
            if (isNaN(h) || isNaN(s) || isNaN(v))
                return false;

            hue = (h >= 360) ? 359.99 : (h < 0) ? 0 : h;
            s = s / 100.0;
            saturation = (s > 1) ? 1 : (s < 0) ? 0 : s;
            v = v / 100.0;
            value = (v > 1) ? 1 : (v < 0) ? 0 : v;
            calculateRGB();
            return true;
        };

        /**
         * @return {number}
         */
        this.Hue = function () {
            return hue*1.0;
        };

        /**
         * @return {number}
         */
        this.Saturation = function () {
            return saturation*100.0;
        };

        /**
         * @return {number}
         */
        this.Value = function () {
            return value*100.0;
        };

        /**
         * @return {boolean}
         */
        this.SetHexString = function (hexString) {
            if (hexString == null || typeof(hexString) != "string")
                return false;

            if (hexString.substr(0, 1) == '#')
                hexString = hexString.substr(1);

            if (hexString.length != 6)
                return false;

            var r = parseInt(hexString.substr(0, 2), 16);
            var g = parseInt(hexString.substr(2, 2), 16);
            var b = parseInt(hexString.substr(4, 2), 16);

            return this.SetRGB(r, g, b);
        };

        this.HexString = function () {
            var rStr = this.Red().toString(16);
            if (rStr.length == 1)
                rStr = '0' + rStr;
            var gStr = this.Green().toString(16);
            if (gStr.length == 1)
                gStr = '0' + gStr;
            var bStr = this.Blue().toString(16);
            if (bStr.length == 1)
                bStr = '0' + bStr;
            return (rStr + gStr + bStr).toUpperCase();
        };

        this.HexStringWithPrefix = function(){
            return ('#' + this.HexString());
        };

        this.Complement = function () {
            var newHue = (hue >= 180) ? hue - 180 : hue + 180;
            var newVal = (value * (saturation - 1) + 1);
            var newSat = (value * saturation) / newVal;
            var newColor = new Color();
            newColor.SetHSV(newHue, newSat, newVal);
            return newColor;
        };

        function calculateHSV()
        {
            var max = Math.max(Math.max(red, green), blue);
            var min = Math.min(Math.min(red, green), blue);

            value = max;

            saturation = 0;
            if(max != 0)
                saturation = 1 - min/max;

            hue = 0;
            if(min == max)
                return;

            var delta = (max - min);
            if (red == max)
                hue = (green - blue) / delta;
            else if (green == max)
                hue = 2 + ((blue - red) / delta);
            else
                hue = 4 + ((red - green) / delta);
            hue = hue * 60;
            if(hue <0)
                hue += 360;
        }

        function calculateRGB()
        {
            red = value;
            green = value;
            blue = value;

            if(value == 0 || saturation == 0)
                return;

            var tHue = (hue / 60);
            var i = Math.floor(tHue);
            var f = tHue - i;
            var p = value * (1 - saturation);
            var q = value * (1 - saturation * f);
            var t = value * (1 - saturation * (1 - f));
            switch(i)
            {
                case 0:
                    red = value; green = t; blue = p;
                    break;
                case 1:
                    red = q; green = value; blue = p;
                    break;
                case 2:
                    red = p; green = value; blue = t;
                    break;
                case 3:
                    red = p; green = q; blue = value;
                    break;
                case 4:
                    red = t; green = p; blue = value;
                    break;
                default:
                    red = value; green = p; blue = q;
                    break;
            }
        }
    }
};