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

    var color =  Colors.ColorFromRGB(255, 60, 10);

    initColorPicker(colorChanged, staticColorChanged, color);

    $scope.source = chrome.extension.getBackgroundPage().colorsName;

    $scope.color = update(color);

    $scope.onSelect = function( selectedValue ) {
        console.log( selectedValue );
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
});


function update(color){
    setColorPickerMarkers();
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

app.directive('autocomplete',function(){
    return{
        link: function(scope, element, attrs){
            $(element).autocomplete({
                source:
                    function(request, response){
                        var results = jQuery.ui.autocomplete.filter(scope.source, request.term);
                        results = results.sort(function(a, b){
                            return a.toLowerCase().indexOf(request.term.toLowerCase()) - b.toLowerCase().indexOf(request.term.toLowerCase());
                        });

                        results = results.sort(function(a, b){
                            return (a.length < b.length) ? -1 : 1;
                        });
                        response(results.slice(0, 15));
                    },
                select: function (event, ui) {
                    console.log(scope);
                    scope.onSelect(ui.item.value);
                }
            });
        }
    };
});
