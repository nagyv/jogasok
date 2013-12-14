angular.module( 'bkJoga', [
  'ngResource',
  'ui.bootstrap',
  'ui.router',
  'templates-app',
  'templates-common',
  'bkJoga.home',
  'bkJoga.jogasok',
  'bkJoga.about'
])

.config( function myAppConfig ( $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/alkalmak' );
})

.run(function($rootScope, $state, $stateParams, $httpBackend) {
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
})

.factory( 'Global', function( $resource ){
  var Jogas = $resource('/jogasok/:id/:action', {
    'id': '@_id', 
    'action': '@action'
  }, {
    'ujBerlet': {'method': 'POST', 'params': {'action': 'ujBerlet'}}
  });
  var jogasok = Jogas.query(function(data, hrds) {
    console.log('success');
  }, function(){
    console.log('error');
  });
  return {
    getJogasok: function() {
      return jogasok;
    },
    addJogas: function(jogas) {
      jogas = new Jogas(jogas);
      return jogas.$save(function(value, hdrs){
        jogasok.push(value);
      });
    }
  };
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | bkJoga' ;
    }
  });
})

;