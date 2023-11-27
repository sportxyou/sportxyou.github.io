var app = angular.module('QuranApp', []);

        app.filter('formatNumber', function () {
            return function (input) {
                // Merubah format angka
                if (input < 10) {
                    return '00' + input;
                } else if (input < 100) {
                    return '0' + input;
                } else {
                    return input;
                }
            };
        });

        app.controller('QuranController', function ($scope, $http, $window) {
            $http.get('https://apidataislamic.github.io/data/quran.json').then(function (response) {
                $scope.ayahs = response.data.data;

                // Bagi array ayahs menjadi tiga bagian
                var chunkSize = Math.ceil($scope.ayahs.length / 3);
                $scope.rows = [];
                for (var i = 0; i < $scope.ayahs.length; i += chunkSize) {
                    $scope.rows.push($scope.ayahs.slice(i, i + chunkSize));
                }

                // Fungsi untuk mengarahkan ke halaman surah.html dengan nomor surah
                // Fungsi untuk mengarahkan ke halaman surah.html dengan nomor surah
// Fungsi untuk mengarahkan ke halaman surah.html dengan nomor surah
$scope.redirectToSurah = function (surahName) {
    $window.location.href = '/p/al-quran.html?surah=' + surahName;
};

 // Fungsi untuk mengarahkan ke halaman surah.html dengan surah yang dipilih dari dropdown
                $scope.redirectToSelectedSurah = function () {
                    if ($scope.selectedSurah) {
                        $scope.redirectToSurah($scope.selectedSurah.name.transliteration.id);
                    }
                };
            });
        });
