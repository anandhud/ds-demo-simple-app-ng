angular
.module( 'ds-demo', [] )
.service( 'deepstream', function() {
	var client = deepstream( 'localhost:6020' )
		client.login({ username: 'ds-simple-input-' + client.getUid() });
	return client;
})
.controller( 'user', function( deepstream, $scope ) {

	function User() {
		this.record = deepstream.record.getAnonymousRecord();
		this.getField = getField.bind(this, this.record);
		this.firstname = this.getField( 'firstname' );
		this.lastname = this.getField( 'lastname' );
		this.title = this.getField( 'title' );
		this.street = this.getField( 'street' );
		this.number = this.getField( 'number' );
		this.postcode = this.getField( 'postcode' );
		this.city = this.getField( 'city' );
	}
	User.prototype.showUser = function( recordName ) {
		this.record.setName( recordName );
	};
	$scope.currentUser = new User();

	function Users() {
		this.record = deepstream.record.getList( 'users' );
		this.record.subscribe( this.updateEntries.bind( this ) );
		this.list = [];
	}
	Users.prototype.updateEntries = function( entries ) {
		this.list = [];
		for( var i=0; i < entries.length; i++) {
				var record = deepstream.record.getRecord( entries[i] );
				record.subscribe(function() { if (!$scope.$$phase) $scope.$apply(); });
				this.list.push( record );
		}
		if (!$scope.$$phase) $scope.$apply();
	}
	Users.prototype.addUser = function( ) {
		var name = 'users/' + deepstream.getUid();
		var record = deepstream.record.getRecord( name );
		record.set({
			firstname: 'New',
			lastname: 'User',
			title: '-'
		});
		this.record.addEntry( name );
	};
  Users.prototype.deleteUser = function( recordName ) {
		this.record.removeEntry( recordName );
	};
	$scope.users = new Users();

	function getField( record, name ) {
		var self = this;
		Object.defineProperty(self, name, {
			get: function() { return self.record.get( name); },
			set: function(newValue) {
				if (newValue===undefined) return;
				self.record.set( name, newValue);
				return newValue;
			}
		});
		record.subscribe(name, function( value ) {
			if (!$scope.$$phase) $scope.$apply();
		});
	}
});
