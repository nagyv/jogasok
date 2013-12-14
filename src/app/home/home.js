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
angular.module( 'bkJoga.home', [
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
    templateUrl: 'home/home.tpl.html',
    data:{ pageTitle: 'Új alkalom' }
  })
  .state( 'alkalom.list', {
    url: '/list',
    controller: 'AlkalomListCtrl',
    templateUrl: 'home/alkalom.list.tpl.html',
    data:{ pageTitle: 'Alkalmak' }
  })
  .state('alkalom.details', {
    url: '/:alkalomId',
    controller: 'AlkalomItemCtrl',
    templateUrl: 'home/alkalom.tpl.html',
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
  $scope.setupAlkalom = function(alkalom) {
    alkalom = new Alkalom(alkalom);
    alkalom.$save(function(value, hdrs){
      $state.go('.details', {'alkalomId': value._id});
    });
  };
  $scope.today = function() {
    return Date.now().day;
  };
  $scope.nextHour = function() {
    return Date.now().hour + 1;
  };
})
.controller( 'AlkalomListCtrl', function AlkalomListCtrl( $scope, Alkalom) {
  $scope.alkalmak = Alkalom.query();
})
.controller( 'AlkalomItemCtrl', function AlkalomItemCtrl($scope, Global, Alkalom, $stateParams) {
  console.log('AlkalomItemCtrl initialized', $stateParams);
  $scope.jogasok = Global.getJogasok();
  $scope.alkalom = Alkalom.get({id: $stateParams.alkalomId});
  $scope.addJogas = function(jogas) {
    $scope.jogasok = Global.addJogas( jogas );
    $scope.addResztvevo(jogas);
  };
  $scope.addResztvevo = function(jogas) {
    $scope.alkalom.$addResztvevo({
      '_id': $scope.alkalom._id,
      'jogas': jogas._id
    }, function(value, hdrs) {
      $scope.alkalom = value;
      // .resztvevok.push(jogas);
    });
  };
  $scope.removeResztvevo = function(index) {
    $scope.alkalom.resztvevok.splice(index, 1);
    $scope.alkalom.$save();
  };
})
;

