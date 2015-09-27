export default ngModule => {
    ngModule.directive('hello', function($log) {
        require('./hello.css');
        return {
            restrict: 'E',
            $scope: {},
            template: require('./hello.html'),
            controllerAs: 'vm',
            controller: function() {
                var vm = this;

                vm.greeting = 'I\'m working inside the directive';
                $log.info('Successfully loaded directive');
            }
        }
    })
};