// --- Utility --- //

function request (path, method, success) {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status == 200) {
      success(request.responseText);
    }
  };

  request.open(method, path, true);
  request.send();
}

function makeElement(options) {
  var result = document.createElement(options.tag);

  if (options.properties !== undefined) {
    _.extend(result, options.properties);
  }

  return result;
}
