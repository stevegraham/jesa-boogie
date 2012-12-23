(function() {
  document.addEventListener('DOMContentLoaded', function(ev) {
    var context = new webkitAudioContext();
    navigator.webkitGetUserMedia({ audio: true, video: false }, function(stream) {
      var BUFFER_SIZE   = 256;
      var k             = 70;

      var sign = function(x) { return Number(x) > 0 ? 1 : 0; };
      var clip = function(x) { return sign(x) * Math.pow(Math.atan(Math.pow(Math.abs(x), k)), 1 / k); };

      var inputNode     = context.createMediaStreamSource(stream);
      var delayNode     = context.createDelayNode();
      var jsNode        = context.createJavaScriptNode(BUFFER_SIZE);

      console.log(jsNode);
      jsNode.onaudioprocess = function(e) {
        var input  = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);

        for(var i = 0; i < BUFFER_SIZE; i++) output[i] = clip(input[i]);
      }

      delayNode.delayTime.value = 0.4;

      inputNode.connect(jsNode);
      inputNode.connect(delayNode);
      jsNode.connect(context.destination);
      delayNode.connect(context.destination);
    });
  });
}).call(this);
