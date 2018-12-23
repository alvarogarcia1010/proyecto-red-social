
/**
 * Clean all form fields.
 * Use: $('#formId').cleanForm();
 *
 * @returns void
 */
$.fn.cleanForm = function()
{
	this.find('input[type=text],input[type=password],input[type=hidden],textarea').each(function()
	{
		if($(this).attr('name') != '_token')
		{
			$(this).val('');
		}
	});

	this.find('select').each(function()
	{
		$(this).val($('#'+$(this).attr('id')+' option:first').val());
	});

	this.find('input[type=checkbox]').each(function()
	{
		 $(this).removeAttr('checked');
	});

	this.find('.has-error').each(function()
	{
		$(this).removeClass('has-error');
	});

	this.find('.has-success').each(function()
	{
		$(this).removeClass('has-success');
	});

	this.find('.help-message-text').remove();
};


$.fn.isEmpty = function()
{
	if(this.is("select"))
	{
		return this.val() == "";
	}
	else
	{
		return $.trim(this.val()) == "";
	}
};
