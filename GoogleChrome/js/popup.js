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

    $scope.onSelect = function( selectedValue ) {
        var mainColor = Colors.ColorFromHex(selectedValue.HexValue);
        mainColor.Name = selectedValue.label;
        color = mainColor;
        $scope.color = update(mainColor);


        var indexes = getIndexes(selectedValue.Index);
        var div2Color = Colors.ColorFromHex($scope.source[indexes[0]].HexValue);
        div2Color.Name = $scope.source[indexes[0]].label;
        var div1Color = Colors.ColorFromHex($scope.source[indexes[1]].HexValue);
        div1Color.Name = $scope.source[indexes[1]].label;
        var add1Color = Colors.ColorFromHex($scope.source[indexes[2]].HexValue);
        add1Color.Name = $scope.source[indexes[2]].label;
        var add2Color = Colors.ColorFromHex($scope.source[indexes[3]].HexValue);
        add2Color.Name = $scope.source[indexes[3]].label;

        $scope.barrelColor = updateMainColor(color, div2Color, div1Color, add1Color, add2Color);
        console.log( selectedValue );

        $scope.$apply();
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


function updateMainColor(color,  div2Color, div1Color, add1Color, add2Color){
    return  {
        mainColor:{hexValue : color.HexStringWithPrefix(), Name : color.Name},
        div2Color:{hexValue : div2Color.HexStringWithPrefix(), Name : div2Color.Name},
        div1Color:{hexValue : div1Color.HexStringWithPrefix(), Name : div1Color.Name},
        add1Color:{hexValue : add1Color.HexStringWithPrefix(), Name : add1Color.Name},
        add2Color:{hexValue : add2Color.HexStringWithPrefix(), Name : add2Color.Name}
    };
}


function update(color){
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
        pickerColor:Colors.ColorFromHSV(color.Hue(), 100, 100).HexStringWithPrefix(),

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
