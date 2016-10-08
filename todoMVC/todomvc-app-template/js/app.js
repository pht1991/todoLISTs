(function (angular) {
	'use strict';

// Your starting point. Enjoy the ride!

	var myToDoMvc = angular.module("myToDoMvc", []);

	myToDoMvc.controller("MainController", ["$scope", "$location", function ($scope, $location) {
		//[1]文本框需要绑定一个模型,记录输入的内容
		//去index绑定text
		$scope.text = "";

		//构造任务列表的数据
		//每一个任务的数据结构:{id:1, text:"", completed:true}
		//这些任务列表的数据最好使用一个数组保存
		$scope.todos = [
			{id: 1, text: "学习", completed: true},
			{id: 2, text: "吃饭", completed: false},
			{id: 3, text: "睡觉", completed: false}
		];

		//[2]编辑完按回车键添加一个事件
		$scope.add = function () {

			function getId() {
				return Math.random();
			}
			//思路就是往todos push一个备忘对象
			if ($scope.text != "") {

				$scope.todos.push({
					//如何添加一个id,让id称为unique?
					//$scope.todos.length + 1 自动增长
					// id: $scope.todos.length + 1,//但是这样子有一个问题
					id: getId(),
					text: $scope.text,
					completed: false
				});
				//push完之后滞空text
				$scope.text = "";

				console.log($scope.todos[$scope.todos.length-1].id);
			}
		};

		//[3]还剩下多少未完成
		$scope.itemLeft = function () {
			var count = 0;
			for (var i = 0, len = $scope.todos.length; i < len; i++) {
				if (!$scope.todos[i].completed) {
					count++;
				}
			}
			return count;
		};

		//[4]移除删除  点击后面的X  splice删除数组里的某一个元素
		$scope.remove = function (id) {
			//删除谁,我们就传进来一个id,然后去匹配id
			//解决id的bug?
			for (var i = 0, len1 = $scope.todos.length; i < len1; i++) {
				if (id === $scope.todos[i].id) {
					$scope.todos.splice(i, 1);//删除那个元素
					for (var j = 0, len2 = $scope.todos.length; j < len2; j++){
						$scope.todos[j].id = j;
					}
					break;
				}
			}
		};

		//按钮隐藏
		$scope.existCompleted = function () {
			for (var i = 0, len = $scope.todos.length; i < len; i++){
				if ($scope.todos[i].completed){
					return true;
				}
			}
			return false;
		};

		//[5]点击删除已完成的内容
		$scope.clearCompleted = function () {
			var result = [];

			for (var i = 0, len = $scope.todos.length; i < len; i++){
				if (!$scope.todos[i].completed){
					result.push($scope.todos[i]);
				}
			}
			$scope.todos = result;
		};

		//[6]双击编辑
		$scope.currentEditingId = -1;
		$scope.editing = function (id) {
			$scope.currentEditingId = id;
		};

		//回车退出编辑
		$scope.save = function () {
			$scope.currentEditingId = -1;
		};

		//[7]点击全选与取消全选
		var now = true;
		function getNow() {
			for(var i=0, len=$scope.todos.length; i<len; i++){
				if($scope.todos[i] === false){
					return true;
				}
			}
		}

		$scope.toggleAll = function () {
			for (var i = 0, len = $scope.todos.length; i < len; i++){
				$scope.todos[i].completed = now;
			}
			now = !now;
		};

		//[8]解决三个all active completed
		//console.log($location.$$path);
		//我们使用path方法,$$path认为这是一个内部属性,是私有的
		//console.log($location.path());
		$scope.$loca = $location;

		//[9]使用过滤器解决all active completed  的筛选问题

		//  /   /active  /completed
		$scope.selector = {completed: false};
		//监视hash值的改变
		$scope.$watch("$loca.path()", function (now, old) {

			console.log(now);
			switch (now){
				case '/active':
					$scope.selector = {completed: false};
					break;
				case '/completed':
					$scope.selector = {completed: true};
					break;
				default :
					$scope.selector = {};
					break;
			}
		});
		//严格筛选的比较函数
		$scope.equalCompare = function (actual, expected) {
			return actual === expected;
		}



	}])
})(angular);
