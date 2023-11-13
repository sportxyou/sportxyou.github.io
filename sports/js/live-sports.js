var app = angular.module('sport', []);
var leagueName = "nfl";
var sport = "Soccer";
var currentDate = new Date().toISOString().slice(0, 10);
var scheduleId = currentDate;

app.controller('mySport', function ($scope, $http, $q) {
    // URL untuk memuat data tim
    var urlTeams = `https://www.thesportsdb.com/api/v1/json/${apiKey}/search_all_teams.php?l=${leagueName}`;

    // URL untuk memuat data acara
    var urlEvents = `https://www.thesportsdb.com/api/v1/json/${apiKey}/eventsday.php?d=${scheduleId}&l=${leagueName}`;

    // Menggunakan $q.all untuk menggabungkan dua promise
    $q.all([
        $http.get(urlTeams),
        $http.get(urlEvents)
    ]).then(function (responses) {
        // Mengambil data tim dari respon pertama
        var teams = responses[0].data.teams;

        // Mengambil data acara dari respon kedua
        var events = responses[1].data.events;
        var venue = event.strVenue || "-";

        // Menyusun data tim menjadi objek dengan nama tim sebagai kunci
        var teamsMap = {};
        teams.forEach(function (team) {
            teamsMap[team.strTeam] = team;
        });

        // Menambahkan data badge ke setiap acara
        events.forEach(function (event) {
            event.strHomeBadge = teamsMap[event.strHomeTeam].strTeamBadge;
            event.strAwayBadge = teamsMap[event.strAwayTeam].strTeamBadge;
        });

        // Mengatur data acara yang sudah diubah pada $scope
        $scope.events = events;
    }).catch(function (error) {
        // Menangani kesalahan jika terjadi
        console.error('Error fetching data:', error);
    });

    $http.get(`https://www.thesportsdb.com/api/v2/json/${apiKey}/livescore.php?s=${sport}`)
    .then(function(response) {
        $scope.footballData = response.data;
    })
    .catch(function(error) {
        console.log('Error fetching data', error);
    });


    // Fungsi untuk mengonversi waktu ke waktu setempat pengguna
    $scope.convertToLocalTime = function (date, time) {
        var dateTimeString = date + ' ' + time;
        var eventDateTime = new Date(dateTimeString + ' UTC');

        // Mendapatkan offset waktu setempat
        var offset = new Date().getTimezoneOffset();
        
        // Menambahkan offset ke waktu acara
        eventDateTime.setMinutes(eventDateTime.getMinutes() - offset);

        // Mendapatkan jam dan menit dalam format 24 jam
        var hours = eventDateTime.getHours();
        var minutes = eventDateTime.getMinutes();

        // Menambahkan nol di depan jika jam atau menit kurang dari 10
        var formattedTime = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;

        // Mengembalikan waktu dalam format yang diinginkan
        return formattedTime;
    };

    // Fungsi untuk mendapatkan URL gambar badge tim
    $scope.getTeamBadge = function (teamName) {
        if ($scope.events) {
            var matchingEvent = $scope.events.find(function (event) {
                return event.strHomeTeam === teamName || event.strAwayTeam === teamName;
            });
            if (matchingEvent) {
                return matchingEvent.strHomeTeam === teamName ? matchingEvent.strHomeBadge : matchingEvent.strAwayBadge;
            }
        }
        return ''; // Mengembalikan string kosong jika tidak ada korespondensi
    };

     // Fungsi untuk mem-parsing hasil pertandingan ke dalam objek yang lebih mudah diolah
$scope.parseResult = function (resultString) {
    var quarters = resultString.split('<br>');
    var result = {};

    for (var i = 0; i < quarters.length; i += 2) {
        var quarter = quarters[i].trim();
        var scores = quarters[i + 1].trim().split(' ');

        result[quarter] = [scores[0], scores[1]];
    }

    return result;
};
});
