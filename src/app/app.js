angular.module( 'bkJoga', [
  'ngResource',
  'ui.bootstrap',
  'ui.router',
  'templates-app',
  'templates-common',
  'bkJoga.alkalmak',
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
  Jogas.prototype.berlet = function() {
    var now = Date.now();
    var isValid = function(berlet) {
      if (this.alkalmak > 0 && this.felhasznalva.length >= this.alkalmak) {
        return false;
      } else if (this.alkalmak === 0 && (this.start_date > now || this.end_date < now)) {
        return false;
      } else {
        return true;
      }
    };
    for(var i=0; i<this.berletek.length; i++) {
      if( isValid(this.berletek[i]) ) {
        return this.berletek[i];
      }
    }
    return false;
  };
  Jogas.prototype.toString = function() {
    return this.name + " (" + (this.nick ? this.nick + ', ' : '') + "bérlet: " + (this.berlet() ? "van" : "nincs") + ")";
  };
  var jogasok = Jogas.query();
  return {
    current_user: window.user,
    Jogas: Jogas,
    getJogasok: function() {
      return jogasok;
    },
    addJogas: function(jogas, cb) {
      jogas = new Jogas(jogas);
      return jogas.$save(function(value, hdrs){
        // jogasok = Jogas.query();
        jogasok.push(value);
        if(typeof cb !== 'undefined') {
          cb(value, hdrs);
        }
      });
    },
    jogatartok: [
      { name: 'Gopi' },
      { name: 'Kecske' },
      { name: 'Lakshmi' },
      { name: 'Nyuszi' },
      { name: 'Pocok' },
      { name: 'Paci' },
      { name: 'Sisi' }
    ],
    varosok: [
      { name: 'Budapest, Király utca'},
      { name: 'Szeged, Takarékpénztár utca'}
    ]
  };
})

.directive( 'jogas', function() {
  return {
    restrict: 'E',
    controller: function($scope) {
      this.getInfo = function(){
        console.log('calculating info');
      };
    },
    scope: {
      jogas: '='
    },
    templateUrl: 'jogasok/jogas.directive.tpl.html'
  };
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location, Global ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | bkJoga' ;
    }
  });
  $scope.user = Global.current_user;
})
;