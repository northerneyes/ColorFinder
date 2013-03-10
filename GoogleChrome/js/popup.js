/**
 * Created with IntelliJ IDEA.
 * User: George
 * Date: 26.02.13
 * Time: 21:32
 * To change this template use File | Settings | File Templates.
 */
function ColorSpaceCtrl($scope) {

   // var colors = chrome.extension.getBackgroundPage().Colors;
    var color =  Colors.ColorFromRGB(255, 33, 33);

    $scope.color = update(color);

    $scope.updateRGB = function(){
        color.SetRGB($scope.color.red,  $scope.color.green,  $scope.color.blue);
        $scope.color = update(color);
    };

    $scope.updateHSV = function(){
        color.SetHSV($scope.color.hue, $scope.color.saturation, $scope.color.value);
        $scope.color = update(color);
    }
}

function update(color){
    return  {
        red:color.Red(),
        blue:color.Blue(),
        green:color.Green(),
        hue:color.Hue(),
        saturation:color.Saturation(),
        value:color.Value()
    };
}

//$(function() {
//    // Render the template with the tabs data and insert
//    // the rendered HTML under the "tabsList" element
//  //  var tabs = chrome.extension.getBackgroundPage().tabs;
////    $(".tabs-display" ).html(
////        $( "#tabsTemplate" ).render(tabs)
////    );
//});

