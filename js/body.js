$(function(){function i(i){this.activeSlideIdx,this.slideTimerId,this.slides=i.children(".slide");var e=0,t=0;this.slides.each(function(i){$(this).innerHeight()>e&&(e=$(this).innerHeight(),t=i)}),this.slides.eq(t).css("position","static"),this.slideTo(0)}function e(i){return 500+500*i/o.innerHeight()}function t(){s.stop(),s.animate({scrollTop:0},e(o.scrollTop()))}function n(i){s.stop();var t=i.offset().top;i.innerHeight()<o.innerHeight()&&(t+=i.innerHeight()/2-o.innerHeight()/2),s.animate({scrollTop:t},e(Math.abs(o.scrollTop()-t)))}var s=$("html, body"),o=$(window);i.prototype={slideTo:function(i){this.slides.eq(this.activeSlideIdx).removeClass("active"),this.slides.eq(i).addClass("active"),this.activeSlideIdx=i},slide:function(){this.slideTo((this.activeSlideIdx+1)%this.slides.length)},autoSlide:function(){var i=this;this.slideTimerId=setInterval(function(){i.slide()},5e3)}},$(".slideshow").each(function(){var e=new i($(this));e.autoSlide()});var a,l=function(){var i=[];return $("#nav").find("a").each(function(){var e=$(this),s=e.attr("href"),o=$(s);i[s.substring(1)]=e,"#home"===s?e.click(function(i){i.preventDefault(),t()}):e.click(function(i){i.preventDefault(),n(o)})}),i}();o.scroll(function(){var i=document.elementFromPoint(221,o.innerHeight()/2);i.id!==a&&(null!=l[a]&&l[a].removeClass("active"),a=i.id,l[a].addClass("active"))});var r=$("#home"),c=$("#go"),h=$("#about"),d=parseInt(r.innerHeight(),10),u=parseInt(r.css("min-height"),10),v=d+parseInt($("about").innerHeight()/2-o.innerHeight()/2,10);c.click(function(i){i.preventDefault(),n(h)}),o.scroll(function(){o.scrollTop()>v?c.addClass("active"):c.removeClass("active");var i=Math.min(d-u,o.scrollTop());r.css("margin-top",i),r.innerHeight(d-i)})});