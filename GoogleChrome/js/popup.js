/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 26.02.13
 * Time: 21:32
 * To change this template use File | Settings | File Templates.
 */


var app = angular.module('ColorSpace', []);

app.controller('ColorSpaceCtrl', function($scope) {

    $('#query').focus();

    var color =  localStorage["color"] == undefined ? Colors.ColorFromRGB(255,0,0) : Colors.ColorFromHex(localStorage["color"]);
    var selectedColor;
    var colorValues = [];
    initColorPicker(colorChanged, staticColorChanged, color);

    $scope.source = chrome.extension.getBackgroundPage().colorDictionary;

    $scope.color = update(color);

    function getIndexes(index) {
        var length = $scope.source.length;
        var indexes = [];
        if(index - 2 < 0)
            indexes.push(length + (index - 2));
        else
            indexes.push(index - 2);

        if(index - 1 < 0)
            indexes.push(length + (index - 1));
        else
            indexes.push(index - 1);

        if(index + 1 >= length)
            indexes.push(index - length);
        else
            indexes.push(index + 1);

        if(index + 2 >= length)
            indexes.push(index + 2 - length);
        else
            indexes.push(index + 2);

        return indexes;
    }

    function checkIndexes(index, lowBound, upBound)
    {
        if(index < lowBound)
            return upBound + index;
        else if(index >= upBound)
            return  index - upBound;
        return index;
    }

    function checkSourceIndexes(index)
    {
        return checkIndexes(index, 0, $scope.source.length);
    }

    $scope.onSelect = function( selectedValue ) {
        selectedColor = selectedValue;
        var index = selectedValue.Index;

        updateBarrel(index);
        $scope.color = updateMainColor(Colors.ColorFromHex(colorValues[0].HexValue));
        $scope.$apply();
    };


    function updateBarrel(index)
    {
        for(var i = -2; i <3; i++)
        {
            colorValues[i] = $scope.source[checkSourceIndexes(index + i)];
        }
    }

    $scope.getBarrelColor = function(index){
        return colorValues[index];
    }

    $scope.getBarrelTextColor = function(index){
        var color = Colors.ColorFromHex(colorValues[index].HexValue);
        if(color.Y() > 0.5)
            return "#000000";
        else
            return "#FFFFFF";
    }

    $scope.colorDown = function(){
        updateBarrel(++selectedColor.Index);
        $scope.color = updateMainColor(Colors.ColorFromHex(colorValues[0].HexValue));
    };

    $scope.colorUp= function(){
        updateBarrel(--selectedColor.Index);
        $scope.color = updateMainColor(Colors.ColorFromHex(colorValues[0].HexValue));
    };

    $scope.updateRGB = function(){
        if(color.SetRGB($scope.color.red,  $scope.color.green,  $scope.color.blue))
        {
            $scope.color = update(color);
        }
    };

    $scope.updateHSV = function(){
        if(color.SetHSV($scope.color.hue, $scope.color.saturation, $scope.color.value))
        {
            $scope.color = update(color);
        }

    };

    $scope.updateHex = function(){
        if(color.SetHexString($scope.color.hex)){
            $scope.color = update(color);
        }

    };


    //CallBack from colorPicker
    function colorChanged(changedColor)
    {
        $scope.color.quickColor = changedColor.HexStringWithPrefix();
        $scope.$apply();
    }

    function staticColorChanged(changedColor)
    {
        //change static cell
        $scope.color = update(changedColor);
        $scope.$apply();
    }

    function update(color){
        selectedColor = findNamedColor(color);
        updateBarrel(selectedColor.Index);
       return updateMainColor(color);
    }

    function updateMainColor(color){
        localStorage["color"] = color.HexStringWithPrefix();
        setColorPickerMarkers(color);
        return  {
            red:color.Red(),
            blue:color.Blue(),
            green:color.Green(),
            hue:color.Hue().toFixed(0),
            saturation:color.Saturation().toFixed(0),
            value:color.Value().toFixed(0),
            hex:color.HexString(),
            quickColor:color.HexStringWithPrefix(),
            staticColor:color.HexStringWithPrefix(),
            pickerColor:Colors.ColorFromHSV(color.Hue(), 100, 100).HexStringWithPrefix()
        };
    }

    function findNamedColor(color)
    {
        var namedColors = $scope.source.slice(0);
        var distances = [];

        $.each(namedColors, function (index, namedColor) {
            var _color = Colors.ColorFromHex(namedColor.HexValue);
            namedColor.distance = color.getDistance(_color)
            distances.push(namedColor.distance);
        });

        namedColors.sort(function(a, b) { return a.distance - b.distance });


        return namedColors[0];
    }

});





app.directive('autocomplete',function(){
    return{
        link: function(scope, element, attrs){
            $(element).autocomplete({
                source:
                    function(request, response){
                        var results = jQuery.ui.autocomplete.filter(scope.source, request.term);
                        results = results.sort(function(a, b){
                            return a.label.toLowerCase().indexOf(request.term.toLowerCase()) - b.label.toLowerCase().indexOf(request.term.toLowerCase());
                        });

                        results = results.sort(function(a, b){
                            return (a.label.length < b.label.length) ? -1 : 1;
                        });
                        response(results.slice(0, 15));
                    },
                select: function (event, ui) {
                    console.log(scope);
                    scope.onSelect(ui.item);
                }
            });
        }
    };
});
