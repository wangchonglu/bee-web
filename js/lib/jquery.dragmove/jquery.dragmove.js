/**
 * Created by chonglu.wang on 2015/9/9.
 */
;
(function ($) {
    $.fn.dragmove = function ($box) {
        return this.each(function () {
            var $this = $(this),
                active,
                startX,
                startY;
            $box = $box == undefined ? $box = $this : $box;
            $this.on('mousedown touchstart', function (e) {
                $this.get(0).click();
                active = true;
                startX = e.originalEvent.pageX - $this.offset().left;
                startY = e.originalEvent.pageY - $this.offset().top;
                if (window.mozInnerScreenX == null)
                    return false;
            });
            $(document).on('mousemove touchmove', function (e) {
                if (active) {
                    $box.offset({
                        left: e.originalEvent.pageX - startX,
                        top: e.originalEvent.pageY - startY
                    });
                }
            }).on('mouseup touchend', function () {
                active = false;
            });
        });
    };
})(jQuery);