/*弹出框*/

var tan = {
  init: function () {
    var lis = $(".nav-left>li,.nav-menu>li");
    $.each(lis, function () {
      $(this).hover(function () {
        $(this).children("a").addClass("hover");
        $(this).children("div").slideDown(200);
        $(this).children("ul").show();
      }, function () {
        $(this).children("a").removeClass("hover");
        $(this).children("div").hide();
        $(this).children("ul").hide();
      })
    })
  }
};

var pic_tan = {
  init: function (obj, url, type) {
    var lis = $(obj + " .right-panel li");
    $.each(lis, function (i) {
      $(this).hover(function () {
        $(obj + " .right-panel>div").css({
          "background-image": "url('img/" + url + (i + 1) + "." + type + "')",
          "display": "block"
        });
      }, function () {
        $(obj + " .right-panel>div").css("display", "none");
      });
    })
  }
};

/*轮播广告*/

var imgs1 = [
  {"i": 0, "img": "img/carousel01.jpg", "title": "假期里的警察叔叔们~"},
  {"i": 1, "img": "img/carousel02.jpg", "title": "共赴统一阿萨姆好心情之旅"},
  {"i": 2, "img": "img/carousel03.jpg", "title": "BML广州登录倒计时！"},
  {"i": 3, "img": "img/carousel04.jpg", "title": "火灾与争吵乃江户之花"},
  {"i": 4, "img": "img/carousel05.jpg", "title": "网飞与他热爱的复古。"}
];

var imgs2 = [
  {"i": 0, "img": "img/r-carousel1.jpg", "title": "前所未有的大战"},
  {"i": 1, "img": "img/r-carousel2.jpg", "title": "拯救人理"},
  {"i": 2, "img": "img/r-carousel3.jpg", "title": "化为熊熊烈火吧"}
];

var imgs3 = [
  {"i": 0, "img": "img/r-guochuang1.jpg", "title": "画江湖之不良人"},
  {"i": 1, "img": "img/r-guochuang2.jpg", "title": "我家大师兄脑子有坑 特别篇"}
];

function Carousel() {
  this.DURATION = 100;
  this.WAIT = 4000;
  this.STEPS = 30;
  this.liwidth = null;
  this.timer = null;
  this.canAuto = true;
  this.IMGS = null;
  this.OBJ = null
}

Carousel.prototype.init = function (obj, imgs) {
  var self = this;
  self.OBJ = obj;
  self.IMGS = [];
  for (var i = 0; i < imgs.length; i++) {
    self.IMGS[i] = imgs[i];
  }
  var style = getComputedStyle($(self.OBJ)[0]);
  self.liwidth = parseInt(style.width);
  var titles = [], indexs = [];
  $.each(self.IMGS, function (i) {
    titles[i] = "<li><a href='#'>" + self.IMGS[i].title + "</a></li>";
    indexs[i] = "<span></span>";
  });
  $(self.OBJ).find("ul.title").html(titles.join(""));
  $(self.OBJ).find("ul.index").html(indexs.join(""));
  self.updateView();
  //当鼠标进入广告区域时，禁用或启用自动轮播
  $(self.OBJ).hover(function () {
    self.canAuto = false;
  }, function () {
    self.canAuto = true;
  });
  self.autoMove();
  $(self.OBJ + " ul.index").click(function () {
    var e = window.event || arguments[0];
    var target = e.srcElement || e.target;
    if (target.nodeName == "SPAN" && $(target).index() != self.IMGS[0].i) {
      $(self.OBJ + " ul.index span.on").removeClass();
      $(target).addClass("on");
      //计算移动个数n：target的内容-1-imgs数组中第一个元素的i属性，保存在变量n中
      var n = $(target).index() - self.IMGS[0].i;
      self.move(n);
    }
  });
}

Carousel.prototype.updateView = function () {//只负责刷新图片顺序，与位置无关
  var self = this;
  $(self.OBJ).find("ul.pic").css("width", self.liwidth * self.IMGS.length + "px");
  var pics = []/*, titles = [], indexs = []*/;
  $.each(self.IMGS, function (i) {
    pics[i] = "<li><a href='#'><img src='" + self.IMGS[i].img + "'></a></li>";
  });
  $(self.OBJ).find("ul.pic").html(pics.join(""));
  $(self.OBJ).find("ul.title a.on").removeClass("on");
  $(self.OBJ).find("ul.index span.on").removeClass("on");
  $(self.OBJ).find("ul.title a")[self.IMGS[0].i].className = "on";
  $(self.OBJ).find("ul.index span")[self.IMGS[0].i].className = "on";
}

// 自动轮播
Carousel.prototype.autoMove = function () {
  var self = this;
  self.timer = setTimeout(function () {
    if (self.canAuto) {
      self.moveStep(1);
    } else {
      self.autoMove();
    }
  }, self.WAIT);
}

//移动
Carousel.prototype.moveStep = function (n) {
  var self = this;
  var step = self.liwidth * n / self.STEPS;
  var style = getComputedStyle($(self.OBJ + " ul.pic")[0]);
  var left = parseFloat(style.left) - step;
  $(self.OBJ + " ul.pic")[0].style.left = left + "px";
  if (n > 0 && left > -self.liwidth * n || n < 0 && left < 0) {//移动未完成
    self.timer = setTimeout(function () {
      self.moveStep(n);
    }, self.DURATION / self.STEPS);
  } else {//移动完毕
    $(self.OBJ + " ul.pic")[0].style.left = "0px";//定时器为了表现动画效果，这里还原到原来位置，下面才是改变图片顺序
    self.autoMove();
    if (n > 0) {//左移
      self.IMGS = self.IMGS.concat(self.IMGS.splice(0, n));
      self.updateView();
    }
  }
}

Carousel.prototype.move = function (n) {
  var self = this;
  clearTimeout(self.timer);
  self.timer = null;
  if (n < 0) {
    self.IMGS = self.IMGS.splice(self.IMGS.length + n, -n).concat(self.IMGS);
    self.updateView();
    $(self.OBJ + " ul.pic")[0].style.left = n * self.liwidth + "px";
  }
  self.moveStep(n);
}

var carousel1 = new Carousel();
var carousel2 = new Carousel();
var carousel3 = new Carousel();

//排行切换
var rank_head = {
  init: function () {
    $(".rank-tab .tab-item").mouseover(function () {
      $(this).siblings(".tab-item.on").removeClass("on");
      $(this).addClass("on");
      $(this).parents(".rank").children(".rank-list-wrap").css("margin-left", -$(this).index() * 100 + "%");
    })
  }
}

var rank_time = {
  init: function () {
    $(".rank .dropdown-item").click(function () {
      $(this).siblings(".dropdown-item").css("display", "block");
      $(this).css("display", "none");
      $(this).parent().siblings("span.selected").text($(this).text());
    })
  }
}

var footer_link = {
  init: function () {
    $("#footer div.link-c a").hover(function () {
      $(this).siblings().children("div.qrcode.on").removeClass("on");
      $(this).children("div.qrcode").addClass("on");
    }, function () {
      $("div.qrcode.on").removeClass("on");
    });
  }
}

var safe = {
  init: function () {
    var timer = setInterval(function () {
      $("#footer img.websafe2")[0].style.opacity = $("#footer img.websafe2")[0].style.opacity == 1 ? 0 : 1;
    }, 4000);
  }
}

//为所有元素添加获得页面距顶部距离的方法，返回一个top值
HTMLElement.prototype.getElementTop = function () {
  var top = this.offsetTop;//当前元素距父元素顶部距离
  var curr = this.offsetParent;//当前元素的相对定位父元素对象
  while (curr != null) {
    top += curr.offsetTop;
    curr = curr.offsetParent;
  }
  return top;
}

var aside = {
  init: function () {
    var self = this;
    window.addEventListener("scroll", function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop > 100) {
        $("#elevator").css("top", "0px");
      } else {
        $("#elevator").css("top", "232px");
      }
      $(".zone-module").each(function (i, domEle) {
        var zoneTop = domEle.getElementTop();
        var height = parseInt(getComputedStyle(domEle).height);
        if (zoneTop < scrollTop + 200) {
          $($("#elevator .item")[i + 1]).addClass("on");
          $($("#elevator .item")[i + 1]).siblings().removeClass("on");
        }
      })
    }, false)
  }
}

var app_download = {
  init: function () {
    var x = 0;
    var timer = null;
    $(".app-icon").hover(function () {
      $(".app-tips").fadeIn(300);
      clearInterval(timer);
      timer=null;
      timer = setInterval(function () {
        x -= 80;
        $(".app-icon").css("background-position-x", x + "px");
        x == -1200 && (x = -640);
      }, 100);
    }, function () {
      $(".app-tips").fadeOut(300);
      clearInterval(timer);
      timer=null;
        timer=setInterval(function () {
          x+=80;
          $(".app-icon").css("background-position-x", x + "px");
          if(x==0){
            clearInterval(timer);
            timer=null;
          }
        },100);
    });
  }
}

$(function () {
  tan.init();
  pic_tan.init(".game-center", "game", "png");
  pic_tan.init(".comic", "comic-list", "jpg");
  carousel1.init("#section-top>div.carousel-box", imgs1);
  carousel2.init("#fanju .r-carousel", imgs2);
  carousel3.init("#guochuang .slider-img", imgs3);
  rank_head.init();
  rank_time.init();
  footer_link.init();
  safe.init();
  aside.init();
  app_download.init();
});




