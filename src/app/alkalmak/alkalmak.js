/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */

function nextHour(offset) {
    var now = moment();
    if( offset !== undefined) {
        now.add('minute', offset);
    }
    now.set('hour', now.get('hour')+1);
    now.set('minute', 0);
    return now;
}

angular.module( 'bkJoga.alkalmak', [
  'ui.router'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config( function config( $stateProvider ) {
  $stateProvider
  .state( 'alkalom', {
    url: '/alkalmak',
    controller: 'AlkalomCtrl',
    templateUrl: 'alkalmak/uj_alkalom.tpl.html',
    data:{ pageTitle: 'Új alkalom' }
  })
  .state( 'alkalom.list', {
    url: '/list',
    controller: 'AlkalomListCtrl',
    templateUrl: 'alkalmak/alkalom.list.tpl.html',
    data:{ pageTitle: 'Alkalmak' }
  })
  .state('alkalom.details', {
    url: '/:alkalomId',
    controller: 'AlkalomItemCtrl',
    templateUrl: 'alkalmak/alkalom.tpl.html',
    data:{ pageTitle: 'Alkalom' }
  });
})

.factory('Alkalom', function($resource) {
  var Alkalom = $resource('/alkalmak/:id/:action', {
    'id': '@_id',
    'action': '@action'
  }, {
    'addResztvevo': {'method': 'POST', 'params': {'action': 'addResztvevo'}}
  });
  return Alkalom;
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'AlkalomCtrl', function HomeController( $scope, Global, Alkalom , $stateParams, $state) {
  $scope.alkalmak = Alkalom;
  $scope.jogatartok = Global.jogatartok;
  $scope.varosok = Global.varosok;
  var _nextHour = nextHour();
  $scope.ujAlkalom = {
    tartja: null,
    date: _nextHour.format('YYYY-MM-DD'),
    time: _nextHour.format('HH:mm')
  };
  $scope.setupAlkalom = function(alkalom) {
    alkalom.starts = alkalom.date + " " + alkalom.time;
    alkalom = new Alkalom(alkalom);
    alkalom.$save(function(value, hdrs){
      $state.go('.details', {'alkalomId': value._id});
    });
  };
})
.controller( 'AlkalomListCtrl', function AlkalomListCtrl( $scope, Alkalom) {
  $scope.alkalmak = Alkalom.query();
})
.controller( 'AlkalomItemCtrl', function AlkalomItemCtrl($scope, Global, Alkalom, $stateParams) {
//  console.log('AlkalomItemCtrl initialized', $stateParams);
  $scope.search = '';
  $scope.jogasok = Global.getJogasok();
  $scope.alkalom = Alkalom.get({id: $stateParams.alkalomId}, function(value, hdrs){
    $scope.location = value.location;
  });
  $scope.addJogas = function(name) {
    var jogas = {
      name: name,
      city: $scope.alkalom.location
    };
    Global.addJogas( jogas, function(data) {
      $scope.$apply();
      $scope.addResztvevo(data);
    } );
  };
  $scope.addResztvevo = function(jogas) {
    if($scope.alkalom.resztvevok.some(function(elem) { return elem._id == jogas._id; })) {
      // avoid doubles
      Global.addWarning(jogas.name + " már hozzá van adva");
      return;
    }
    $scope.alkalom.$addResztvevo({
      '_id': $scope.alkalom._id,
      'jogas': jogas._id
    });
  };
  $scope.removeResztvevo = function(index) {
    $scope.alkalom.resztvevok.splice(index, 1);
    $scope.alkalom.$save();
  };
})
;

