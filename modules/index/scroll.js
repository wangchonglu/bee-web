$(function () {
    ;(function () {
        var deviceWidth = $(window).width();
        $(".banners,.box,.banner-item,.banner-box").width(deviceWidth);
        var itemSize = 1;
        var itemWidth =deviceWidth;
        var translation = itemSize * itemWidth;
        var $list = $(".banner-list");
        var direction = "right";
        var timer;

        $(".banners").on("click", "#btnPre", function () {
            direction = "left";
            AutoScroll();
        });

        $(".banners").on("click", "#btnNext", function () {
            direction = "right";
            AutoScroll();
        });

        $list.on({
            mouseover: function () {
                $(this).stop(true,false);
                clearInterval(timer);
            },
            mouseleave: function () {
                AutoScroll();
                startTimer();
            }
        });

        function AutoScroll() {
            if (!$list.is(":animated")) {
                if (direction == "right") {
                    $list.animate({"margin-left": 0 - translation}, "slow", function () {
                        $list.css("margin-left", "0px").find(".banner-item").first().appendTo(this);
                    });
                } else {
                    $list.css("margin-left", 0 - translation).find(".banner-item").last().prependTo($list);
                    $list.animate({"margin-left": 0}, "slow");
                }
            }
        }

        function startTimer() {
            timer = setInterval(function () {
                AutoScroll();
            }, 2000);
        }
        startTimer();
    })();
});