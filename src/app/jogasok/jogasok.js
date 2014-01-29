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
  .state( 'jogasok.one', {
      url: '/:jogasId',
      controller: 'JogasCtrl',
      templateUrl: 'jogasok/jogas.tpl.html',
      data: {pageTitle: 'Jógázó'}
  })
  .state( 'jogasok.one.berlet', {
    url: '/berlet',
    controller: 'BerletCtrl',
    templateUrl: 'jogasok/berlet.tpl.html',
    data:{ pageTitle: 'Bérlet' }
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
  $scope.addJogas = function(jogas) {
    Global.addJogas( jogas );
  };
})
.controller( 'JogasCtrl', function JogasCtrl( $scope, $stateParams, Global){
    $scope.jogas = Global.Jogas.get({id: $stateParams.jogasId});
})
.controller( 'BerletCtrl', function BerletCtrl( $scope, $stateParams, $state, Global) {
  $scope.jogas = Global.Jogas.get({id:$stateParams.jogasId});
  $scope.save = function(berlet) {
    $scope.jogas.$ujBerlet(berlet, function(data) {
      $state.go('jogasok');
    });
  };
})
;

