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
  $stateProvider.state( 'jogasok', {
    url: '/jogasok',
    controller: 'JogasokCtrl',
    templateUrl: 'jogasok/jogasok.tpl.html',
    data:{ pageTitle: 'Jógások' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'JogasokCtrl', function JogasokController( $scope, $modal, Global ) {
  $scope.jogasok = Global.getJogasok();
  $scope.addJogas = function(jogas) {
    Global.addJogas( jogas );
  };
  $scope.openBerlet = function(index) {
    var currJogas = $scope.jogasok[index];
    var instance = $modal.open({
      templateUrl: 'jogasok/jogasok.berlet.tpl.html',
      controller: function BerletCtrl( $scope, $modalInstance, jogas) {
        $scope.jogas = jogas;
        $scope.berlet = {};
      },
      resolve: {
        jogas: function() {
          return currJogas;
        }
      }
    });
    instance.result.then(function( berlet ) {
      currJogas.$ujBerlet(berlet);
    });
  };
})
;

