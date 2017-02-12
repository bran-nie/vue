<template>
	<div id="secondcomponent">
		<h1>I am another page</h1>
		<a href="">written by {{author}} </a>
		<p>为自己<a href="http://">学习vue</a>而加油</p>
		<ul>
			<li v-for="article in articles">
				电影名字：{{article.title}}, <br>
				上映年份：{{article.year}}
				<br> <br>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				author: "二月还有二十天",
				articles: []
			}
		},
		mounted: function () {
			this.$http.jsonp('https://api.douban.com/v2/movie/top250?count=16', {}, {
				heasers: {

				},
				emulateJSON: true
			}).then(function(response){
				//这里是处理正确的回调
				this.articles = response.data.subjects;
				console.log(this.articles)

				// this.articles = response.data["sunjects"]  也可以
			},function (response) {
				// 这里是处理错误的回调
				console.log(response)
			} )
		}
	}
</script>

<style>
	
</style>