/*jshint -W030*/
/**
 * @ngdoc directive
 * @name custom-control
 * @requires Attr2Options 
 * @requires $compile
 * @description 
 *   Build custom control and set to the map with position
 *   
 *   Requires:  ng-map directive
 *
 *   Restrict To:  Element
 *
 * @param {String} position position of this control
 *        i.e. TOP_RIGHT
 * @param {Number} index index of the control
 * @example
 *
 * Example: 
 *  <ng-map center="41.850033,-87.6500523" zoom="3">
 *    <custom-control id="home" position="TOP_LEFT" index="1">
 *      <div style="background-color: white;">
 *        <b>Home</b>
 *      </div>
 *    </custom-control>
 *  </ng-map>
 *
 */
/*jshint -W089*/
ngMap.directive('customControl', ['Attr2Options', '$compile', function(Attr2Options, $compile)  {
  var parser = Attr2Options;

  return {
    restrict: 'E',
    require: ['^?map', '?^ngMap'],
    link: function(scope, element, attrs, controllers) {
      for (var i=0; i<controllers.length; i++) {
        controllers[i] && (mapController = controllers[i]);
      }
      element.css('display','none');
      var orgAttrs = parser.orgAttributes(element);
      var filtered = parser.filter(attrs);
      var options = parser.getOptions(filtered, scope);
      var events = parser.getEvents(scope, filtered);
      console.log("custom-control options", options, "events", events);

      /**
       * build a custom control element
       */
      var compiled = $compile(element.html().trim())(scope);
      var customControlEl = compiled[0];

      /**
       * set events
       */
      for (var eventName in events) {
        google.maps.event.addDomListener(customControlEl, eventName, events[eventName]);
      }

      mapController.addObject('customControls', customControlEl);
      scope.$on('mapInitialized', function(evt, map) {
        var position = options.position;
        map.controls[google.maps.ControlPosition[position]].push(customControlEl);
      });

    } //link
  }; // return
}]);// function
