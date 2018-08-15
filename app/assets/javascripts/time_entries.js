function loadDataTable () {
        $("#time-entries-table").dataTable({
            "pageLength": -1,
            "order": [[ 0, "desc" ]],
            "columnDefs": [
              { "orderable": false, "targets": [1,2,3,5] }
            ]
        });
        document.getElementById("time-entries-table_length").innerHTML = "<a data-keybinding=\"n\" href=\"/time_entries/new\"><button type=\"button\" class=\"btn btn-success\">Add time entry</button></a>";
}

$(function() {
  var hideOrShowFields = function() {
    const checked = $("#time_entry_running").is(':checked');

    const elements_to_update = [
      $('#time_entry_duration').parent(),
      $('#time_entry_result').parent()
    ];

    if (checked) {
      elements_to_update.forEach(element => element.hide());
    } else {
      elements_to_update.forEach(element => element.show());
    }
  }

  $(document).on("turbolinks:load", function() {
    hideOrShowFields();
    $('#te_datetimepicker').datetimepicker();
    $('input[name="time_entry[running]"]').change(hideOrShowFields);
  })
});

(function poll(){
  setTimeout(function() {
    var filterDate = $('.js-update-entries').data('filterDate');

    if (filterDate) {
      $.get({
        url: '/time_entries/updates_all_time_entries',
        data: { date: filterDate },
        complete: function(data) {
          var search_text = document.getElementById("time-entries-table_filter").children[0].children[0].value;
          $('.js-update-entries').html(data.responseText);
          loadDataTable();
          var tbl = $("#time-entries-table").DataTable();
          tbl.search(search_text).draw();
          poll();
        },
        timeout: 60000 });
    }
  }, 60000);
})();
