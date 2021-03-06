angular.module( 'bkJoga.jogasok', [
  'ui.router',
  'ui.bootstrap'
])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider
  .state( 'jogasok', {
    url: '/jogasok',
    controller: 'JogasokCtrl',
    templateUrl: 'jogasok/jogasok.tpl.html',
    data:{ pageTitle: 'Jógások' }
  })
  .state( 'jogasok.berlet', {
    url: '/:jogasId/berlet',
    controller: 'BerletCtrl',
    templateUrl: 'jogasok/berlet.tpl.html',
    data:{ pageTitle: 'Bérlet' }
  })
  .state( 'jogasok.adatok', {
      url: '/:jogasId',
      controller: 'JogasCtrl',
      templateUrl: 'jogasok/jogas.tpl.html',
      data: {pageTitle: 'Jógázó'}
  })
  ;
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'JogasokCtrl', function JogasokController( $scope, Global ) {
  $scope.jogasok = Global.getJogasok();
  $scope.varosok = Global.varosok;
  $scope.search = $scope.location = '';
  $scope.jogas = {
    city: null
  };
  $scope.addJogas = function(jogas) {
    Global.addJogas( jogas );
  };
})
.controller( 'JogasCtrl', function JogasCtrl( $scope, $stateParams, Global){
    $scope.jogas = Global.Jogas.get({id: $stateParams.jogasId});
    $scope.varosok = Global.varosok;
    $scope.save = function save(jogas) {
      $scope.jogas.$save({}, function(data){
        Global.addMessage("Módosítások elmentve");
        $window.history.back();
      });
    };
})
.controller( 'BerletCtrl', function BerletCtrl( $scope, $stateParams, $state, Global, $window) {

  $scope.jogas = Global.Jogas.get({id:$stateParams.jogasId});
  $scope.window = $window;
  $scope.save = function(berlet) {
    $scope.jogas.$ujBerlet(berlet, function(data) {
      Global.addMessage("Bérlet elmentve");
      $window.history.back();
    });
  };
})
;

