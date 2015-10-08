(function(){
	angular.module(imgame.service)
	.factory('Review', function Review($http){
		function createReview(review){
			return $http({
        method: 'POST',
        url: '/gameposts/'+review.gamepost_id+ '/reviews',
        data: review
      }).then(function(resp){
        return resp.data;
      });
		}
	})
})