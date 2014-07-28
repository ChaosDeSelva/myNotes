angular.module('myApp', []).service('notesService', function () {
    var data = [];
    
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.        
        var loadData = localStorage.getItem("myNotes");
        
        if ( loadData !== null ){
            data = JSON.parse(loadData);
        }
    } else {
        // Sorry! No Web Storage support..
        alert('Localstorage is not support!');
    }

    return {
        saveLocalStore:function(){
            if(typeof(Storage) !== "undefined") {
                // Code for localStorage/sessionStorage.
                localStorage.setItem("myNotes", angular.toJson(data));
            } else {
                // Sorry! No Web Storage support..
                alert('Localstorage is not support!');
            }
        },
        
        notes:function () {
            return data;
        },
        
        addNote:function (noteTitle) {
            if ( noteTitle.length < 86 ){                
                var dup = true;
                var rnd = 0;
                var safeCheck = 0;
                while ( dup === true ){
                    rnd = Math.floor(Math.random()*90000) + 10000;
                    for ( var i = 0; i < data.length; i++ ){
                        //Found a dup so try again
                        if ( data[i].id === rnd ){
                            dup = true;
                            break;    
                        } else {
                            dup = false;    
                        }
                    }
                    safeCheck++;
                    //Something is odd with all the loop checking so just end it
                    if ( safeCheck > 10000 ){
                        dup = false;    
                        //TODO throw an error
                    }
                }
                
                data.push({
                    id:rnd, 
                    title:noteTitle
                });
                this.saveLocalStore();
            } else {
                alert('Note can not exceed 85 characters!');    
            }
        },
        
        deleteNote:function (id) {
            var oldNotes = data;
            data = []; 

            angular.forEach(oldNotes, function (note) {
                if (note.id !== id) { 
                    data.push(note); 
                }
            });
            this.saveLocalStore();
        },
        
        showAddNote:function(){
            $('#newNote').hide();    
            $('#newNotePanel').fadeIn();    
        },
        
        cancelNote:function(){
            $('#newNote').fadeIn();    
            $('#newNotePanel').hide();    
        }
    };
    
}).directive('myNotebook', function () {
    return {
        restrict:"E",
        scope:{
            notes:'=',
            ondelete:'&'
        },
        
        templateUrl:"partials/notebook",
        
        controller:function ($scope, $attrs) {
            $scope.deleteNote = function (id) {
                $scope.ondelete({id:id});
            }
        }
    };
    
}).directive('myNote', function () {
    return {
        restrict:'E',
        scope:{
            delete:'&',
            note:'='
        },
        
        link:function (scope, element, attrs) {
            var $el = $(element).parent();
            $el.hide().fadeIn('slow');
        }
    };
    
}).controller('NotebookCtrl', ['$scope', 'notesService', function ($scope, notesService) {
    $scope.getNotes = function () {
        return notesService.notes();
    };

    $scope.addNote = function (noteTitle) {
        if(noteTitle !== '') {
            notesService.addNote(noteTitle);
        }
    };

    $scope.deleteNote = function (id) {
        notesService.deleteNote(id);
    };

    $scope.resetForm = function() {
        $scope.noteTitle = '';            
    };
    
    $scope.showAddNote = function() {
        notesService.showAddNote();            
    };
    
    $scope.cancelNote = function() {
        notesService.cancelNote();            
    };
}]);