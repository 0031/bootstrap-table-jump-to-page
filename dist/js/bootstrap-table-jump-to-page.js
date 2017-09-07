/**
 * @author 0031
 * boostrap-table 分页跳转扩展
 * 建议引入t4t5/sweetalert, 提示效果更理想
 */
(function ($) {
    'use strict';
    // 默认参数
    var defaults = {
        // 是否显示跳转到多少页
        showJumpToPage: false
    };

    // 继承bootstrapTable.defaults/icons/locales参数
    $.extend($.fn.bootstrapTable.defaults, defaults);
    $.extend($.fn.bootstrapTable.locales, {
        formatJumpToPage: function (pageNumber) {
            return '跳转到第' + pageNumber + '页';
        }
    });
    $.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales);

    // 获取构造器与toolbar
    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initPagination = BootstrapTable.prototype.initPagination;

    // 扩展pagination
    BootstrapTable.prototype.initPagination = function () {
        this.showJumpToPage = this.options.showJumpToPage;

        _initPagination.apply(this, Array.prototype.slice.apply(arguments));

        // 显示
        if (this.options.showJumpToPage && this.options.totalPages > 5) {
            // 找到dom元素
            var that = this,
                $paginationDetail = that.$pagination.find('.pagination-detail'),
                $jumpTo = $paginationDetail.find('span.pagination-jump-to');

            // 如果该元素不存在，则新建
            if (!$jumpTo.length) {
                $jumpTo = $([
                    '<span class="pagination-jump-to" style="margin: 0 5px">',
                    this.options.formatJumpToPage('<input type="text" class="form-control" style="width: 60px;height:30px;display:inline-block;"/>'),
                    '</span>'].join('')).appendTo($paginationDetail);

                var error = function (msg) {
                    if (typeof swal == 'function') {
                        setTimeout(function () {
                            swal('抱歉', msg, 'error');
                        }, 500);
                    } else {
                        alert(msg);
                    }
                };

                // 输入框值发生改变
                $jumpTo.find('input').on('change', function () {
                    var num = $.trim($(this).val());
                    // 合法数字
                    if (!/^[-+]?[0-9]+$/.test(num)) {
                        error('页码必须为数字');
                        return;
                    }
                    // 合法范围
                    if (num <= 0 || num > that.options.totalPages) {
                        error('正确的页码应该是1-' + that.options.totalPages);
                        return;
                    }
                    // 跳转到该页
                    that.options.pageNumber = parseInt(num);
                    // 重新获取数据更新分页
                    that.updatePagination();
                });

                // 输入框值发生改变
                $jumpTo.find('input').on('keydown', function (e) {
                    // 阻止事件继续冒泡
                    e.stopImmediatePropagation();
                    if (e.keyCode == 13) {
                        // 触发blur，失去焦点，自动触发change
                        $(this).trigger('blur');
                    }
                });
            }
        }
    };
})(jQuery);
