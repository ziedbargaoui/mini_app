$(document).ready(function(){$("#content_type_name").keypress(function(){var b=$(this);var a=$("#content_type_slug");if(!a.hasClass("filled")){setTimeout(function(){a.val(makeSlug(b.val()))},50)}});$("#content_type_slug").keypress(function(){$(this).addClass("filled")})});