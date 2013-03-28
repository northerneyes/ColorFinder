/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 26.02.13
 * Time: 21:32
 * To change this template use File | Settings | File Templates.
 */


var app = angular.module('ColorSpace', []);

app.controller('ColorSpaceCtrl', function($scope) {
    $("#query").focus();

    var color =  localStorage["color"] == undefined ? Colors.ColorFromRGB(255,0,0) : Colors.ColorFromHex(localStorage["color"]);
    //$scope.customColors = localStorage["customColors"] == undefined ? createCustomColors() : localStorage["customColors"];
    $scope.customColors =  createCustomColors();
    var selectedColor;
    var colorValues = [];
    initColorPicker(colorChanged, staticColorChanged, color);

    $scope.source = chrome.extension.getBackgroundPage().colorDictionary;


    $scope.color = update(color);
    $scope.selectedIndex = -1;

    function createCustomColors() {
        if( localStorage["customColors"] == undefined)
        {
           clearCustomColors();
        }
        return JSON.parse(localStorage["customColors"]);
    }

    function clearCustomColors(){
        var customColors = [];
        for (var i = 0; i < 10; i++) {
            customColors.push("#D8D8D8");
        }
        localStorage["customColors"] = JSON.stringify(customColors);
        return customColors;
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

    function updateBarrel(index)
    {
        for(var i = -2; i <3; i++)
        {
            colorValues[i] = $scope.source[checkSourceIndexes(index + i)];
        }
        selectedColor = colorValues[0];
    }

    $scope.clearCustomColors = function()
    {
        $scope.customColors = clearCustomColors();

    }

    $scope.getCustomColors = function(index)
    {
        return $scope.customColors[index];
    }

    $scope.addColor = function(){
        $scope.customColors[$scope.selectedIndex] = "#" + $scope.color.hex;
        localStorage["customColors"] = JSON.stringify($scope.customColors);
    }

    $scope.toggleSelect = function(ind){
        if($scope.customColors[ind] != "#D8D8D8")
            $scope.color = update(Colors.ColorFromHex($scope.customColors[ind]));
         $scope.selectedIndex = ind;
    };

    $scope.getClass = function(ind){
        if( ind == $scope.selectedIndex ){
            return "customColorBox activeCustomColorBox";
        } else{
            return "customColorBox";
        }
    };

    $scope.onSelect = function( selectedValue ) {
        selectedColor = selectedValue;
        var index = selectedValue.Index;

        updateBarrel(index);
        $scope.color = updateMainColor(Colors.ColorFromHex(colorValues[0].HexValue));
        $scope.$apply();
    };

    $scope.getBarrelColor = function(index){
        return colorValues[index];
    };

    $scope.getBarrelTextColor = function(index){
        var color = Colors.ColorFromHex(colorValues[index].HexValue);
        if(color.Y() > 0.5)
            return "#000000";
        else
            return "#FFFFFF";
    };

    $scope.colorDown = function(){
        var index = selectedColor.Index;
        updateBarrel(++index);
        $scope.color = updateMainColor(Colors.ColorFromHex(selectedColor.HexValue));
    };

    $scope.colorUp= function(){
        var index = selectedColor.Index;
        updateBarrel(--index);
        $scope.color = updateMainColor(Colors.ColorFromHex(selectedColor.HexValue));
    };

    $scope.colorBarrelClick = function(index){
        updateBarrel(selectedColor.Index + index);
        $scope.color = updateMainColor(Colors.ColorFromHex(selectedColor.HexValue));
    };

    //Update color values
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


    //Update functions
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
