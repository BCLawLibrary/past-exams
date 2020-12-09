function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||""
}

myname = getURLParameter('name');
mycourse = getURLParameter('course');

// create table headers
function createTableColumns(){

    /* swap out the properties of data & title to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
    {'data': 'link', 'title': 'Exam','className':'exam-entry'},
    {'data': 'subject', 'title': 'Course Name', 'className':'course-name'},
    {'data': 'name', 'title': 'Instructor', 'className':'instructor'},
  ];
    return tableColumns;
}

// create the table container and object
$(document).ready(function(){



    $('#exams').html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered table-striped" id="data-table-container" style="width:100%"></table>');

    var oTable = $('#data-table-container').dataTable({
		'paginationType': 'bootstrap',
		'paginate': false,
		'displayLength': 200,

        'columns': createTableColumns(),
		'dom':'fitr',
        'language': {
			'infoFiltered':'Showing _END_ exam(s) filtered from a total of _MAX_ <span class="btn btn-autofill show-all">Show All</span>',
			'info':'',
			"infoEmpty" : "",
			"zeroRecords" : ""

        },
        'ajax' : {
          url:'https://sheets.googleapis.com/v4/spreadsheets/1tVM_k3t7uMuah5y1hCtf6Lx7YqRBIk0MzPeeE7WHunU/values/A:I?key=AIzaSyD8Y28YJpVhE4XlVlOoA74Ws47YdPz5nGA',
          cache: true,
          'dataSrc': function(json) {
            var myData = json['values']; //spreadsheet data lives in an array with the name values
            //rewrite data to an object with key-value pairs. This is also a chance to rename or ignore columns
            myData= myData.map(function( n, i ) {
                var myObject = {
                  subject:n[0],
                  url:n[1],
                  title:n[2],
                  name:n[3],
                  semester:n[4],
                  fullTitle:n[5],
                  link:n[6],
                  nameLink:n[7],
                  courseLink:n[8]
                };
                return myObject;
            });
            myData.splice(0,1); //remove the first row, which contains the original column headers
            return myData;
          }
        },
		'drawCallback': function ( settings ) {
			var scrollAnchor = document.getElementById('examsTop');
			var api = this.api();
			$('td.course-name').click(function() {
					var name = $(this).text();
					api.search('').columns().search('').column(1).search(name).draw();
					$('html,body').stop().animate({scrollTop: $('#exams-title').offset().top});


			});
			$('td.instructor').click(function() {
					var name = $(this).text();
					api.search('').columns().search('').column(2).search(name).draw();
					$('html,body').stop().animate({scrollTop: $('#exams-title').offset().top});


			});
			$('.show-all').click(function() {
					api.search('').columns().search('').draw();
					if ($('#exams-title').offset().top < $('html,body').scrollTop() ) {
						$('html,body').stop().animate({scrollTop: $('#exams-title').offset().top});
					}

			});


		}

    });
	if (myname.length >0) {
	 oTable.fnFilter(myname, 2);
	}
	if (mycourse.length >0) {
	 oTable.fnFilter(mycourse, 1);
	}

	$(window).bind("mousewheel", function() {
		$("html, body").stop();
	});


});

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};
