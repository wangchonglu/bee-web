/**
 * Created by frey on 2015/9/15.
 */
define(function (require, exports, module) {



    function autoStepControl(options) {

        var settings = $.extend({
            onPre: undefined,
            onNext: undefined,
            onOk: undefined,
            isSkipStep: true
        }, options);

        var stepIndex = 1;

        var $myfStes = $(".mfy-step");
        var headerLength = $myfStes.find("header .header-step-list").width();
        var headerItems = $myfStes.find("header .header-step");
        var itemWidth = headerItems.width();
        var marginRight = (headerLength - (headerItems.length * headerItems.width())) / (headerItems.length - 1);
        $myfStes.find("header .header-step").css("margin-right", marginRight).last().css("margin-right", 0);

        //设置steps-contentBox的宽度
        var contentWidth = $myfStes.find(".steps-contentList").width();
        //$myfStes.find(".steps-contentBox").css("width", headerItems.length * contentWidth + 10);
        var $contentList =  $myfStes.find(".steps-contentList .steps-content");
        $contentList.css("width", headerLength).hide().first().show();

        $myfStes.find(".steps-line-active").animate({width: itemWidth + (marginRight / 2)}, 1000);

        var $steps = headerItems.find(".default");

        $myfStes.find(".footer-actions input:button").click(function () {
            var self = $(this);
            if (self.hasClass("mfy-steps-pre")) {
                var isValidate = settings.onPre(stepIndex);
                if (!isValidate) {
                    return;
                }
                stepIndex--;
            }
            if (self.hasClass("mfy-steps-next")) {
                var isValidate = settings.onNext(stepIndex);
                if (!isValidate) {
                    return;
                }
                stepIndex++;
            }
            if (self.hasClass("mfy-steps-ok")) {
                settings.onOk();
            }
            if (stepIndex < 1) {
                stepIndex = 1;
                return;
            }
            if (stepIndex > headerItems.length) {
                stepIndex = headerItems.length;
                return;
            }
            stepMove();
        });

        if (settings.isSkipStep) {
            headerItems.click(function () {
                var currentIndex = stepIndex;
                stepIndex = $.inArray(this, headerItems) + 1;
                var isValidate = settings.onSkipStep(currentIndex);
                if (!isValidate) {
                    return;
                }
                stepMove();
            });
        }

        var stepMove = function () {

            var lineWidth = (marginRight * (stepIndex) ) - (marginRight / 2) + (itemWidth * stepIndex);
            if (lineWidth > headerLength) {
                lineWidth = headerLength;
            }

            var $activeLines = $myfStes.find(".steps-line-active");
            $activeLines.animate({width: lineWidth}, {
                duration: 1000,
                progress: function () {
                    headerItems.each(function (i, step) {
                        var $stepBox = $(step);
                        var boxLeft = $stepBox.position().left;
                        if ($activeLines.width() >= boxLeft) {
                            $stepBox.find(".default").addClass("active");
                        }
                        if ($activeLines.width() < boxLeft) {
                            $stepBox.find(".default").removeClass("active");
                        }
                    });
                }
            });

            // $myfStes.find(".steps-contentBox").animate({"marginLeft": (0 - headerLength) * (stepIndex - 1)}, 1000);
            $contentList.slideUp(function () {
                $contentList.eq(stepIndex-1).slideDown("fast");
            });
        }

        require.async("jqueryRollbar", function () {
            $(" .mfy-step .steps-contentList .steps-content").perfectScrollbar();
        });

    }

    module.exports = autoStepControl;

});