$(document).ready(function () {
  let currentPage = 1;
  let pageSize = 10;
  let totalRows = 0;
  let filteredRows = [];
  let currentNoteRowId = null;
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  $(document).on("click", ".note-icon-btn", function (e) {
    e.preventDefault();
    const $row = $(this).closest("tr");
    currentNoteRowId = $row.attr("id");
    const note = $row.attr("data-note") || "";

    if (note) {
      $("#noteText").text(note).removeClass("empty");
    } else {
      $("#noteText").text("No note").addClass("empty");
    }

    $("#noteTextarea").val(note);
    $(".note-display").show();
    $(".note-edit-form").hide();
    $("#editNoteBtn").show();
    $("#saveNoteBtn").hide();
  });

  $("#editNoteBtn").click(function () {
    $(".note-display").hide();
    $(".note-edit-form").show();
    $(this).hide();
    $("#saveNoteBtn").show();
    $("#noteTextarea").focus();
  });
  $("#saveNoteBtn").click(function () {
    const $btn = $(this);
    const newNote = $("#noteTextarea").val().trim();
    const $row = $("#" + currentNoteRowId);
    const oldNote = $row.attr("data-note") || "";
    if (newNote === oldNote) {
      $("#noteModal").modal("hide");
      return;
    }
    const isNewRow = !$row.find(".title-input").attr("readonly");

    $row.attr("data-note", newNote);
    const $noteIcon = $row.find(".note-icon-btn");
    if (newNote) {
      $noteIcon
        .removeClass("no-note")
        .addClass("has-note")
        .attr("title", "View note");
    } else {
      $noteIcon
        .removeClass("has-note")
        .addClass("no-note")
        .attr("title", "Add note");
    }

    if (isNewRow) {
      if (newNote) {
        $("#noteText").text(newNote).removeClass("empty");
      } else {
        $("#noteText").text("No note").addClass("empty");
      }
      $("#noteModal").modal("hide");
      return;
    }
    $btn
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin"></i> Saving...');

    $.ajax({
      method: "PUT",
      url: "/api/update-note/" + currentNoteRowId,
      contentType: "application/json",
      data: JSON.stringify({ note: newNote }),
      success: function (response) {
        if (newNote) {
          $("#noteText").text(newNote).removeClass("empty");
        } else {
          $("#noteText").text("No note").addClass("empty");
        }

        $btn.html('<i class="fas fa-check"></i> Saved!');

        setTimeout(() => {
          $("#noteModal").modal("hide");
          $btn.prop("disabled", false).html('<i class="fas fa-save"></i> Save');
        }, 500);
      },
      error: function (xhr) {
        $row.attr("data-note", oldNote);
        if (oldNote) {
          $noteIcon.removeClass("no-note").addClass("has-note");
        } else {
          $noteIcon.removeClass("has-note").addClass("no-note");
        }

        $btn.prop("disabled", false).html('<i class="fas fa-save"></i> Save');
        alert(
          "Failed to save note: " + (xhr.responseJSON?.error || "Unknown error")
        );
      },
    });
  });

  function performSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();

    filteredRows = [];

    $("#tbfilter tbody tr.data-row").each(function () {
      const $row = $(this);
      const param = $row.find(".param input").val().toLowerCase();
      const name = $row.find(".title-input").val().toLowerCase();
      const url = $row.find(".urliframe input").val().toLowerCase();
      const note = $row.attr("data-note").toLowerCase();

      const matches =
        searchTerm === "" ||
        param.includes(searchTerm) ||
        name.includes(searchTerm) ||
        url.includes(searchTerm) ||
        note.includes(searchTerm);

      if (matches) {
        filteredRows.push($row);
      }
    });

    totalRows = filteredRows.length;

    if (totalRows === 0) {
      $("#noResults").show();
      $(".pagination-wrapper").hide();
    } else {
      $("#noResults").hide();
      $(".pagination-wrapper").show();
    }

    $("#totalRecordsHeader").text(totalRows);

    currentPage = 1;
    showPage(1);
  }

  $("#searchInput").on("keyup", function () {
    performSearch($(this).val());
  });

  function initPagination() {
    filteredRows = $("#tbfilter tbody tr.data-row")
      .toArray()
      .map((el) => $(el));
    totalRows = filteredRows.length;
    updatePagination();
    showPage(currentPage);
  }

  function updatePagination() {
    const totalPages = Math.ceil(totalRows / pageSize);

    const from = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const to = Math.min(currentPage * pageSize, totalRows);
    $("#showingFrom").text(from);
    $("#showingTo").text(to);
    $("#totalRecords").text(totalRows);

    const $pageNumbers = $("#pageNumbers");
    $pageNumbers.empty();

    if (totalPages === 0) return;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      const $pageBtn = $("<button>", {
        class: "btn-page" + (i === currentPage ? " active" : ""),
        text: i,
      });

      $pageBtn.click(function () {
        goToPage(i);
      });

      $pageNumbers.append($pageBtn);
    }

    $("#firstPage, #prevPage").prop("disabled", currentPage === 1);
    $("#nextPage, #lastPage").prop(
      "disabled",
      currentPage === totalPages || totalPages === 0
    );
  }

  function showPage(page) {
    currentPage = page;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    $("#tbfilter tbody tr").hide();

    for (let i = 0; i < filteredRows.length; i++) {
      const $row = filteredRows[i];

      if (i >= start && i < end) {
        $row.show();
      }
    }

    updatePagination();
  }

  function goToPage(page) {
    showPage(page);
  }

  $("#firstPage").click(function () {
    goToPage(1);
  });

  $("#prevPage").click(function () {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  });

  $("#nextPage").click(function () {
    const totalPages = Math.ceil(totalRows / pageSize);
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  });

  $("#lastPage").click(function () {
    const totalPages = Math.ceil(totalRows / pageSize);
    goToPage(totalPages);
  });

  $("#pageSize").change(function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    showPage(1);
  });

  initPagination();

  $("#Add").click(function () {
    let apikey = uuid();

    let newRow = $("<tr>", { id: apikey, class: "data-row", "data-note": "" });

    newRow.append(
      $("<td>").append(
        $("<input>", { type: "checkbox", name: "options[]", value: apikey })
      )
    );

    let paramCell = $("<td>", { class: "param" });
    let paramDiv = $("<div>", { class: "param-display" });
    paramDiv.append($("<span>").text("/"));
    paramDiv.append($("<input>", { name: "param", type: "text" }));
    paramCell.append(paramDiv);
    newRow.append(paramCell);

    let titleCell = $("<td>", { class: "title-cell" });
    let titleWithNote = $("<div>", { class: "title-with-note" });
    titleWithNote.append(
      $("<input>", { class: "title-input", name: "name", type: "text" })
    );

    let noteIconBtn = $("<button>", {
      class: "note-icon-btn no-note",
      title: "Add note",
      "data-toggle": "modal",
      "data-target": "#noteModal",
    });
    noteIconBtn.append($("<i>", { class: "fas fa-sticky-note" }));
    titleWithNote.append(noteIconBtn);

    titleCell.append(titleWithNote);
    newRow.append(titleCell);

    newRow.append(
      $("<td>", { class: "urliframe" }).append(
        $("<input>", { type: "url", name: "url" })
      )
    );

    let queryCell = $("<td>", { css: { "text-align": "center" } });
    queryCell.append(
      $("<input>", {
        type: "checkbox",
        class: "querystr-checkbox",
        name: "querystr",
      })
    );
    newRow.append(queryCell);

    let actionsCell = $("<td>");
    let actionButtons = $("<div>", { class: "action-buttons" });

    let saveBtn = $("<button>", {
      class: "btn-icon btn-save save",
      title: "Save",
    });
    saveBtn.append($("<i>", { class: "fas fa-save" }));

    let deleteBtn = $("<button>", {
      class: "btn-icon btn-delete delete",
      title: "Delete",
      "data-toggle": "modal",
      "data-target": "#deleteEmployeeModal",
    });
    deleteBtn.append($("<i>", { class: "fas fa-trash" }));

    actionButtons.append(saveBtn).append(deleteBtn);
    actionsCell.append(actionButtons);
    newRow.append(actionsCell);

    $("tbody").prepend(newRow);

    performSearch($("#searchInput").val());
    goToPage(1);

    $("#" + apikey + " .param input").focus();
  });

  $(document).on("change", ".querystr-checkbox", function () {
    var id = $(this).closest("tr").attr("id");
    if (!id) return;

    var isChecked = $(this).is(":checked");

    $.ajax({
      url: "/update-querystr",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id: id, querystr: isChecked }),
      success: function (response) {
        console.log("Querystr updated");
      },
    });
  });

  $("#tbfilter").on("click", ".save", function () {
    let idrow = $(this).closest("tr").attr("id");
    let $row = $("#" + idrow);
    let queryStrValue = $row.find('input[name="querystr"]').is(":checked");
    let name = $row.find(".title-input").val();
    let param = $row.find(".param input").val();
    let urliframe = $row.find(".urliframe input").val();
    let note = $row.attr("data-note") || "";

    if (!param || !name || !urliframe) {
      alert("Please fill all required fields!");
      return;
    }

    let dt = {
      id: idrow,
      name: name,
      param: param,
      urliframe: urliframe,
      querystr: queryStrValue,
      note: note,
    };

    $.ajax({
      method: "POST",
      url: "/api/insert",
      contentType: "application/json",
      data: JSON.stringify(dt),
      success: function (msg) {
        if (msg.status == "duplicate") {
          $row.remove();
          alert("Duplicate param!");
          performSearch($("#searchInput").val());
        } else {
          location.reload();
        }
      },
      error: function (xhr) {
        alert("Error: " + (xhr.responseJSON?.error || "Unknown error"));
      },
    });
  });

  $("#tbfilter").on("click", ".editt", function () {
    let $btn = $(this);
    let $icon = $btn.find("i");

    $btn.removeClass("editt btn-edit").addClass("update btn-save");
    $icon.removeClass("fa-edit").addClass("fa-save");

    let idrow = $btn.closest("tr").attr("id");
    $("#" + idrow + " input").attr("readonly", false);
    $("#" + idrow + " .param input").focus();
  });

  $("#tbfilter").on("click", ".update", function () {
    let $btn = $(this);
    let $icon = $btn.find("i");

    let idrow = $btn.closest("tr").attr("id");
    let $row = $("#" + idrow);
    let queryStrValue = $row.find('input[name="querystr"]').is(":checked");
    let name = $row.find(".title-input").val();
    let param = $row.find(".param input").val();
    let urliframe = $row.find(".urliframe input").val();
    let note = $row.attr("data-note") || "";

    if (!param || !name || !urliframe) {
      alert("Please fill all required fields!");
      return;
    }

    let dt = {
      name: name,
      param: param,
      urliframe: urliframe,
      querystr: queryStrValue,
      note: note,
    };

    $.ajax({
      method: "PUT",
      url: "/api/update/" + idrow,
      contentType: "application/json",
      data: JSON.stringify(dt),
      success: function (msg) {
        if (msg.status == "duplicate") {
          alert("Duplicate param!");
          location.reload();
        } else {
          $btn.removeClass("update btn-save").addClass("editt btn-edit");
          $icon.removeClass("fa-save").addClass("fa-edit");

          $("#" + idrow + " input").attr("readonly", true);

          const $noteIcon = $row.find(".note-icon-btn");
          if (note) {
            $noteIcon.removeClass("no-note").addClass("has-note");
          } else {
            $noteIcon.removeClass("has-note").addClass("no-note");
          }
        }
      },
      error: function (xhr) {
        alert("Error: " + (xhr.responseJSON?.error || "Unknown error"));
      },
    });
  });

  $("#tbfilter").on("click", ".delete", function () {
    $(".remove").attr("data-id", "only");
    var ID = $(this).closest("tr").attr("id");
    $("#ab").data("id", ID);
  });

  $("#DeleteAll").click(function () {
    $(".remove").attr("data-id", "all");
  });

  $(".remove").click(function () {
    var chkb = $("input[name='options[]']:checked")
      .map(function () {
        return $(this).val();
      })
      .get();

    if ($(".remove").attr("data-id") == "all") {
      if (chkb.length > 0) {
        Promise.all(
          chkb.map((id) =>
            $.ajax({ method: "DELETE", url: "/api/delete/" + id })
          )
        ).then(() => {
          $("#deleteEmployeeModal").modal("hide");
          location.reload();
        });
      } else {
        alert("No items selected!");
      }
    } else {
      let id = $("#ab").data("id");
      $.ajax({
        method: "DELETE",
        url: "/api/delete/" + id,
        success: function () {
          $("#tbfilter tr#" + id).remove();
          performSearch($("#searchInput").val());
          $("#deleteEmployeeModal").modal("hide");
        },
      });
    }
  });

  $("#selectAll").click(function () {
    $('input[name="options[]"]:visible').prop("checked", this.checked);
  });
});
