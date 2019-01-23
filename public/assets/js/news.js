document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'up'
    });
});

$(document).ready(function () {

    console.log(window.location.href.split("/")[3]);

    switch (window.location.href.split("/")[3]) {
        case '':
            $("#news-org").text("Saved Articles");
            break;
        case 'counterpunch':
            $("#news-org").text("Counterpunch Articles");
            break;
        case 'intercept':
            $("#news-org").text("Intercept Articles");
            break;
        case 'democracynow':
            $("#news-org").text("DemocracyNow Articles");
            break;
    }

    $("button.save").on("click", function () {
        // console.log($("#" + $(this).val()).text().trim());
        // console.log($("#" + $(this).val()).find("a").attr("href"));
        var obj = {
            title: $("#" + $(this).val()).text().trim(),
            link: $("#" + $(this).val()).find("a").attr("href")
        }
        // $.ajax({
        //     type: "POST",
        //     url: "/save/" + $(this).val(),
        //     data: obj
        // })
        $.ajax({
            method: "POST",
            url: "/save/" + $(this).val(),
            data: obj
        }).then(data => {
            alert(`You saved the article`);
            $(this).parent().empty();
        });
    })

    $("button.delete").on("click", function () {

        console.log($(this).val());
        $.ajax({
            method: "DELETE",
            url: "/delete/" + $(this).val(),
            data: {
                row: $(this).val()
            }
        }).then(data => {
            window.location.reload();
        }).catch(err => console.log(err));
    })



});

// $(document).ready(function() {
//     $.ajax({
//         type: 'DELETE',
//         url: '/',
//         success: function(response) {
//             if (response == 'error') {
//                 console.log('Err!');
//             }
//             else {
//                 alert('Success');
//                 location.reload();
//             }
//         }
//     });
// })