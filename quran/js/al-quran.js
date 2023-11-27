var app = angular.module('QuranApp', []);

        app.filter('formatNumber', function () {
            return function (input) {
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
            // Mendapatkan nama surah dari parameter URL dengan karakter "-" diganti dengan "="
var urlParams = new URLSearchParams(window.location.search);
var surahNameWithDash = urlParams.get('surah');
var surahName = surahNameWithDash ? surahNameWithDash.replace(/=/g, "-") : null;

            // Mengambil data surah berdasarkan nama
            $http.get('https://apidataislamic.github.io/data/quran.json').then(function (response) {
                $scope.ayahs = response.data.data; 
                $scope.selectedAyah = null;

                // Mendapatkan nama surah dari parameter URL dengan karakter "-" diganti dengan "="
                var urlParams = new URLSearchParams(window.location.search);
                var surahNameWithDash = urlParams.get('surah');
                var surahName = surahNameWithDash ? surahNameWithDash.replace(/=/g, "-") : null;

                // Menetapkan surah yang dipilih berdasarkan parameter URL
                $scope.selectedSurah = $scope.ayahs.find(function (ayah) {
                    return ayah.name.transliteration.id === surahName;
                });

                // Mengambil data surah yang dipilih
                var surahData = response.data.data.find(function (s) {
                    return s.name.transliteration.id === surahName;
                });

                if (surahData) {
                    $scope.surah = surahData;
                } else {
                    // Redirect ke halaman utama jika surah tidak ditemukan
                    window.location.href = '/';
                }
            });

            // convert to arabic function
            $scope.convertToArabic = function(number) {
                // Fungsi untuk mengonversi angka ke angka Arab
                const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
                const converted = number.toString().replace(/\d/g, (d) => arabicNumbers[d]);
                return converted;
            };

              // Fungsi untuk mengarahkan ke halaman surah.html dengan surah yang dipilih dari dropdown
        // $scope.redirectToSelectedSurah = function () {
        //     if ($scope.selectedSurah) {
        //         var surahName = $scope.selectedSurah.name.transliteration.id;
        //         var url = '/p/al-quran.html?surah=' + surahName;

        //         // Mengganti URL dengan parameter yang baru
        //         $window.location.href = url;
        //     }
        // };

        $scope.redirectToSelectedSurah = function (selectedSurah) {
    if (selectedSurah) {
        var surahName = selectedSurah.name.transliteration.id;
        var url = '/p/al-quran.html?surah=' + surahName;

        // Redirect to the new URL
        $window.location.href = url;
    }
};


 // Fungsi untuk membuka offcanvas dengan tafsir yang sesuai
 $scope.openModal = function (ayah) {
        $scope.selectedAyah = ayah;
    };
// Fungsi untuk memutar audio
var currentAudio;

$scope.playAudio = function(ayah) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Mengembalikan waktu audio ke awal saat dihentikan
    }

    if (!ayah.audioPlayer) {
        ayah.audioPlayer = new Audio(ayah.audio.primary ? ayah.audio.primary : ayah.audio);
        ayah.audioPlayer.play();
        currentAudio = ayah.audioPlayer;
    } else {
        if (!ayah.audioPlayer.paused) {
            ayah.audioPlayer.pause();
            ayah.audioPlayer.currentTime = 0; // Mengembalikan waktu audio ke awal saat dihentikan
        } else {
            ayah.audioPlayer.play();
            currentAudio = ayah.audioPlayer;
        }
    }
};
});
