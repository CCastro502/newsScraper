document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems, {
        direction: 'up'
    });
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