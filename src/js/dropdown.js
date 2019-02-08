/* Dropdown lists for inputs */

$(function($) {
	var $dropdownListWrp = '.dropdown-wrp', // Wrapper class
		$dropdownControl = '.dropdown-control', // Control
		$dropdownList = '.dropdown-list',	// Dropdown list class
		$openedClass = '--opened';

	// Custom methods for showing/hiding dropdown list
	$.fn.hideList = function() {
		return this.hide().attr('aria-hidden', 'true');
	};
	$.fn.showList = function() {
		return this.show().attr('aria-hidden', 'false');
	};

	// Click on field
	$($dropdownControl).on('click', function() {
		$(this).addClass($openedClass).next($dropdownList).showList();
		$($dropdownControl).not(this).next($dropdownList).hideList();
	});
	// Close after item dropdown & copy item name
	$('.dropdown-list__item').on('click', function() {
		var $itemName = $(this).children().text();
		$(this).parent($dropdownList).hideList().prev($dropdownControl).text($itemName).removeClass($openedClass);
	});

	$($dropdownListWrp).on('click', function(e) {
		e.stopPropagation();
	});
	// Close after click on document
	$(document).on('click', function() {
		$($dropdownList).hideList();
		$($dropdownControl).removeClass($openedClass);
	});

});