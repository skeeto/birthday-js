function drawYear(canvas, year, conception, birth, today) {
    var ctx = canvas.getContext('2d');
    var size = 6, header = size * 3, pad = 2;
    canvas.width = 31 * size;
    canvas.height = 12 * size + header + pad;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = header + 'px "Lucida Console", Monaco, monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(year, 0, 0);

    for (var month = 0; month < 12; month++) {
        for (var day = 1, date = new Date(year, month, day);
             date.getMonth() === month;
             date = new Date(year, month, ++day)) {
            var x = (day - 1) * size;
            var y = month * size + header + pad;
            if (date >= birth && date <= today) {
                ctx.fillRect(x, y, size / 2, size / 2);
            } else if (date >= conception && date < birth) {
                for (var i = 0; i < size / 2; i++) {
                    ctx.fillRect(x + i, y + i, 1, 1);
                }
            } else {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }
}

function draw(birth) {
    /* Compute important dates: conception, birth, today. */
    var gestation = 276.5 * 24 * 60 * 60 * 1000;
    var conception = new Date(birth - gestation);
    var today = new Date();

    /* Compute start and end years. */
    var first = Math.floor(conception.getFullYear() / 5) * 5 - 5;
    var last = Math.ceil((today.getFullYear() + 1) / 5) * 5 + 4;

    /* Compute age and display it. */
    var age = today.getFullYear() - birth.getFullYear() - 1;
    if (today.getMonth() > birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
         today.getDate() >= birth.getDate())) {
        age++;
    }
    $('#age').text('Number of Days Living at Age ' + age);

    /* Insert a canvas for each year. */
    var life = $('#life').empty();
    for (var year = first; year <= last; year++) {
        var canvas = $('<canvas/>');
        life.append(canvas);
        drawYear(canvas[0], year, conception, birth, today);
    }
}

$(document).ready(function() {
    var birth = location.search.match(/\?(\d+)-(\d+)-(\d+)/);
    if (birth === null) {
        var $year = $('form .year');
        var now = new Date().getFullYear();
        for (var year = now - 115; year <= now; year++) {
            var $option = $('<option>' + year + '</option>', {value: year});
            $year.append($option);
        }
        $year.val(1985);
        var $month = $('form .month');
        for (var month = 1; month <= 12; month++) {
            $option = $('<option>' + month + '</option>', {value: month});
            $month.append($option);
        }
        var $day = $('form .day');
        for (var day = 1; day <= 31; day++) {
            $option = $('<option>' + day + '</option>', {value: day});
            $day.append($option);
        }
        $('form').submit(function() {
            var year = $('form .year').val();
            var month = $('form .month').val();
            var day = $('form .day').val();
            window.location = '?' + year + '-' + month + '-' + day;
            return false;
        });
    } else {
        $('form').remove();
        draw(new Date(birth[1], birth[2] - 1, birth[3]));
    }
});
