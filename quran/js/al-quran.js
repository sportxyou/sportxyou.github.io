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

    app.controller('QuranController', function ($scope, $http, $window, $timeout) {
   var urlParams = new URLSearchParams(window.location.search);
        var surahNameWithDash = urlParams.get('surah');
        var surahName = surahNameWithDash ? surahNameWithDash.replace(/=/g, "-") : null;

        // Mengatasi URL parameter "&m=1"
        if (urlParams.has('m')) {
            // Mengabaikan parameter "&m=1"
            urlParams.delete('m');
            var newUrl = window.location.pathname + '?' + urlParams.toString();
            history.replaceState(null, null, newUrl);
        }
        
        $http.get('https://apidataislamic.github.io/data/quran.json').then(function (response) {
            $scope.ayahs = response.data.data; 
            $scope.selectedAyah = null;
            $scope.previousSurah = null;
            $scope.nextSurah = null;

            var urlParams = new URLSearchParams(window.location.search);
            var surahNameWithDash = urlParams.get('surah');
            var surahName = surahNameWithDash ? surahNameWithDash.replace(/=/g, "-") : null;

            $scope.selectedSurah = $scope.ayahs.find(function (ayah) {
                return ayah.name.transliteration.id === surahName;
            });

            var surahData = response.data.data.find(function (s) {
                return s.name.transliteration.id === surahName;
            });

           if (surahData) {
                $scope.surah = surahData;
            } else {
                window.location.href = '/';
            }
        });

        $scope.convertToArabic = function(number) {
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            const converted = number.toString().replace(/\d/g, (d) => arabicNumbers[d]);
            return converted;
        };

        $scope.redirectToSelectedSurah = function (selectedSurah) {
            if (selectedSurah) {
                var surahName = selectedSurah.name.transliteration.id;
                var url = '/p/al-quran.html?surah=' + surahName;
                $window.location.href = url;
            }
        };

        $scope.openModal = function (ayah) {
            $scope.selectedAyah = ayah;
        };

        var currentAudio;

        $scope.playAudio = function(ayah) {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
            }

            if (!ayah.audioPlayer) {
                ayah.audioPlayer = new Audio(ayah.audio.primary ? ayah.audio.primary : ayah.audio);
                ayah.audioPlayer.play();
                currentAudio = ayah.audioPlayer;
            } else {
                if (!ayah.audioPlayer.paused) {
                    ayah.audioPlayer.pause();
                    ayah.audioPlayer.currentTime = 0;
                } else {
                    ayah.audioPlayer.play();
                    currentAudio = ayah.audioPlayer;
                }
            }
        };

        // NAVIGATION PREV & NEXT
        $scope.loadPreviousSurah = function () {
                var currentIndex = $scope.ayahs.findIndex(function (ayah) {
                    return ayah.name.transliteration.id === $scope.selectedSurah.name.transliteration.id;
                });

                if (currentIndex > 0) {
                    $scope.selectedSurah = $scope.ayahs[currentIndex - 1];
                    $scope.redirectToSelectedSurah($scope.selectedSurah);
                }

                $scope.updateSurahNavigation();
                $scope.$apply(); // Pembaruan tampilan
            };

            $scope.loadNextSurah = function () {
                var currentIndex = $scope.ayahs.findIndex(function (ayah) {
                    return ayah.name.transliteration.id === $scope.selectedSurah.name.transliteration.id;
                });

                if (currentIndex < $scope.ayahs.length - 1) {
                    $scope.selectedSurah = $scope.ayahs[currentIndex + 1];
                    $scope.redirectToSelectedSurah($scope.selectedSurah);
                }

                $scope.updateSurahNavigation();
                $scope.$apply(); // Pembaruan tampilan
            };

            $scope.updateSurahNavigation = function () {
                var currentIndex = $scope.ayahs.findIndex(function (ayah) {
                    return ayah.name.transliteration.id === $scope.selectedSurah.name.transliteration.id;
                });

                $scope.previousSurah = currentIndex > 0 ? $scope.ayahs[currentIndex - 1] : null;
                $scope.nextSurah = currentIndex < $scope.ayahs.length - 1 ? $scope.ayahs[currentIndex + 1] : null;
            };

            // Panggil updateSurahNavigation dengan sedikit penundaan menggunakan $timeout
            $timeout(function () {
                $scope.updateSurahNavigation();
            });

        // ReadMore Tafsir
  $scope.limitWords = function (text, limit) {
        if (!text) return ''; // Kembalikan string kosong jika teks tidak ada atau tidak terdefinisi

        // Mengambil array kata dari teks
        var words = text.split(/\s+/);

        // Mengambil sejumlah kata sesuai dengan batasan
        var limitedWords = words.slice(0, limit);

        // Menggabungkan kembali kata-kata tersebut dan menambahkan tanda elipsis jika terdapat kata lebih lanjut
        return limitedWords.join(' ') + (words.length > limit ? '...' : '');
    };

    $scope.showFullTafsir = function () {
        // Menampilkan teks tafsir secara penuh atau menutupnya saat "Read More/Less" diklik
        $scope.fullTafsirShown = !$scope.fullTafsirShown;
    };

    $scope.getLimitedTafsir = function () {
        // Mengambil teks tafsir sesuai dengan status "Read More/Less"
        if ($scope.surah && $scope.surah.tafsir) {
            return $scope.fullTafsirShown ? $scope.surah.tafsir.id : $scope.limitWords($scope.surah.tafsir.id, 40);
        }
        return ''; // Mengembalikan string kosong jika tidak ada tafsir yang terdefinisi
    };

    $scope.shouldShowReadMore = function () {
        // Memeriksa apakah perlu menampilkan "Read More" berdasarkan panjang teks tafsir
        return $scope.surah && $scope.surah.tafsir && $scope.surah.tafsir.id.length > 40;
    };
        });
