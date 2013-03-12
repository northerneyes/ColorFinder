/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 26.02.13
 * Time: 21:32
 * To change this template use File | Settings | File Templates.
 */

$(function () {

    var colorsName = chrome.extension.getBackgroundPage().colorsName;

    $('#query').focus();

    $('#query').autocomplete({
        source:
            function(request, response){
            var results = jQuery.ui.autocomplete.filter(colorsName, request.term);
            results = results.sort(function(a, b){
                return a.toLowerCase().indexOf(request.term.toLowerCase()) - b.toLowerCase().indexOf(request.term.toLowerCase());
            });

                results = results.sort(function(a, b){
                    return (a.length < b.length) ? -1 : 1;
                });
            response(results.slice(0, 15));
        }
//        function (request, response) {
//            var term = $.ui.autocomplete.escapeRegex(request.term)
//                , startsWithMatcher = new RegExp("^" + term, "i")
//                , startsWith = $.grep(colorsName, function(value) {
//                    return startsWithMatcher.test(value.label || value.value || value);
//                })
//                , containsMatcher = new RegExp(term, "i")
//                , contains = $.grep(colorsName, function (value) {
//                    return $.inArray(value, startsWith) < 0 &&
//                        containsMatcher.test(value.label || value.value || value);
//                });
//
//            response(startsWith.concat(contains));
//        }
    });

});

function ColorSpaceCtrl($scope) {

   // var colors = chrome.extension.getBackgroundPage().Colors;
    var color =  Colors.ColorFromRGB(255, 60, 10);

    initColorPicker(colorChanged, staticColorChanged, color);
    $scope.color = update(color);

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
}


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
