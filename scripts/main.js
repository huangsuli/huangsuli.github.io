  'use strict';
  
  var currentId;

  window.onload = function(){
    document.getElementById('sign-in').addEventListener('click', signIn, false);
    document.getElementById('sign-up').addEventListener('click', signUp, false);
    document.getElementById('reset').addEventListener('click', resetPassword, false);
    document.getElementById('sign-out').addEventListener('click',function(){
      firebase.auth().signOut();}
      ,false);
 
    document.getElementById('report').addEventListener('click', activeReportPage, false);
    document.getElementById('history').addEventListener('click', activeHistoryPage,false);
    document.getElementById('upload').addEventListener('click', uploadData,false)
    var initialPage = document.getElementById('initial-page');
    var mainPage = document.getElementById('main-page');
    
    

    firebase.auth().onAuthStateChanged(function(user){
      if(user && currentId == user.uid){
        return;
      }
      if(user){
        currentId = user.uid;
        initialPage.style.display = 'none';
        mainPage.style.display = '';
      }
      else{
        currentId = null;
        initialPage.style.display = '';
        mainPage.style.display = 'none';
      }
    });

  }
 
  function signIn() {
     var email = document.getElementById('email').value;
     var password = document.getElementById('password').value;

     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
       var errorCode = error.code;
       var errorMessage = error.message;

       if(errorCode == 'auth/wrong-password'){
        alert('Wrong password');
       }
       else{
        alert(errorMessage);
       }
       console.log(error);
     });
  }


  function signUp() {
     var email = document.getElementById('email').value;
     var password = document.getElementById('password').value;
     
     firebase.auth().createUserWithEmailAndPassword(email,password).catch(function(error){
       var errorCode = error.code;
       var errorMessage = error.message;

       if(errorCode == 'auth/weak-password'){
        alert('Weak password');
       }
       else{
        alert(errorMessage);
       }
       console.log(error);
     });

  }
  

  function resetPassword(){
     var email = document.getElementById('email').value;

     firebase.auth().sendPasswordResetEmail(email).then(function(){

        alert('Password Reset Email Sent');
     }).catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
     });
  }

  function activeReportPage(){
     var report = document.getElementById('report');
     var history = document.getElementById('history');
     var reportPage = document.getElementById('report-page');
     var historyPage = document.getElementById('history-page');
     
     reportPage.style.display = '';
     historyPage.style.display = 'none';

     report.className = 'nav-item active';
     history.className = 'nav-item';
  }

  function activeHistoryPage(){
     var report = document.getElementById('report');
     var history = document.getElementById('history');
     var reportPage = document.getElementById('report-page');
     var historyPage = document.getElementById('history-page');
     
     reportPage.style.display = 'none';
     historyPage.style.display = '';
     
     report.className = 'nav-item';
     history.className = 'nav-item active';
     showHistory();
  }

  function uploadData(){
     var req = document.getElementById('req').value;
     var project = document.getElementById('project').value;
     var component = document.getElementById('component').value;
     var faultClass = document.getElementById('fault-class').value;
     var faultType = document.getElementById('fault-type').value;
     var faultDescripion = document.getElementById('fault-description').value;
     var currentUID = firebase.auth().currentUser.uid;
     var bugId = firebase.database().ref().child('bugs').push().key;
     var date = new Date();
     
     firebase.database().ref('users/'+ currentUID + '/' + bugId).set({
         date: date.toString()
     });

     firebase.database().ref('bugs/' + bugId).set({
      author: currentUID,
      project: project,
      component: component,
      faultClass: faultClass,
      faultType: faultType,
      faultDescripion: faultDescripion
     });
   }

   function showHistory(){
      var currentUID = firebase.auth().currentUser.uid;
      var bugs;
      firebase.database().ref('users/' + currentUID).once('value').then(function(snapshot){
        bugs = snapshot.val();
        
      });
      console.log(bugs);
      console.log(bugs.length);
      /*var html = '<div class="container">'+
            '<div class="panel panel-default">'+
              '<div class="panel-heading">'+ 'BUG#' + bugId + '</div>' +
                  '<ul class="list-group">'
                    '<li class="list-group-item">' + req + '</li>' +
                    '<li class="list-group-item">' + project + '</li>' +
                    '<li class="list-group-item">' + faultClass + '</li>' +
                    '<li class="list-group-item">' + faultType + '</li>' +
                    '<li class="list-group-item">' + faultDescripion + '</li>' +
                  '</ul>'+
            '</div>' +
          '</div>';*/


   }