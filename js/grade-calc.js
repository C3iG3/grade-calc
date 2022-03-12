(($) => {
    const $gradebook = $('.gradebook');
    const $gradebook_points = $gradebook.find('input');
    const $gradebook_total = $gradebook.find('.js-total');

    const $calc = $('.calc');
    const $calc_points = $calc.find('input');
    const $calc_grade = $calc.find('.js-grade');

    $gradebook_points.change(function () {
        $gradebook_total.html(gradebook_total());
    });

    $calc_points.change(function () {
        $calc_grade.html(calc_grade());
    });

    $gradebook_points.change(function () {
        const $calc_point = $calc_points.filter(`[name="${this.name}"]`);
        const $calc_container = $calc_point.closest('.js-container');

        $calc_point.attr('max', $(this).val());

        $calc_point.change();

        if ($(this).val() > 0) {
            $calc_container.find('.js-denominator').html($(this).val());
            $calc_container.show();
        } else {
            $calc_container.hide();
        }

        if (gradebook_total() !== 0) {
            $calc.show();
        } else {
            $calc.hide();
        }
    });

    $gradebook_points.change(function () {
        $gradebook_points.each(function () {
            const $gradebook_container = $(this).closest('.js-container');

            if ($(this).val() > 0) {
                let gradebook_point_perc = 0;

                switch (this.name) {
                    case 'product': gradebook_point_perc = 50; break;
                    case 'process': gradebook_point_perc = 30; break;
                    case 'practice': gradebook_point_perc = 20; break;
                }

                let final_perc = (gradebook_point_perc / total_perc()) * 100 / parseInt($(this).val());
                
                console.log(final_perc)
                $gradebook_container.find('.js-point-perc').html(final_perc);
            } else {
                $gradebook_container.find('.js-point-perc').html(0);
            }


        });
    });

    $calc_points.change(function () {
        const $calc_container = $(this).closest('.js-container');

        $calc_container.find('.js-numerator').html($(this).val());
    });

    function gradebook_total() {
        return $gradebook_points.toArray().reduce(
            (sum, el) => sum + parseInt(el.value),
            0
        );
    }

    function total_perc() {
        const product_total = parseInt($gradebook_points.filter('[name="product"]').val());
        const product_perc = product_total > 0 ? 50 : 0;

        const process_total = parseInt($gradebook_points.filter('[name="process"]').val());
        const process_perc = process_total > 0 ? 30 : 0;

        const practice_total = parseInt($gradebook_points.filter('[name="practice"]').val());
        const practice_perc = practice_total > 0 ? 20 : 0;

        return product_perc + process_perc + practice_perc;
    }

    function calc_grade() {
        const product_total = parseInt($gradebook_points.filter('[name="product"]').val());
        const product_calc = parseInt($calc_points.filter('[name="product"]').val());
        const product_perc = product_total > 0 ? 50 : 0;

        const process_total = parseInt($gradebook_points.filter('[name="process"]').val());
        const process_calc = parseInt($calc_points.filter('[name="process"]').val());
        const process_perc = process_total > 0 ? 30 : 0;

        const practice_total = parseInt($gradebook_points.filter('[name="practice"]').val());
        const practice_calc = parseInt($calc_points.filter('[name="practice"]').val());
        const practice_perc = practice_total > 0 ? 20 : 0;

        const total_perc = product_perc + process_perc + practice_perc;

        let grade = 0;

        grade += product_total > 0 ? (product_calc / product_total) * (product_perc / total_perc) : 0;
        grade += process_total > 0 ? (process_calc / process_total) * (process_perc / total_perc) : 0;
        grade += practice_total > 0 ? (practice_calc / practice_total) * (practice_perc / total_perc) : 0;
        
        return grade * 100;
    }
})(jQuery);