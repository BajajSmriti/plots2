(function() {

  // settings at https://github.com/ichord/At.js/wiki/Base-Document#settings

  // checks if the 'name' key in the JSON data is named 'username' or 'name' and then returns the
  // correct key-value
  const displayName = (item) => item.username ? item.username : item.name;

  var at_config = {
    at: "@",
    displayTpl: (item) => `<li>${displayName(item)}</li>`,
    insertTpl: (item) => `@${displayName(item)}`,
    // loads and saves remote JSON data by URL
    data: '/users/active',
    delay: 400,
    callbacks: {
      remoteFilter: debounce(function(query, callback) {
        $.getJSON("/api/srch/profiles?query=" + query + "&sort_by=recent&field=username", {}, function(data) {
          if (data.hasOwnProperty('items') && data.items.length > 0) {
            callback(data.items.map(function(i) { return i.doc_title }));
          }
         });
        }, 200)
      },
      limit: 20
    },
    hashtags_config = {
      at: "#",
      delay: 400,
      callbacks: {
        remoteFilter: debounce(function(query, callback) {
          if (query != ''){
            $.post('/tag/suggested/' + query, {}, function(response) {
               callback(response.map(function(tagnames){ return tagnames }));
             });
            }
          }, 200)
        },
      limit: 20
    },
    emojis_config = {
      at: ':',
      delay: 400,
      data: Object.keys(emoji).map(function(name){ return {'name': name, 'value': emoji[name]}}),
      displayTpl: "<li>${value} ${name}</li>",
      insertTpl: ":${name}:",
      limit: 100
   }

  $('textarea.text-input')
    .atwho(at_config)
    .atwho(hashtags_config)
    .atwho(emojis_config);

})();
