function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||""
}

myname = getURLParameter('name');
mycourse = getURLParameter('course');

var jqueryNoConflict = jQuery;

// begin main function
jqueryNoConflict(document).ready(function(){

    initializeTabletopObject('https://docs.google.com/spreadsheets/d/1tVM_k3t7uMuah5y1hCtf6Lx7YqRBIk0MzPeeE7WHunU/pubhtml');//replace with your spreadsheet location

});

// pull data from google spreadsheet
function initializeTabletopObject(dataSpreadsheet){
    Tabletop.init({
        key: dataSpreadsheet,
        callback: writeTableWith,
        simpleSheet: true,
        debug: false
    });
}

// create table headers
function createTableColumns(){

    /* swap out the properties of mDataProp & sTitle to reflect
    the names of columns or keys you want to display.
    Remember, tabletop.js strips out spaces from column titles, which
    is what happens with the More Info column header */

    var tableColumns =   [
		{'mDataProp': 'link', 'sTitle': 'Exam','sClass':'exam-entry'},				  
		{'mDataProp': 'subject', 'sTitle': 'Course Name', 'sClass':'course-name'},
		{'mDataProp': 'name', 'sTitle': 'Instructor', 'sClass':'instructor'},
	];
    return tableColumns;
}

// create the table container and object
function writeTableWith(dataSource){

    jqueryNoConflict('#exams').html('<table cellpadding="0" cellspacing="0" border="0" class="display table table-bordered table-striped" id="data-table-container" style="width:100%"></table>');

    var oTable = jqueryNoConflict('#data-table-container').dataTable({
		'sPaginationType': 'bootstrap',
		'bPaginate': false,
		'iDisplayLength': 200,
        'aaData': dataSource,
        'aoColumns': createTableColumns(),
		'dom':'fitr',
        'language': {
			'infoFiltered':'Showing _END_ exam(s) filtered from a total of _MAX_ <span class="btn btn-autofill show-all">Show All</span>',
			'info':'',
			"infoEmpty" : "",
			"zeroRecords" : ""
		
        },
		'drawCallback': function ( settings ) {
			var scrollAnchor = document.getElementById('examsTop');
			var api = this.api();
			$('td.course-name').click(function() {
					var name = $(this).text();
					api.search('').columns().search('').column(1).search(name).draw();
					scrollAnchor.scrollIntoView();
	
			});
			$('td.instructor').click(function() {
					var name = $(this).text();
					api.search('').columns().search('').column(2).search(name).draw();
					scrollAnchor.scrollIntoView();
	
			});
			$('.show-all').click(function() {
					api.search('').columns().search('').draw();
					scrollAnchor.scrollIntoView();
	
			});
			
			
		}
	
    });
	if (myname.length >0) {
	 oTable.fnFilter(myname, 2);
	}
	if (mycourse.length >0) {
	 oTable.fnFilter(mycourse, 1);
	}
	
	
};

//define two custom functions (asc and desc) for string sorting
jQuery.fn.dataTableExt.oSort['string-case-asc']  = function(x,y) {
	return ((x < y) ? -1 : ((x > y) ?  0 : 0));
};

jQuery.fn.dataTableExt.oSort['string-case-desc'] = function(x,y) {
	return ((x < y) ?  1 : ((x > y) ? -1 : 0));
};