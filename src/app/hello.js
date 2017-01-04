angular
  .module('app')
  .component('app', {
    templateUrl: 'app/hello.html',
    controller: function($scope) {
      var vm = this;
      vm.init = function() {
        vm.mode = vm.mode || 'javascript';
        //// Initialize Firebase.
        //// TODO: replace with your Firebase project configuration.
        var config = {
          apiKey: "AIzaSyADmSh6f4AjQc9bV2RAl5qfSwuRhDA-lqQ",
          authDomain: "codeme-542e8.firebaseapp.com",
          databaseURL: "https://codeme-542e8.firebaseio.com"
        };
        firebase.initializeApp(config);

        //// Get Firebase Database reference.
        var firepadRef = getExampleRef();
        //// Create CodeMirror (with line numbers and the JavaScript mode).
        vm.codeMirror = CodeMirror(document.getElementById('firepad'), {
          lineNumbers: true,
          extraKeys: { "Ctrl-Space": "autocomplete" },
          mode: vm.mode ? vm.mode : 'javascript',
          theme: 'material'
        });
        // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
        var userId = Math.floor(Math.random() * 9999999999).toString();
        //// Create Firepad (with rich text features and our desired userId).
        var defaultText = '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}';
        if (vm.mode === 'html') {
          defaultText = '<html>\n  <body>\n  </body>\n  </html';
        }
        vm.firepad = Firepad.fromCodeMirror(firepadRef, vm.codeMirror, {
          userId: userId,
          defaultText: defaultText
        });
        //// Create FirepadUserList (with our desired userId).
        var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'),
          document.getElementById('userlist'), userId);
        //// Initialize contents.
        // firepad.on('ready', function() {
        //   if (firepad.isHistoryEmpty()) {
        //     firepad.setText('Check out the user list to the left!');
        //   }
        // });
        CodeMirror.commands.autocomplete = function(cm) {
          var doc = cm.getDoc();
          var POS = doc.getCursor();
          var mode = CodeMirror.innerMode(cm.getMode(), cm.getTokenAt(POS).state).mode.name;

          if (mode == 'xml') { //html depends on xml
            CodeMirror.showHint(cm, CodeMirror.hint.html);
          } else if (mode == 'javascript') {
            CodeMirror.showHint(cm, CodeMirror.hint.javascript);
          } else if (mode == 'css') {
            CodeMirror.showHint(cm, CodeMirror.hint.css);
          }
        };
      };
      vm.update = function() {
        vm.codeMirror.setOption('mode', vm.mode);
        console.log(vm.codeMirror);
      };
      // Helper to get hash from end of URL or generate a random one.
      function getExampleRef() {
        var ref = firebase.database().ref();
        var hash = window.location.hash.replace(/#/g, '');
        if (hash) {
          ref = ref.child(hash);
        } else {
          ref = ref.push(); // generate unique location.
          window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        }
        if (typeof console !== 'undefined') {
          console.log('Firebase data: ', ref.toString());
        }
        return ref;
      }
      vm.init();
    }
  });
