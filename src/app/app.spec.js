describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    var AppCtrl, $location, $scope;

    beforeEach( module( 'bkJoga' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
    }));

    it( 'should pass a dummy test', inject( function() {
      expect( AppCtrl ).toBeTruthy();
    }));
  });

  describe( 'Global Service: ', function() {

    beforeEach( module('bkJoga') );
    beforeEach( inject(function($httpBackend) {
      $httpBackend.whenGET('/jogasok').respond([
        {id: 1, name: 'asdfasdf'}, 
        {id: 2, name: '2wrerwert'}
      ]);
    }));

    it('getJogasok should return everyone', inject(function(Global) {
      expect(Global.getJogasok()).toEqual([]);
    }));
  });
});
