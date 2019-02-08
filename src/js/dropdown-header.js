/* Dropdown list for header */

$(function($) {
	var $dropdownListWrp = '.acc-dropdown-wrp', // Wrapper class
		$dropdownControl = '.acc-dropdown-btn', // Control
		$dropdownList = '.acc-dropdown'; // Dropdown list class

	// Click on field
	$($dropdownControl).on('click', function() {
		$(this).next($dropdownList).toggle();
	});

	$($dropdownListWrp).on('click', function(e) {
		e.stopPropagation();
	});
	// Close after click on document
	$(document).on('click', function() {
		$($dropdownList).hide();
	});

});