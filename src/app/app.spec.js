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
    var $httpBackend, Global;

    beforeEach( module('bkJoga') );
    beforeEach( function() {
      inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
      });

      $httpBackend.whenGET('/jogasok').respond([
          {id: 1, name: 'asdfasdf'}, 
          {id: 2, name: '2wrerwert'}
        ]);

      inject(function(_Global_) {
        Global = _Global_;
      });
    });

    it('getJogasok should return everyone', function() {
      $httpBackend.flush();
      expect(Global.getJogasok()).toEqual([]);
    });
  });
});
