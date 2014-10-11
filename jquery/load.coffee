document.write  """
<script type="text/javascript" src="../expand.js"></script>
"""

$('.switch').click ->
  $.getScript '../expand.js',->
    console.log 'load expand.js'