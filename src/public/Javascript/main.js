$(document).ready(function() {

    function isEmpty()
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

});