/* Add extra class .--filled to inputs */

$(function(){
	$('.signup__field-input').on('keyup', function(){
		var $className = "--filled";

		if($(this).val().length > 0)
			$(this).addClass($className);
		else
			$(this).removeClass($className);
	});
});